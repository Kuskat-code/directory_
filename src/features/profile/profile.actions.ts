// Este archivo se mantiene como punto de entrada estable para no romper los imports
// existentes en el resto del proyecto. La implementación real vive en `./actions/`,
// dividida por responsabilidad (sesión, info básica, horarios, servicios, galería, etc.).
export * from './actions';
