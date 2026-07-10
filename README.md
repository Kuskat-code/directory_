# SaaS Directory

Directorio medico construido con Next.js, React, TypeScript, Tailwind CSS y Supabase.

## Requisitos

- Node.js compatible con Next.js 15.
- pnpm como gestor de paquetes.
- Variables de entorno en `.env.local` basadas en `.env.example`.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

- `pnpm install`: instala dependencias desde `pnpm-lock.yaml`.
- `pnpm dev`: arranca el servidor local en `http://localhost:3000`.
- `pnpm lint`: ejecuta ESLint.
- `pnpm exec tsc --noEmit`: valida tipos sin generar archivos.
- `pnpm build`: compila la aplicacion para produccion.
- `pnpm start`: sirve la build de produccion.

## Estructura

- `src/app`: rutas App Router, metadata, sitemap y robots.
- `src/components`: componentes compartidos de UI.
- `src/features`: modulos funcionales como directorio y perfil.
- `src/lib`: clientes, constantes y utilidades comunes.
- `public`: assets estaticos.
