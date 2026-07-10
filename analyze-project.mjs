#!/usr/bin/env node
/**
 * analyze-project.mjs
 *
 * Recorre src/ (o la carpeta que indiques), envía cada componente/page a un
 * modelo corriendo en LM Studio para que resuma qué hace, y detecta si el
 * archivo es importado/usado en algún otro lugar del proyecto.
 *
 * Requisitos:
 *  - Node 18+ (usa fetch nativo)
 *  - LM Studio corriendo el servidor local (Developer > Local Server)
 *
 * Uso:
 *   node analyze-project.mjs
 *   node analyze-project.mjs --dir src --out project-analysis.md
 *   node analyze-project.mjs --model qwen2.5-coder-14b-instruct --url http://127.0.0.1:1234
 *
 * Config rápida abajo en CONFIG si no quieres pasar flags.
 */

import fs from "node:fs/promises";
import path from "node:path";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const args = parseArgs(process.argv.slice(2));

const CONFIG = {
  rootDir: args.dir || "src",
  outFile: args.out || "project-analysis.md",
  lmStudioUrl: args.url || "http://127.0.0.1:1234",
  model: args.model || "qwen2.5-coder-7b-instruct",
  extensions: [".tsx", ".ts"],
  ignoreDirs: new Set(["node_modules", ".next", ".git", "dist", "build"]),
  ignoreFiles: [/\.d\.ts$/, /\.test\.tsx?$/, /\.spec\.tsx?$/],
  // alias tal como esté configurado en tsconfig.json, ej "@/*" -> "src/*"
  aliasPrefix: "@/",
  aliasBase: "src",
  concurrency: 3, // LM Studio mostró "Parallel 4", dejamos margen
  maxCharsPerFile: 14000, // con contexto de 20514 tokens en LM Studio hay margen de sobra
  maxRetries: 3, // reintentos con recorte progresivo si el modelo rechaza por contexto
};

