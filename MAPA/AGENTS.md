<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reglas del Proyecto - Agentes AI (Workspace)

Este archivo contiene las reglas y directrices globales que deben seguir los agentes al interactuar con este proyecto.

## 1. Activación de Skills Especializadas
Los agentes deben activar y aplicar las pautas de las skills del workspace según el contexto de la tarea:
* **Coder**: Se activa automáticamente al escribir, refactorizar o corregir código en lenguajes como Python, Java, C#, C o tecnologías Frontend (HTML, CSS, JS).
* **Cyber**: Se activa al implementar autenticación, roles, sanitización de entradas, encriptación, variables de entorno, o políticas RLS en bases de datos.
* **Databases**: Se activa al interactuar con motores de bases de datos (Postgres, MySQL, MariaDB, SQL Server, MongoDB), modificar esquemas, escribir consultas SQL, crear índices o diseñar migraciones.
* **Searcher**: Se activa al realizar búsquedas complejas con `grep_search` en el codebase, investigar documentación oficial externa o resolver incompatibilidades de versiones de paquetes.

## 2. Paridad e Integridad del Código (Parity Rules)
* **Consistencia entre Lenguajes**: Al agregar una nueva funcionalidad en `Coder/Coder-Back`, asegúrate de que la arquitectura lógica se replique de manera homóloga en todas las carpetas de los lenguajes activos (`Coder-C`, `Coder-C#`, `Coder-Java`, `Coder-python`), adaptándolas a las convenciones de cada ecosistema.
* **Comentarios y Documentación**: Conserva siempre los comentarios y docstrings originales que no tengan relación con el cambio realizado. Comenta en español técnico o en inglés según el estándar de cada archivo.

## 3. Seguridad y Privacidad Primero
* **Cero Credenciales Hardcodeadas**: Está prohibido incluir cualquier tipo de clave, token o contraseña en los archivos de código. Todo debe gestionarse a través de variables de entorno configuradas localmente mediante archivos `.env` (excluidos en `.gitignore`).
* **Sanitización de Datos de Usuario**: Valida y sanitiza todo input procedente del usuario antes de procesarlo en backend o base de datos.
