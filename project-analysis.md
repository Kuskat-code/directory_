# Documentación técnica del proyecto


**Resumen general**

- Carpetas documentadas: **23**
- Archivos documentados: **66**
- Archivos sin referencias de uso detectadas: **3** (ver nota abajo)

> ⚠️ La detección de "uso" es heurística (búsqueda de texto en imports). Puede haber falsos positivos con barrels/index.ts, imports dinámicos (`dynamic()`, `React.lazy`) o alias distintos a `@/`. Las rutas y archivos de convención de Next.js (`page.tsx`, `layout.tsx`, `template.tsx`, `route.ts`, `middleware.ts`, `proxy.ts`, etc.) siempre se marcan como usados porque se activan por convención de nombre/carpeta, no por import.

## Índice

- [src](#src) (1 archivo)
- [src/app](#src-app) (5 archivos)
- [src/app/admin](#src-app-admin) (1 archivo)
- [src/app/configuracion](#src-app-configuracion) (1 archivo)
- [src/app/dashboard/admin](#src-app-dashboard-admin) (1 archivo)
- [src/app/dashboard/doctor](#src-app-dashboard-doctor) (1 archivo)
- [src/app/dashboard/paciente](#src-app-dashboard-paciente) (1 archivo)
- [src/app/directorio](#src-app-directorio) (2 archivos)
- [src/app/perfil](#src-app-perfil) (1 archivo)
- [src/app/precios](#src-app-precios) (1 archivo)
- [src/components](#src-components) (12 archivos)
- [src/components/configuracion](#src-components-configuracion) (1 archivo)
- [src/components/dashboard](#src-components-dashboard) (3 archivos)
- [src/components/landing](#src-components-landing) (3 archivos)
- [src/components/ui](#src-components-ui) (4 archivos)
- [src/features/directory/components](#src-features-directory-components) (2 archivos)
- [src/features/directory/lib](#src-features-directory-lib) (1 archivo)
- [src/features/profile](#src-features-profile) (4 archivos)
- [src/features/profile/components](#src-features-profile-components) (9 archivos)
- [src/features/profile/hooks](#src-features-profile-hooks) (2 archivos)
- [src/features/profile/lib](#src-features-profile-lib) (1 archivo)
- [src/lib](#src-lib) (6 archivos)
- [src/lib/supabase](#src-lib-supabase) (3 archivos)

---

## src

### `proxy.ts`

**Propósito:** Este archivo define un proxy para manejar rutas protegidas en una aplicación Next.js, utilizando Supabase para autenticación y autorización. Redirige las solicitudes a diferentes rutas según el rol del usuario autenticado.

**Props / parámetros:** `request: NextRequest` - La solicitud HTTP entrante.

**Exporta:** `proxy: función` - Una función que maneja la lógica de proxy para rutas protegidas. `config: objeto` - Configuración para el enrutamiento del proxy.

**Dependencias clave:** 
- `@supabase/ssr`: Para interactuar con Supabase.
- `next/server`: Para trabajar con solicitudes y respuestas HTTP en Next.js.

**Estado:** Funcional, pero podría mejorar la legibilidad al reducir la repetición de código en las condiciones de redirección.

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app

### `layout.tsx`

**Propósito:** Define la estructura general de la aplicación, incluyendo el enfoque tipográfico, metadatos y un modal de autenticación.

**Props / parámetros:**
- `children`: Contenido principal de la página.

**Exporta:** Componente `RootLayout`.

**Dependencias clave:** 
- `next/font/google` para el enfoque tipográfico Inter.
- `react` para el componente `Suspense`.
- `@/src/components/AuthModal` para el modal de autenticación.
- `@/src/lib/seo` para obtener metadatos y configuraciones del sitio.

**Estado:** Funcional.

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

### `page.tsx`

**Propósito:** Este archivo es la página principal del sitio web, que incluye el encabezado, pie de página y secciones principales como hero, características, mapa oriente, especialidades, noticias y planes de precios.

**Props / parámetros:** Ninguno

**Exporta:** Componente `Home`

**Dependencias clave:** 
- `Header`, `Footer`, `HeroSection`, `FeaturesSection`, `OrienteMapSection`, `SpecialtiesSection`, `NewsCarousel`, `PricingSection` (componentes propios)

**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

### `robots.ts`

**Propósito:** Genera el archivo `robots.txt` para controlar cómo los motores de búsqueda indexan el sitio web.
**Props / parámetros:** Ninguno
**Exporta:** Función que devuelve un objeto con las reglas y la URL del sitemap.
**Dependencias clave:** `MetadataRoute`, `getSiteUrl`
**Estado:** Completo

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

### `sitemap.ts`

**Propósito:** Genera un sitemap para el sitio web, incluyendo rutas estáticas y dinámicas basadas en especialidades médicas.

**Props / parámetros:** Ninguno

**Exporta:** Función `sitemap` que devuelve un objeto de tipo `MetadataRoute.Sitemap`

**Dependencias clave:** 
- `MetadataRoute` desde `next`
- `MEDICAL_SPECIALTIES` desde `@/src/lib/constants`
- `getSiteUrl` desde `@/src/lib/seo`

**Estado:** Completo

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

### `template.tsx`

**Propósito:** Componente que anima la entrada y salida de sus hijos con una transición suave.

**Props / parámetros:** 
- `children`: Contenido que será animado.

**Exporta:** 
- Componente `Template`.

**Dependencias clave:** 
- `framer-motion` para las animaciones.

**Estado:** 
- Funcional.

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/admin

### `page.tsx`

**Propósito:** Redirige al usuario a la página del panel de administrador.
**Props / parámetros:** Ninguno
**Exporta:** Componente `AdminPage`
**Dependencias clave:** `next/navigation` (para el redirección)
**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/configuracion

### `page.tsx`

**Propósito:** Este archivo define la página de configuración para los usuarios con roles de "doctor" o "admin". Muestra el encabezado, contenido específico de la configuración y el pie de página.

**Props / parámetros:** Ninguno

**Exporta:** Componente `ConfiguracionPage`

**Dependencias clave:** 
- `requireRole` desde `@/src/lib/auth`
- `Header`, `Footer`, `ConfiguracionContent` desde `@/src/components`

**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/dashboard/admin

### `page.tsx`

**Propósito:** Este archivo define la página principal del panel de administrador, que solo puede acceder los usuarios con el rol "admin". Incluye un encabezado, contenido principal y un pie de página.

**Props / parámetros:** Ninguno

**Exporta:** Componente `AdminDashboardPage`

**Dependencias clave:**
- `@/src/lib/auth`: Para verificar si el usuario tiene el rol correcto.
- `@/src/components/Header`: Componente para el encabezado de la página.
- `@/src/components/Footer`: Componente para el pie de página de la página.
- `@/src/components/dashboard/AdminDashboard`: Componente que contiene el contenido principal del panel de administrador.

**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/dashboard/doctor

### `page.tsx`

**Propósito:** Este archivo define la página principal del panel de control para doctores, que incluye un encabezado, el contenido específico del panel de control y un pie de página.

**Props / parámetros:** Ninguno

**Exporta:** Componente `DoctorDashboardPage`

**Dependencias clave:**
- `requireRole` desde `@/src/lib/auth`
- `Header`, `Footer` y `DoctorDashboard` desde `@/src/components`

**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/dashboard/paciente

### `page.tsx`

**Propósito:** Este archivo define la página principal del panel de control para pacientes en el proyecto. Renderiza un encabezado, el contenido específico del panel de control para pacientes y un pie de página.

**Props / parámetros:** Ninguno

**Exporta:** Componente `PacienteDashboardPage`

**Dependencias clave:**
- `@/src/lib/auth`: Para la autenticación y verificación de roles.
- `@/src/components/Header`: Componente para el encabezado de la página.
- `@/src/components/Footer`: Componente para el pie de página de la página.
- `@/src/components/dashboard/PacienteDashboard`: Componente que contiene el contenido específico del panel de control para pacientes.

**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/directorio

### `DirectorioContent.tsx`

**Propósito:** Este componente muestra el contenido del directorio médico, incluyendo filtros por especialidad y ubicación, y una lista de doctores filtrados.

**Props / parámetros:**
- `initialDoctors`: Array de doctores iniciales.
- `initialSpecialty`: Especialidad inicial seleccionada.
- `initialLocation`: Ubicación inicial seleccionada.
- `loadError`: Mensaje de error si la carga del directorio falla.

**Exporta:** Componente React (`DirectorioContent`).

**Dependencias clave:**
- `react`
- `next/navigation`
- `lucide-react` (Iconos)
- `@/src/lib/constants` (Tipo `Doctor`)
- `@/src/components/Header`, `@/src/components/Footer`
- `@/src/features/directory/components/DoctorCard`
- `@/src/components/ui/SectionContainer`, `@/src/components/ui/Button`
- `@/src/features/directory/lib/directory-filters` (Funciones de filtrado)

**Estado:** Funcional, con estados para la especialidad y ubicación seleccionadas.

**Uso:** referenciado en 1 archivo:
  - `src/app/directorio/page.tsx`

### `page.tsx`

**Propósito:** Este archivo define la página del directorio médico, que muestra una lista de médicos y especialistas verificados en El Salvador. Permite filtrar por especialidad y ubicación.

**Props / parámetros:**
- `searchParams`: Un objeto con los parámetros de búsqueda como especialidad y ubicación.

**Exporta:** 
- `DirectorioPage`: Componente React que renderiza la página del directorio.
- `generateMetadata`: Función para generar metadatos SEO dinámicos basados en los parámetros de búsqueda.

**Dependencias clave:**
- `next/cache`: Para crear una versión cachada de la carga de médicos.
- `@/src/features/profile/profile.actions`: Para obtener la lista de médicos.
- `@/src/features/directory/lib/directory-filters`: Para filtrar los médicos según los parámetros de búsqueda.
- `@/src/lib/seo`: Para generar metadatos SEO y URLs.

**Estado:** Funcional.

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/perfil

### `page.tsx`

**Propósito:** Renderiza la página de perfil, incluyendo encabezado, contenido del perfil y pie de página. Utiliza un componente `Suspense` para manejar el estado de carga del contenido del perfil.

**Props / parámetros:** Ninguno

**Exporta:** Componente `ProfilePage`

**Dependencias clave:** 
- `Header`: Componente de encabezado
- `Footer`: Componente de pie de página
- `ProfileContent`: Componente que contiene el contenido del perfil

**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/app/precios

### `page.tsx`

**Propósito:** Renderiza la página de precios con un encabezado, una sección de planes y precios, y un pie de página.

**Props / parámetros:** Ninguno

**Exporta:** Componente `PreciosPage`

**Dependencias clave:** 
- `Header` (componente personalizado)
- `Footer` (componente personalizado)
- `PricingSection` (componente personalizado)

**Estado:** Funcional

**Uso:** ruta o archivo de convención de Next.js — se activa por nombre/ubicación de carpeta, no por import directo.

---

## src/components

### `AppointmentModal.tsx`

**Propósito:** Componente que muestra un modal para agendar citas médicas, permitiendo seleccionar la fecha y hora, indicar si es una emergencia y proporcionar el motivo de la cita.

**Props / parámetros:**
- `isOpen`: Booleano que indica si el modal está abierto.
- `doctorName`: Nombre del médico al que se agendará la cita.
- `specialty`: Especialidad del médico.
- `onClose`: Función a ejecutar cuando se cierre el modal.
- `onConfirm`: Función a ejecutar cuando se confirme la cita, recibe los datos de la cita.

**Exporta:** Componente `AppointmentModal`.

**Dependencias clave:**
- React
- framer-motion
- lucide-react (para iconos)

**Estado:** Completo

**Uso:** referenciado en 4 archivos:
  - `src/components/ProfileSidebar.tsx`
  - `src/components/ProfileSidebar.tsx`
  - `src/features/directory/components/DoctorCard.tsx`
  - `src/features/directory/components/DoctorCard.tsx`

### `AuthModal.tsx`

**Propósito:** Componente de modal para autenticación, que permite al usuario registrarse como paciente o médico y luego iniciar sesión.

**Props / parámetros:** Ninguno

**Exporta:** Componente `AuthModal`

**Dependencias clave:** 
- `react`, `next/navigation`, `framer-motion`, `lucide-react`, `react-turnstile`
- Acciones de autenticación (`signUpAction`, `signInAction`, `getCurrentUserSession`)

**Estado:** Funcional, contiene varios estados para el manejo del formulario y la lógica de autenticación.

**Uso:** referenciado en 1 archivo:
  - `src/app/layout.tsx`

### `FeaturesSection.tsx`

**Propósito:** Este componente presenta una sección de características clave para la plataforma médica, utilizando animaciones y tarjetas interactivas.

**Props / parámetros:** Ninguno

**Exporta:** Componente `FeaturesSection`

**Dependencias clave:** `framer-motion`, `@/src/components/ui/SectionContainer`, `@/src/components/ui/Card`

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/page.tsx`

### `Footer.tsx`

**Propósito:** El componente `Footer` es el pie de página del sitio web, que incluye enlaces a las principales secciones del directorio médico, así como información legal y de soporte.

**Props / parámetros:** Ninguno

**Exporta:** Componente React (`Footer`)

**Dependencias clave:** 
- `Link` de Next.js para crear enlaces internos
- `MEDICAL_SPECIALTIES` desde `@/src/lib/constants`

**Estado:** Funcional

**Uso:** referenciado en 8 archivos:
  - `src/app/configuracion/page.tsx`
  - `src/app/dashboard/admin/page.tsx`
  - `src/app/dashboard/doctor/page.tsx`
  - `src/app/dashboard/paciente/page.tsx`
  - `src/app/directorio/DirectorioContent.tsx`
  - `src/app/page.tsx`
  - ...y 2 más

### `Header.tsx`

**Propósito:** El componente `Header` es la barra de navegación principal del sitio web. Muestra enlaces de navegación, opciones de usuario y un menú desplegable para dispositivos móviles.

**Props / parámetros:** Ninguno

**Exporta:** Componente React `Header`

**Dependencias clave:** 
- `next/image`: Para cargar imágenes.
- `next/link`: Para enlaces internos.
- `next/navigation`: Para manejar la navegación y el estado de la ruta.
- `framer-motion`: Para animaciones.
- `@/src/components/ui/Button`: Componente personalizado de botón.
- `@/src/features/profile/profile.actions`: Funciones para gestionar sesiones de usuario.

**Estado:** Completo

**Uso:** referenciado en 8 archivos:
  - `src/app/configuracion/page.tsx`
  - `src/app/dashboard/admin/page.tsx`
  - `src/app/dashboard/doctor/page.tsx`
  - `src/app/dashboard/paciente/page.tsx`
  - `src/app/directorio/DirectorioContent.tsx`
  - `src/app/page.tsx`
  - ...y 2 más

### `HeroSection.tsx`

**Propósito:** Este componente `HeroSection` es la sección de encabezado principal del sitio, que incluye un título animado, enlaces para explorar el directorio y registrarse como médico, y un video que cambia automáticamente.

**Props / parámetros:** Ninguno

**Exporta:** Componente React funcional `HeroSection`

**Dependencias clave:** 
- `next/link`: Para crear enlaces
- `react`: Para usar el hook `useState`
- `framer-motion`: Para animaciones
- `@/src/components/ui/animated-word`: Para la palabra animada

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/page.tsx`

### `NewsCarousel.tsx`

**Propósito:** Componente que muestra un carrusel de noticias con animaciones y navegación. Permite al usuario navegar entre páginas de noticias, ver detalles de cada noticia y cambiar la página automáticamente.

**Props / parámetros:** Ninguno

**Exporta:** Componente `NewsCarousel`

**Dependencias clave:** 
- `framer-motion` para las animaciones
- `lucide-react` para los íconos de navegación

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/page.tsx`

### `PricingSection.tsx`

**Propósito:** Este componente muestra una sección de planes de precios para diferentes opciones, con tarifas mensuales y anuales, características destacadas y un botón CTA.

**Props / parámetros:** Ninguno

**Exporta:** `PricingSection` (componente React)

**Dependencias clave:** 
- `framer-motion`: Para animaciones.
- `lucide-react`: Para íconos.

**Estado:** Funcional

**Uso:** referenciado en 3 archivos:
  - `src/app/page.tsx`
  - `src/app/precios/page.tsx`
  - `src/components/dashboard/DoctorDashboard.tsx`

### `ProfileContent.tsx`

**Propósito:** Componente que muestra el contenido del perfil de un médico, incluyendo detalles, habilidades y opciones para editar el perfil si es el dueño.

**Props / parámetros:** Ninguno

**Exporta:** `ProfileContent` (componente React)

**Dependencias clave:** 
- `framer-motion`: Para animaciones.
- `lucide-react`: Para iconos.
- `next/navigation`: Para manejar los parámetros de búsqueda.
- `@/src/lib/constants`: Contiene constantes como `EXAMPLE_DOCTORS` y tipos `Doctor`, `DoctorAvailability`.
- Componentes internos: `ProfileHero`, `ProfileDetails`, `ProfileSidebar`, `ProfileEditorModal`.
- Hooks personalizados: `useProfileEditor`.
- Funciones auxiliares: `getCurrentUserSession`.

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/app/perfil/page.tsx`

### `ProfileDetails.tsx`

**Propósito:** Componente que muestra y permite editar los detalles del perfil de un profesional, incluyendo su resumen profesional, áreas de práctica especializada y galería de imágenes.

**Props / parámetros:**
- `profile`: Objeto con la información del perfil a mostrar o editar.
- `tags`: Array de etiquetas asociadas al perfil.
- `doctor`: Objeto con información sobre el médico.
- `isEditing` (opcional): Indica si el componente debe estar en modo edición.
- `onChange` (opcional): Función para manejar los cambios en el perfil.

**Exporta:** Componente `ProfileDetails`.

**Dependencias clave:**
- React, Next.js, Framer Motion, Lucide Icons, y componentes internos como `ImageUploader`.

**Estado:** Completo.

**Uso:** referenciado en 1 archivo:
  - `src/components/ProfileContent.tsx`

### `ProfileHero.tsx`

**Propósito:** Componente que muestra y edita el perfil de un médico, incluyendo información como nombre, especialidad, ubicación, años de experiencia, teléfono y correo electrónico.

**Props / parámetros:**
- `profile`: Objeto con la información del perfil del médico.
- `doctor`: Objeto con la información del médico.
- `isEditing` (opcional): Indica si el componente está en modo edición. Valor por defecto es `false`.
- `onChange` (opcional): Función que se llama cuando ocurre un cambio en los datos del perfil.

**Exporta:** Componente `ProfileHero`.

**Dependencias clave:**
- `next/image`: Para cargar imágenes.
- `framer-motion`: Para animaciones.
- `lucide-react`: Para iconos.
- `@/src/lib/constants`: Constantes de especialidades médicas y colores de etiquetas.
- `@/src/features/profile/types`: Tipos para el perfil editable.
- `@/src/features/profile/components/ImageUploader`: Componente para cargar imágenes.

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/components/ProfileContent.tsx`

### `ProfileSidebar.tsx`

**Propósito:** Este componente muestra una barra lateral de perfil con opciones para agendar citas, ver horarios de atención y mostrar información de ubicación. Permite la edición de estos datos si el usuario está en modo de edición.

**Props / parámetros:**
- `profile`: Objeto que contiene los detalles del perfil.
- `isEditing` (opcional): Indica si el componente debe estar en modo de edición.
- `onChange` (opcional): Función para actualizar los cambios en el perfil.

**Exporta:** Componente `ProfileSidebar`

**Dependencias clave:**
- `useState`: Para manejar el estado interno del componente.
- `motion`: Desde `framer-motion`, para animaciones suaves.
- Íconos de `lucide-react` (Calendar, Clock, MapPin, Plus, Trash2).
- Componente `AppointmentModal`.
- Función `getSpecialtyBadgeColors` desde `@/src/lib/specialty-badge-colors`.
- Tipos `EditableProfile`, `ProfileScheduleItem` y `AppointmentData` desde `@/src/features/profile/types`.

**Estado:** Completo

**Uso:** referenciado en 1 archivo:
  - `src/components/ProfileContent.tsx`

---

## src/components/configuracion

### `ConfiguracionContent.tsx`

**Propósito:** Componente que muestra y permite la configuración del perfil, cambio de contraseña, correo electrónico y eliminación de cuenta.
**Props / parámetros:** Ninguno
**Exporta:** Componente `ConfiguracionContent`
**Dependencias clave:** `react`, `next/navigation`, `framer-motion`, `lucide-react`, `next/link`, `@/src/lib/supabase/client`, `@/src/features/profile/profile.actions`, `@/src/features/profile/components/ImageUploader`
**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/configuracion/page.tsx`

---

## src/components/dashboard

### `AdminDashboard.tsx`

**Propósito:** Componente que muestra el panel de control administrativo para un sistema, incluyendo estadísticas, navegación por pestañas y una lista filtrable de usuarios.

**Props / parámetros:** Ninguno

**Exporta:** Componente `AdminDashboard`

**Dependencias clave:** 
- `lucide-react` (para íconos)
- `@/src/features/profile/profile.actions` (para obtener la sesión del usuario)

**Estado:** Funcional, con estados para el usuario activo, pestaña activa y término de búsqueda.

**Uso:** referenciado en 1 archivo:
  - `src/app/dashboard/admin/page.tsx`

### `DoctorDashboard.tsx`

**Propósito:** Este componente muestra el panel de control para los profesionales médicos, incluyendo información del usuario, opciones rápidas, estadísticas (placeholder), enlace al directorio médico y una sección de planes y precios.

**Props / parámetros:** Ninguno

**Exporta:** Componente `DoctorDashboard`

**Dependencias clave:** 
- `getCurrentUserSession` y `type UserSessionData` desde `@/src/features/profile/profile.actions`
- `Link` desde `next/link`
- Íconos de Lucide (`Settings`, `Eye`, `Edit3`, `TrendingUp`, `DollarSign`, `Calendar`)
- Componente `PricingSection`

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/dashboard/doctor/page.tsx`

### `PacienteDashboard.tsx`

**Propósito:** Este componente muestra el panel de inicio para pacientes, incluyendo una bienvenida, un buscador rápido, opciones de especialidades y enlaces rápidos al directorio médico.

**Props / parámetros:** Ninguno

**Exporta:** Componente `PacienteDashboard`

**Dependencias clave:** 
- `getCurrentUserSession` desde `@/src/features/profile/profile.actions`
- `Link` desde `next/link`
- Íconos de Lucide (`Search`, `User`, `MapPin`, `ArrowRight`)

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/dashboard/paciente/page.tsx`

---

## src/components/landing

### `oriente-map-paths.ts`

**Propósito:** Define las rutas y títulos de los departamentos del oriente en el mapa SVG.

**Props / parámetros:** Ninguno

**Exporta:** `ORIENTE_MAP_PATHS` (tipo `Record<OrienteDepartmentId, { d: string; title: string }>`)

**Dependencias clave:** `OrienteDepartmentId` (tipo definido en `@/src/lib/oriente-departments`)

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/components/landing/OrienteMapSection.tsx`

### `OrienteMapSection.tsx`

**Propósito:** Este componente muestra un mapa interactivo de la región Oriente de El Salvador, permitiendo a los usuarios seleccionar departamentos para ver información detallada sobre médicos y especialistas disponibles.

**Props / parámetros:** Ninguno

**Exporta:** `OrienteMapSection` (componente React)

**Dependencias clave:** 
- `next/link`: Para enlaces internos
- `next/navigation`: Para manejo de navegación
- `react`: Hooks como `useCallback`, `useLayoutEffect`, `useRef`, y `useState`
- `framer-motion`: Para animaciones
- `lucide-react`: Iconos
- Componentes y funciones desde `@/src/components/landing/oriente-map-paths` y `@/src/lib/oriente-departments`

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/page.tsx`

### `SpecialtiesSection.tsx`

**Propósito:** Este componente muestra una sección de especialidades médicas con un carrusel que despliega las opciones disponibles. Incluye enlaces a los directores de especialidades.

**Props / parámetros:** Ninguno

**Exporta:** Componente `SpecialtiesSection`

**Dependencias clave:** 
- `useState` de React
- `Link` de Next.js
- `motion` de Framer Motion
- Íconos de Lucide (Stethoscope, Heart, Baby, Brain, Activity, Droplets, Sparkles, HeartHandshake)
- Constante `LANDING_SPECIALTIES` desde `@/src/lib/constants`

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/app/page.tsx`

---

## src/components/ui

### `animated-word.tsx`

**Propósito:** Componente que anima la transición entre palabras, mostrando una palabra a la vez y luego cambiándola después de un cierto intervalo.

**Props / parámetros:**
- `words`: Array de strings con las palabras a mostrar.
- `duration`: Duración total de la transición en milisegundos (opcional, por defecto 1800 ms).
- `className`: Clase CSS adicional para estilizar el componente.

**Exporta:** Componente `AnimatedWord`.

**Dependencias clave:** React (`useEffect`, `useState`).

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/components/HeroSection.tsx`

### `Button.tsx`

**Propósito:** Componente de botón con varias variantes y tamaños, que puede mostrar un estado de carga.

**Props / parámetros:**
- `variant?: ButtonVariant` - Variante del botón (primary, secondary, outline, ghost, accent).
- `size?: ButtonSize` - Tamaño del botón (sm, md, lg).
- `isLoading?: boolean` - Estado de carga del botón.

**Exporta:** Componente `Button`.

**Dependencias clave:** `react`, `ButtonHTMLAttributes`.

**Estado:** Funcional.

**Uso:** referenciado en 4 archivos:
  - `src/app/directorio/DirectorioContent.tsx`
  - `src/components/Header.tsx`
  - `src/components/ProfileDetails.tsx`
  - `src/features/profile/components/ProfileEditToolbar.tsx`

### `Card.tsx`

**Propósito:** Componente de tarjeta reutilizable con opciones para elevación, hover y diferentes niveles de padding.
**Props / parámetros:**
- `elevated`: Booleano que determina si la tarjeta tiene una sombra mayor (true) o menor (false).
- `hoverable`: Booleano que determina si la tarjeta cambia su apariencia al pasar el mouse sobre ella.
- `padding`: String que define el nivel de padding interno: 'none', 'sm', 'md' o 'lg'.
**Exporta:** Componente `Card`.
**Dependencias clave:** React.
**Estado:** Funcional.

**Uso:** referenciado en 3 archivos:
  - `src/app/directorio/DirectorioContent.tsx`
  - `src/components/FeaturesSection.tsx`
  - `src/features/directory/components/DoctorCard.tsx`

### `SectionContainer.tsx`

**Propósito:** Este componente `SectionContainer` es un contenedor de sección que permite definir el tamaño y el espaciado de manera flexible. Se puede usar como `<section>`, `<div>` o `<article>` según la necesidad.

**Props / parámetros:**
- `as`: Define el tipo de elemento HTML (`section`, `div` o `article`). Por defecto es `section`.
- `children`: Contenido del contenedor.
- `size`: Define el tamaño del contenedor. Puede ser `narrow`, `default` o `wide`. Por defecto es `default`.
- `spacing`: Define el espaciado interno del contenedor. Puede ser `sm`, `md` o `lg`. Por defecto es `md`.

**Exporta:** `SectionContainer`

**Dependencias clave:** `HTMLAttributes<HTMLElement>`, `ReactNode`

**Estado:** Funcional

**Uso:** referenciado en 3 archivos:
  - `src/app/directorio/DirectorioContent.tsx`
  - `src/components/FeaturesSection.tsx`
  - `src/components/landing/OrienteMapSection.tsx`

---

## src/features/directory/components

### `DoctorCard.tsx`

**Propósito:** Componente que muestra la tarjeta de un médico, incluyendo su imagen, nombre, especialidad, disponibilidad y opciones para agendar una cita o ver el perfil.

**Props / parámetros:**
- `doctor`: Objeto del tipo `Doctor` que contiene información sobre el médico.
- `index?`: Índice opcional utilizado para controlar la animación de entrada.

**Exporta:** Componente `DoctorCard`.

**Dependencias clave:** 
- `useState` de React
- `Link`, `Image` y `motion` de Next.js
- `Calendar`, `Crown`, `MapPin` y `Stethoscope` de Lucide React
- `Card` y `AppointmentModal` componentes propios

**Estado:** Funcional, sin TODOs o problemas evidentes.

**Uso:** referenciado en 1 archivo:
  - `src/app/directorio/DirectorioContent.tsx`

### `HeroSearch.tsx`

**Propósito:** Este componente renderiza un formulario de búsqueda para la página de directorio.
**Props / parámetros:** Ninguno
**Exporta:** Componente `HeroSearch`
**Dependencias clave:** `react`, `next/image`, `@mui/material` (TextField, Button)
**Estado:** Funcional

**Uso:** ⚠️ no se encontraron referencias de import en el resto del proyecto (verificar antes de eliminar).

---

## src/features/directory/lib

### `directory-filters.ts`

**Propósito:** Este archivo contiene funciones para procesar y filtrar listas de médicos, incluyendo la obtención de especialidades y ubicaciones únicas, así como el filtrado basado en estas características.

**Props / parámetros:**
- `values`: Un array de strings que necesita ser único, ordenado y sin valores falsos.
- `doctors`: Un array de objetos `Doctor` para obtener las especialidades y ubicaciones únicas.
- `filters`: Un objeto con propiedades `specialty` y `location` para filtrar los médicos.

**Exporta:** 
- `uniqueSorted`: Una función que devuelve un array de strings únicos, ordenados y sin valores falsos.
- `getDirectorySpecialties`: Una función que devuelve las especialidades únicas disponibles en la lista de médicos.
- `getDirectoryLocations`: Una función que devuelve las ubicaciones únicas disponibles en la lista de médicos.
- `filterDoctors`: Una función que filtra una lista de médicos según las especialidades y ubicaciones proporcionadas.

**Dependencias clave:** 
- `EL_SALVADOR_DEPARTMENTS_ORIENTE` y `MEDICAL_SPECIALTIES` desde `@/src/lib/constants`.
- El tipo `Doctor`.

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/app/directorio/page.tsx`

---

## src/features/profile

### `profile.actions.ts`

**Propósito:** Este archivo contiene funciones para actualizar diferentes partes del perfil de un médico en la base de datos utilizando Supabase.

**Props / parámetros:** `input` (unknown): Los datos a actualizar, validados según el esquema correspondiente.

**Exporta:** Funciones para actualizar información básica, resumen, cronograma, servicios y galería del perfil del médico.

**Dependencias clave:** `@/src/lib/supabase/server`, `@/src/lib/supabase/public`, `@/src/lib/constants`, `./types`, `./validation`.

**Estado:** Funcional

**Uso:** referenciado en 6 archivos:
  - `src/app/directorio/page.tsx`
  - `src/components/AuthModal.tsx`
  - `src/components/configuracion/ConfiguracionContent.tsx`
  - `src/components/dashboard/AdminDashboard.tsx`
  - `src/components/dashboard/DoctorDashboard.tsx`
  - `src/components/dashboard/PacienteDashboard.tsx`

### `specialty-colors.ts`

**Propósito:** Define los colores específicos para diferentes especialidades médicas y proporciona una función para obtener estos colores según la especialidad.

**Props / parámetros:** 
- `specialty`: La especialidad médica para la cual se requieren los colores.

**Exporta:** 
- `SPECIALTY_COLORS`: Un objeto que mapea las especialidades médicas a sus respectivos esquemas de color.
- `getSpecialtyColors`: Una función que devuelve el esquema de color correspondiente a una especialidad dada.

**Dependencias clave:** 
- No importa dependencias externas.

**Estado:** Funcional

**Uso:** referenciado en 3 archivos:
  - `src/features/profile/components/ProfileEditorModal.tsx`
  - `src/features/profile/components/profile-editor.tsx`
  - `src/features/profile/hooks/use-specialty-colors.ts`

### `types.ts`

**Propósito:** Define interfaces y tipos para el manejo de datos del perfil de usuario, incluyendo servicios, horarios, información editable y respuestas de acción.
**Props / parámetros:** Ninguno
**Exporta:** Interfaces `ProfileService`, `ProfileScheduleItem`, `EditableProfile`, tipo `ActionResponse` y `MedicalSpecialty`.
**Dependencias clave:** Ninguna
**Estado:** Completo

**Uso:** referenciado en 13 archivos:
  - `src/components/ProfileDetails.tsx`
  - `src/components/ProfileHero.tsx`
  - `src/components/ProfileSidebar.tsx`
  - `src/features/profile/components/ProfileEditorModal.tsx`
  - `src/features/profile/components/basic-info-section.tsx`
  - `src/features/profile/components/gallery-section.tsx`
  - ...y 7 más

### `validation.ts`

**Propósito:** Este archivo contiene esquemas de validación utilizando Zod para validar diferentes tipos de datos relacionados con perfiles de usuarios y registros de nuevos usuarios en un sistema.

**Props / parámetros:** Ninguno

**Exporta:** Esquemas de validación (zod) y tipos inferidos a partir de estos esquemas.

**Dependencias clave:** zod

**Estado:** Completo

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/components/gallery-section.tsx`

---

## src/features/profile/components

### `basic-info-section.tsx`

**Propósito:** Componente que muestra y permite editar la información básica de un perfil, como nombre, experiencia, especialidad, ubicación, teléfono y correo electrónico.

**Props / parámetros:**
- `profile`: Objeto con los datos del perfil a mostrar y editar.
- `isEditing`: Booleano que indica si el componente debe estar en modo edición.
- `colors`: Esquema de colores para aplicar estilos según la especialidad.
- `onChange`: Función que se llama cuando ocurre algún cambio en los campos del formulario.

**Exporta:** Componente `BasicInfoSection`.

**Dependencias clave:** 
- `lucide-react` (para íconos).
- `../types` (tipos `EditableProfile` y `SpecialtyColorScheme`).
- '@/src/lib/constants` (constante `MEDICAL_SPECIALTIES`).

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/components/profile-editor.tsx`

### `gallery-section.tsx`

**Propósito:** Componente que muestra y permite editar una galería de imágenes para un perfil profesional. Permite agregar, eliminar y cambiar las imágenes.

**Props / parámetros:**
- `galleryImages`: Array de URLs de las imágenes en la galería.
- `isEditing`: Booleano que indica si el componente está en modo edición.
- `colors`: Objeto con los colores específicos para el modo edición.
- `onChange`: Función que se llama cuando hay cambios en la galería.

**Exporta:** Componente `GallerySection`.

**Dependencias clave:** 
- `next/image`: Para cargar imágenes de manera eficiente.
- `framer-motion`: Para animaciones.
- `lucide-react`: Iconos SVG.
- `../types`: Tipos personalizados como `EditableProfile` y `SpecialtyColorScheme`.
- `./ImageUploader`: Componente para subir nuevas imágenes.

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/components/profile-editor.tsx`

### `hours-section.tsx`

**Propósito:** Este componente muestra y permite editar el horario de atención de un perfil. Permite agregar, eliminar y modificar los días y horas de atención.

**Props / parámetros:**
- `schedule`: Array de objetos que representan los horarios de atención.
- `isEditing`: Booleano que indica si el componente está en modo edición.
- `colors`: Objeto con esquemas de colores para personalizar la apariencia del componente.
- `onChange`: Función que se llama cuando ocurre un cambio en el horario.

**Exporta:** Componente `HoursSection`.

**Dependencias clave:** `framer-motion`, `lucide-react` (Clock, Plus, Trash2).

**Estado:** Completo.

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/components/ProfileEditorModal.tsx`

### `ImageUploader.tsx`

**Propósito:** Componente para subir y cambiar imágenes, con opciones para usar una superposición (overlay) y mostrar un campo de entrada de URL.

**Props / parámetros:**
- `value`: URL actual de la imagen.
- `onChange`: Función que se ejecuta cuando cambia la imagen.
- `label` (opcional): Texto del botón. Por defecto, "Cambiar imagen".
- `className` (opcional): Clases adicionales para el contenedor principal.
- `overlay` (opcional): Si es `true`, muestra una superposición en lugar de un botón regular.
- `showUrlInput` (opcional): Si es `true`, muestra un campo de entrada de URL.

**Exporta:** Componente `ImageUploader`.

**Dependencias clave:** 
- `lucide-react`: Para los iconos `Camera` y `Link2`.
- `../validation`: Para las validaciones de MIME type y tamaño de imagen.

**Estado:** Funcional.

**Uso:** referenciado en 5 archivos:
  - `src/components/ProfileDetails.tsx`
  - `src/components/ProfileHero.tsx`
  - `src/components/configuracion/ConfiguracionContent.tsx`
  - `src/features/profile/components/ProfileEditorModal.tsx`
  - `src/features/profile/components/gallery-section.tsx`

### `practice-areas-section.tsx`

**Propósito:** Este componente muestra y permite editar las áreas de práctica especializada de un perfil. Permite agregar, eliminar y modificar servicios.

**Props / parámetros:**
- `services`: Array de objetos que representan los servicios.
- `isEditing`: Booleano que indica si el componente está en modo edición.
- `colors`: Objeto con colores específicos para la sección.
- `onChange`: Función que se llama cuando ocurre un cambio en los datos.

**Exporta:** Componente `PracticeAreasSection`.

**Dependencias clave:** `framer-motion`, `lucide-react`.

**Estado:** Completo.

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/components/profile-editor.tsx`

### `profile-editor.tsx`

**Propósito:** Componente que permite la edición de un perfil médico, incluyendo secciones para información básica, resumen, áreas de práctica y galería.

**Props / parámetros:**
- `doctor`: Objeto del tipo `Doctor` que contiene los datos del médico.
- `tags`: Array opcional de etiquetas asociadas al perfil.
- `children`: Función opcional que recibe el contexto del editor de perfiles y devuelve JSX.

**Exporta:** Componente `ProfileEditor`.

**Dependencias clave:**
- `lucide-react`: Librería de íconos.
- `@/src/lib/constants`: Constantes del proyecto.
- `../lib/defaults`: Función para construir el perfil por defecto.
- `../hooks/use-profile-editor`: Hook personalizado para gestionar la edición del perfil.
- `../hooks/use-specialty-colors`: Hook personalizado para obtener los colores asociados a la especialidad.
- Componentes internos: `BasicInfoSection`, `SummarySection`, `PracticeAreasSection`, `GallerySection`.

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/components/ProfileContent.tsx`

### `ProfileEditorModal.tsx`

**Propósito:** Componente que muestra un modal para editar el perfil de un usuario, incluyendo opciones como foto de perfil, información personal, especialidad, ubicación y experiencia.

**Props / parámetros:**
- `isOpen`: Indica si el modal está abierto.
- `draft`: Datos del perfil en edición.
- `isSaving`: Indica si se está guardando el perfil.
- `saveStatus`: Estado de la operación de guardar (idle, saving, saved, error).
- `saveError`: Mensaje de error si ocurre un problema al guardar.
- `onSave`: Función para guardar los cambios.
- `onCancel`: Función para cancelar la edición y cerrar el modal.
- `onChange`: Función para actualizar los datos del perfil en edición.

**Exporta:** Componente `ProfileEditorModal`.

**Dependencias clave:** 
- `framer-motion` para animaciones.
- `lucide-react` para iconos.
- `@/src/lib/constants` para constantes de especialidades y departamentos.
- `../types` para tipos de datos.
- `./ImageUploader`, `./hours-section`, etc., para componentes internos.

**Estado:** Funcional.

**Uso:** referenciado en 1 archivo:
  - `src/components/ProfileContent.tsx`

### `ProfileEditToolbar.tsx`

**Propósito:** Componente que muestra una barra de herramientas para editar o iniciar la edición del perfil, dependiendo del estado `isEditing`.

**Props / parámetros:**
- `isEditing`: Indica si el modo de edición está activo.
- `onStart`: Función a ejecutar cuando se inicie la edición.
- `onSave`: Función a ejecutar cuando se guarden los cambios.
- `onCancel`: Función a ejecutar cuando se cancele la edición.

**Exporta:** Componente `ProfileEditToolbar`.

**Dependencias clave:**
- `lucide-react` (Pencil, Save, X)
- `@/src/components/ui/Button`

**Estado:** Completo.

**Uso:** ⚠️ no se encontraron referencias de import en el resto del proyecto (verificar antes de eliminar).

### `summary-section.tsx`

**Propósito:** Este componente muestra un resumen profissional de un perfil, permitiendo la edición o visualización según el estado del usuario. Incluye campos para biografía profesional y idiomas.

**Props / parámetros:**
- `profile`: Objeto con los datos del perfil.
- `tags`: Array de etiquetas asociadas al perfil.
- `isEditing`: Booleano que indica si el componente está en modo edición.
- `colors`: Esquema de colores para estilizar el componente según el tema seleccionado.
- `onChange`: Función para actualizar los datos del perfil.

**Exporta:** Componente `SummarySection`.

**Dependencias clave:** 
- `framer-motion` para animaciones.
- `lucide-react` para iconos.

**Estado:** Completo.

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/components/profile-editor.tsx`

---

## src/features/profile/hooks

### `use-profile-editor.ts`

**Propósito:** Este hook personalizado gestiona la edición de perfiles profesionales, incluyendo la carga, edición y guardado de datos del perfil. Permite mantener un estado de edición separado del estado principal para permitir cambios temporales.

**Props / parámetros:**
- `doctorId`: ID del médico cuyo perfil se está editando.
- `defaults`: Valores por defecto del perfil que se utilizarán si no hay datos disponibles.

**Exporta:** 
- `useProfileEditor`: Un hook personalizado que devuelve un objeto con funciones y estados para gestionar la edición del perfil.

**Dependencias clave:**
- `react`: Para el uso de hooks como `useState`, `useEffect` y `useTransition`.
- `../types`: Tipos utilizados para definir los tipos de datos.
- `../lib/defaults`: Funciones auxiliares para manejar claves de almacenamiento local.
- `../profile.actions`: Funciones que interactúan con la base de datos para actualizar el perfil.

**Estado:** Completo, sin TODOs.

**Uso:** referenciado en 2 archivos:
  - `src/components/ProfileContent.tsx`
  - `src/features/profile/components/profile-editor.tsx`

### `use-specialty-colors.ts`

**Propósito:** Este archivo contiene hooks personalizados para manejar los colores asociados a una especialidad médica. Proporciona funciones para obtener los colores y convertirlos en variables CSS.

**Props / parámetros:** 
- `specialty`: Un objeto de tipo `MedicalSpecialty` que representa la especialidad médica.

**Exporta:** 
- `useSpecialtyColors`: Hook que devuelve un esquema de colores asociado a una especialidad.
- `useSpecialtyCssVars`: Hook que devuelve un objeto con variables CSS para estilizar elementos según los colores de la especialidad.

**Dependencias clave:** 
- `react`
- `../specialty-colors` (función `getSpecialtyColors`)
- `../types` (tipos `MedicalSpecialty` y `SpecialtyColorScheme`)

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/components/profile-editor.tsx`

---

## src/features/profile/lib

### `defaults.ts`

**Propósito:** Este archivo define valores por defecto y una función para construir perfiles de doctores con información predeterminada.

**Props / parámetros:** 
- `doctor`: Un objeto que contiene la información del doctor.
- `isMock` (opcional): Un booleano que indica si se debe usar información predeterminada (por defecto `false`).

**Exporta:** 
- `buildDefaultProfile`: Una función que construye un perfil de doctor con valores por defecto.
- `PROFILE_STORAGE_KEY`: Una función que genera una clave para almacenar perfiles de doctores en el almacenamiento local.

**Dependencias clave:** 
- `Doctor`, `EditableProfile`, `ProfileScheduleItem`, `ProfileService` (tipos definidos en otros archivos).

**Estado:** Funcional

**Uso:** referenciado en 3 archivos:
  - `src/components/ProfileContent.tsx`
  - `src/features/profile/components/profile-editor.tsx`
  - `src/features/profile/hooks/use-profile-editor.ts`

---

## src/lib

### `auth.ts`

**Propósito:** Este archivo contiene funciones para manejar la autenticación y autorización en el proyecto. Proporciona métodos para obtener el rol del usuario actualmente autenticado y requerir que un usuario tenga un rol específico antes de permitir su acceso a ciertas partes del sistema.

**Props / parámetros:**
- `allowedRoles`: Un array de roles permitidos (paciente, doctor, admin).
- `fallback`: Una ruta a la que se redirige el usuario si no cumple con los requisitos de rol. Por defecto, '/'.

**Exporta:** 
- `getAuthenticatedRole`: Función para obtener el usuario y su rol actualmente autenticado.
- `requireRole`: Función para requerir un rol específico antes de permitir el acceso a ciertas partes del sistema.

**Dependencias clave:**
- `@/src/lib/supabase/server`: Cliente Supabase configurado para el servidor.
- `next/navigation`: Para redirecciones en Next.js.

**Estado:** Funcional.

**Uso:** referenciado en 4 archivos:
  - `src/app/configuracion/page.tsx`
  - `src/app/dashboard/admin/page.tsx`
  - `src/app/dashboard/doctor/page.tsx`
  - `src/app/dashboard/paciente/page.tsx`

### `constants.ts`

**Propósito:** Archivo que contiene constantes y funciones útiles para el proyecto, incluyendo listas de profesiones, especialidades médicas, departamentos geográficos, validaciones comunes y funciones para contar médicos por departamento y obtener las principales especialidades.

**Props / parámetros:**
- Ninguno

**Exporta:** 
- Constantes (PROFESSIONS, MEDICAL_SPECIALTIES, EL_SALVADOR_DEPARTMENTS_ORIENTE, VALIDATION, LANDING_SPECIALTIES)
- Funciones (countDoctorsByDepartment, getTopSpecialtiesForDepartment)
- Tipo (DoctorAvailability)
- Interfaz (Doctor)
- Constante (EXAMPLE_DOCTORS)

**Dependencias clave:** 
- Ninguno

**Estado:** Completo

**Uso:** referenciado en 16 archivos:
  - `src/app/directorio/DirectorioContent.tsx`
  - `src/app/directorio/page.tsx`
  - `src/app/sitemap.ts`
  - `src/components/Footer.tsx`
  - `src/components/ProfileContent.tsx`
  - `src/components/ProfileDetails.tsx`
  - ...y 10 más

### `oriente-departments.ts`

**Propósito:** Este archivo define una configuración y funciones para departamentos de oriente en un sistema médico. Proporciona información detallada sobre los departamentos, como su nombre, ubicación y especialidades médicas.

**Props / parámetros:**
- `id`: Identificador único del departamento (OrienteDepartmentId).
- `routeSlug`: Slug utilizado en las rutas para identificar el departamento.
- `department`: Configuración de un departamento (OrienteDepartmentConfig).

**Exporta:** 
- `ORIENTE_DEPARTMENT_MAP`: Un objeto que contiene la configuración de cada departamento.
- `OrienteDepartmentId` y `OrienteDepartmentConfig`: Tipos TypeScript para identificar y representar los departamentos.
- `ORIENTE_DEPARTMENT_IDS`: Una lista de todos los IDs de departamento disponibles.
- `getOrienteDepartment(id: OrienteDepartmentId)`: Función que devuelve la configuración de un departamento dado su ID.
- `getOrienteDepartmentByRouteSlug(routeSlug: string)`: Función que devuelve la configuración de un departamento basada en su slug de ruta.
- `getOrienteDoctorCount(department: OrienteDepartmentConfig)`: Función que devuelve el número de médicos en un departamento, utilizando una función externa para contar los doctores por ubicación.
- `getOrienteSpecialties(department: OrienteDepartmentConfig)`: Función que devuelve las especialidades principales de un departamento, utilizando una función externa para obtener las especialidades más populares.

**Dependencias clave:** 
- `countDoctorsByDepartment` y `getTopSpecial

**Uso:** referenciado en 1 archivo:
  - `src/components/landing/oriente-map-paths.ts`

### `seo.ts`

**Propósito:** Este archivo contiene configuraciones y funciones relacionadas con el SEO del sitio web. Exporta una configuración de sitio, una función para generar URLs completas y una función para convertir datos en formato JSON-LD.

**Props / parámetros:**
- `data` (en la función `jsonLd`): Un objeto o valor que se desea convertir a formato JSON-LD.

**Exporta:** 
- `siteConfig`: Objeto con configuraciones generales del sitio.
- `getSiteUrl`: Función para generar URLs completas basadas en la configuración del sitio.
- `jsonLd`: Función para convertir datos en formato JSON-LD, escapando caracteres `<`.

**Dependencias clave:** 
- No importa dependencias externas.

**Estado:** Completo y funcional.

**Uso:** referenciado en 4 archivos:
  - `src/app/directorio/page.tsx`
  - `src/app/layout.tsx`
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`

### `specialty-badge-colors.ts`

**Propósito:** Define los colores específicos para diferentes especialidades médicas, incluyendo fondo, texto, botones y gradientes. También proporciona una función para obtener los colores de una especialidad dada.

**Props / parámetros:**
- `specialty`: Una cadena que representa la especialidad médica para la cual se requieren los colores.

**Exporta:** 
- `SpecialtyBadgeColors`: Un tipo que define las propiedades de los colores de las etiquetas de especialidades.
- `SPECIALTY_COLORS`: Un objeto que mapea nombres de especialidades a sus respectivos colores.
- `DEFAULT_SPECIALTY_COLOR`: Los colores por defecto si la especialidad no se encuentra en el mapeo.
- `getSpecialtyBadgeColors`: Una función que devuelve los colores de una especialidad dada.

**Dependencias clave:** Ninguno

**Estado:** Completo

**Uso:** referenciado en 2 archivos:
  - `src/components/ProfileHero.tsx`
  - `src/components/ProfileSidebar.tsx`

### `utils.ts`

**Propósito:** Combina varias clases CSS en una sola cadena, eliminando cualquier falsy value (false, null, undefined).

**Props / parámetros:** 
- `classes`: Array de strings, booleanos, nulos o indefinidos.

**Exporta:** 
- Función `cn`.

**Dependencias clave:** 
- Ninguno.

**Estado:** 
- Completo.

**Uso:** ⚠️ no se encontraron referencias de import en el resto del proyecto (verificar antes de eliminar).

---

## src/lib/supabase

### `client.ts`

**Propósito:** Crea un cliente de Supabase para interactuar con la base de datos desde el lado del cliente en una aplicación Next.js.

**Props / parámetros:** Ninguno

**Exporta:** `createClient` (función)

**Dependencias clave:** 
- `@supabase/ssr`

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/components/configuracion/ConfiguracionContent.tsx`

### `public.ts`

**Propósito:** Crea un cliente Supabase público estático que se reutiliza para evitar la latencia de handshakes SSL repetidos y sobrecarga de cookies de Next.js.

**Props / parámetros:** Ninguno

**Exporta:** `publicSupabase` (Cliente Supabase)

**Dependencias clave:** `@supabase/supabase-js`

**Estado:** Funcional

**Uso:** referenciado en 1 archivo:
  - `src/features/profile/profile.actions.ts`

### `server.ts`

**Propósito:** Crea y configura un cliente Supabase para el servidor Next.js, utilizando cookies para autenticación.

**Props / parámetros:** Ninguno

**Exporta:** `createClient` (función)

**Dependencias clave:** 
- `@supabase/ssr`: Librería para crear clientes de Supabase en el lado del servidor.
- `next/headers`: Para acceder a las cookies del cliente.

**Estado:** Funcional

**Uso:** referenciado en 3 archivos:
  - `src/features/profile/profile.actions.ts`
  - `src/lib/auth.ts`
  - `src/proxy.ts`

---