// ---------------------------------------------------------------------------
// UTILIDADES DE ARGUMENTOS
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. RECOLECTAR ARCHIVOS
// ---------------------------------------------------------------------------
async function walk(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (CONFIG.ignoreDirs.has(entry.name)) continue;
      results.push(...(await walk(full)));
    } else {
      const ext = path.extname(entry.name);
      if (!CONFIG.extensions.includes(ext)) continue;
      if (CONFIG.ignoreFiles.some((re) => re.test(entry.name))) continue;
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// 2. DETECCIÓN DE USO (quién importa a quién)
// ---------------------------------------------------------------------------
// Genera las posibles formas en que otros archivos podrían importar `file`
function possibleImportSpecifiers(file) {
  const noExt = file.replace(/\.(tsx|ts)$/, "");
  const specifiers = new Set();

  // relativo desde la raíz del proyecto (sirve para hacer match parcial)
  specifiers.add(noExt);

  // versión con alias @/... si cae dentro de aliasBase (ej "src")
  if (noExt.startsWith(CONFIG.aliasBase + path.sep)) {
    const rel = noExt.slice((CONFIG.aliasBase + path.sep).length);
    specifiers.add(CONFIG.aliasPrefix + rel.split(path.sep).join("/"));
  }

  // nombre de archivo base (para imports tipo "./DoctorCard")
  const baseName = path.basename(noExt);
  specifiers.add(baseName);

  return Array.from(specifiers).map((s) => s.split(path.sep).join("/"));
}

function findUsages(targetFile, allFiles, fileContents) {
  const specifiers = possibleImportSpecifiers(targetFile);
  const usages = [];

  for (const otherFile of allFiles) {
    if (otherFile === targetFile) continue;
    const content = fileContents.get(otherFile);
    if (!content) continue;

    // busca líneas de import/require que mencionen alguno de los specifiers
    const importLines = content
      .split("\n")
      .filter((line) => /\b(import|require)\b/.test(line));

    for (const line of importLines) {
      for (const spec of specifiers) {
        // evita falsos positivos con nombres muy cortos (ej "ui")
        if (spec.length < 4) continue;
        if (line.includes(spec)) {
          usages.push({ file: otherFile, line: line.trim() });
          break;
        }
      }
    }
  }

  return usages;
}

// Archivos de Next.js que se activan por convención de nombre/ubicación,
// no por import directo (App Router pages/layouts, middleware/proxy, etc.)
function isNextRouteFile(file) {
  return /[\\/]page\.tsx$|[\\/]layout\.tsx$|[\\/]template\.tsx$|[\\/]route\.tsx?$|(^|[\\/])middleware\.tsx?$|(^|[\\/])proxy\.tsx?$|[\\/]instrumentation\.tsx?$|[\\/]not-found\.tsx$|[\\/]error\.tsx$|[\\/]global-error\.tsx$|[\\/]loading\.tsx$|[\\/]default\.tsx$|[\\/]robots\.ts$|[\\/]sitemap\.ts$|[\\/]manifest\.ts$|[\\/]opengraph-image\.tsx?$|[\\/]icon\.tsx?$/.test(
    file
  );
}

// ---------------------------------------------------------------------------
// 3. LLAMADA A LM STUDIO
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT =
  "Eres un asistente que documenta el código de un proyecto Next.js/React/TypeScript. " +
  "Genera documentación técnica breve y clara para el archivo, en español, usando EXACTAMENTE este formato (markdown, sin encabezados extra, sin repetir el nombre del archivo):\n\n" +
  "**Propósito:** (1-2 líneas describiendo qué hace y para qué sirve dentro del proyecto)\n" +
  "**Props / parámetros:** (lista corta de props, argumentos o datos que recibe; escribe \"Ninguno\" si no aplica)\n" +
  "**Exporta:** (qué exporta el archivo: componente, función, hook, tipo, etc.)\n" +
  "**Dependencias clave:** (librerías o módulos internos relevantes que importa, ej. supabase, framer-motion, otros componentes propios)\n" +
  "**Estado:** (funcional / parece incompleto o placeholder / contiene TODOs, en una frase)\n\n" +
  "Sé conciso, no inventes información que no esté en el código. Si el código está truncado, documenta solo con base en lo que ves.";

// Indica si la respuesta del server sugiere que el problema es tamaño de contexto
// (para saber si vale la pena reintentar con menos texto, o si es otro tipo de error)
function looksLikeContextError(status, text) {
  const t = (text || "").toLowerCase();
  return (
    status === 400 ||
    status === 500 ||
    t.includes("context") ||
    t.includes("exceed") ||
    t.includes("token")
  );
}

async function callLMStudio(file, trimmed) {
  const body = {
    model: CONFIG.model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Archivo: ${file}\n\n\`\`\`tsx\n${trimmed}\n\`\`\``,
      },
    ],
    temperature: 0.2,
    max_tokens: 350,
  };

  const res = await fetch(`${CONFIG.lmStudioUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    err.status = res.status;
    err.bodyText = text;
    throw err;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "(sin respuesta del modelo)";
}

async function analyzeWithLLM(file, content) {
  let limit = Math.min(content.length, CONFIG.maxCharsPerFile) || content.length;
  let lastErr = null;

  for (let attempt = 0; attempt <= CONFIG.maxRetries; attempt++) {
    const trimmed =
      content.length > limit
        ? content.slice(0, limit) + "\n// ...(truncado)"
        : content;

    try {
      return await callLMStudio(file, trimmed);
    } catch (err) {
      lastErr = err;
      const isContextError = looksLikeContextError(err.status, err.bodyText);
      if (!isContextError || attempt === CONFIG.maxRetries) break;
      // recorta a la mitad y reintenta
      limit = Math.floor(limit / 2);
      if (limit < 300) break; // ya no vale la pena seguir recortando
      console.log(
        `  ↻ Reintentando ${file} con menos contenido (${limit} chars) tras error...`
      );
    }
  }

  if (lastErr) {
    if (lastErr.status) {
      return `⚠️ Error HTTP ${lastErr.status} al analizar (incluso tras reintentos con recorte): ${lastErr.bodyText?.slice(0, 200) || lastErr.message}`;
    }
    return `⚠️ Error de conexión con LM Studio: ${lastErr.message}`;
  }
  return "(sin respuesta del modelo)";
}

// ---------------------------------------------------------------------------
// 4. CONCURRENCIA SIMPLE
// ---------------------------------------------------------------------------
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// 5. MAIN
// ---------------------------------------------------------------------------
async function main() {
  console.log(`🔍 Escaneando "${CONFIG.rootDir}"...`);
  const files = await walk(CONFIG.rootDir);
  console.log(`📄 Encontrados ${files.length} archivos .ts/.tsx`);

  console.log("📖 Leyendo contenido de todos los archivos...");
  const fileContents = new Map();
  for (const f of files) {
    fileContents.set(f, await fs.readFile(f, "utf-8"));
  }

  console.log(
    `🤖 Analizando con LM Studio (${CONFIG.model}) — esto puede tardar...`
  );

  let done = 0;
  const analyses = await mapWithConcurrency(files, CONFIG.concurrency, async (file) => {
    const content = fileContents.get(file);
    const [summary, usages] = await Promise.all([
      analyzeWithLLM(file, content),
      Promise.resolve(findUsages(file, files, fileContents)),
    ]);
    done++;
    console.log(`  [${done}/${files.length}] ${file}`);
    return { file, summary, usages, isRoute: isNextRouteFile(file) };
  });

  // ---------------------------------------------------------------------
  // 6. GENERAR DOCUMENTACIÓN
  // ---------------------------------------------------------------------
  analyses.sort((a, b) => a.file.localeCompare(b.file));

  const unusedCount = analyses.filter(
    (a) => !a.isRoute && a.usages.length === 0
  ).length;

  // Agrupa por carpeta contenedora (ej: src/components/dashboard, src/features/profile/components)
  const groups = new Map();
  for (const a of analyses) {
    const dir = path.dirname(a.file).split(path.sep).join("/");
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir).push(a);
  }
  const sortedDirs = Array.from(groups.keys()).sort();

  let md = `# Documentación técnica del proyecto\n\n`;
  md += `> Generada automáticamente el ${new Date().toLocaleString()} analizando cada archivo con el modelo \`${CONFIG.model}\` vía LM Studio. Revisa y ajusta manualmente donde haga falta.\n\n`;
  md += `**Resumen general**\n\n`;
  md += `- Carpetas documentadas: **${sortedDirs.length}**\n`;
  md += `- Archivos documentados: **${analyses.length}**\n`;
  md += `- Archivos sin referencias de uso detectadas: **${unusedCount}** (ver nota abajo)\n\n`;
  md += `> ⚠️ La detección de "uso" es heurística (búsqueda de texto en imports). Puede haber falsos positivos con barrels/index.ts, imports dinámicos (\`dynamic()\`, \`React.lazy\`) o alias distintos a \`@/\`. Las rutas y archivos de convención de Next.js (\`page.tsx\`, \`layout.tsx\`, \`template.tsx\`, \`route.ts\`, \`middleware.ts\`, \`proxy.ts\`, etc.) siempre se marcan como usados porque se activan por convención de nombre/carpeta, no por import.\n\n`;

  // Índice
  md += `## Índice\n\n`;
  for (const dir of sortedDirs) {
    const anchor = dir.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    md += `- [${dir}](#${anchor}) (${groups.get(dir).length} archivo${groups.get(dir).length > 1 ? "s" : ""})\n`;
  }
  md += `\n---\n\n`;

  // Secciones por carpeta
  for (const dir of sortedDirs) {
    md += `## ${dir}\n\n`;
    for (const a of groups.get(dir)) {
      const fileName = path.basename(a.file);
      md += `### \`${fileName}\`\n\n`;
      md += `${a.summary}\n\n`;

      if (a.isRoute) {
        md += `**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.\n\n`;
      } else if (a.usages.length > 0) {
        md += `**Uso:** referenciado en ${a.usages.length} archivo${a.usages.length > 1 ? "s" : ""}:\n`;
        for (const u of a.usages.slice(0, 6)) {
          md += `  - \`${u.file}\`\n`;
        }
        if (a.usages.length > 6) md += `  - ...y ${a.usages.length - 6} más\n`;
        md += `\n`;
      } else {
        md += `**Uso:** ⚠️ no se encontraron referencias de import en el resto del proyecto (verificar antes de eliminar).\n\n`;
      }
    }
    md += `---\n\n`;
  }

  await fs.writeFile(CONFIG.outFile, md, "utf-8");
  console.log(`\n✅ Documentación guardada en: ${CONFIG.outFile}`);
}

main().catch((err) => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
