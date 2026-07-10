import { z } from 'zod';

export const FREE_GALLERY_LIMIT = 3;
export const MAX_GALLERY_IMAGES = 12;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_URL_LENGTH = 2048;
export const MAX_IMAGE_DATA_URL_LENGTH =
  'data:image/jpeg;base64,'.length + Math.ceil(MAX_IMAGE_BYTES / 3) * 4;
export const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export function isAcceptedImageMimeType(value: string): value is (typeof ACCEPTED_IMAGE_MIME_TYPES)[number] {
  return (ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}

const httpImageUrlSchema = z
  .string()
  .min(1, 'URL inválida')
  .max(MAX_IMAGE_URL_LENGTH, 'URL demasiado larga')
  .url('URL inválida')
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Solo se permiten URLs http(s)');

const dataUrlImageSchema = z
  .string()
  .min(1, 'Imagen inválida')
  .max(MAX_IMAGE_DATA_URL_LENGTH, 'La imagen excede el tamaño máximo de 5 MB')
  .regex(
    /^data:image\/(?:jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/,
    'Formato de imagen inválido',
  );

export const profileImageInputSchema = z.union([httpImageUrlSchema, dataUrlImageSchema]);

export const profileServiceSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100, 'Máximo 100 caracteres'),
  desc: z.string().min(1, 'La descripción es requerida').max(500, 'Máximo 500 caracteres'),
});

export const profileScheduleItemSchema = z.object({
  days: z.string().min(1, 'Los días son requeridos').max(50),
  hours: z.string().min(1, 'Las horas son requeridas').max(50),
  closed: z.boolean().optional(),
});

export const updateBasicInfoSchema = z.object({
  doctorId: z.string().min(1),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  specialty: z.string().min(1, 'La especialidad es requerida'),
  location: z.string().min(1, 'La ubicación es requerida').max(100),
  experience: z.coerce.number().int().min(0).max(60),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{9,}$/, 'Teléfono inválido'),
  email: z.string().email('Correo inválido'),
});

export const updateSummarySchema = z.object({
  doctorId: z.string().min(1),
  bio: z.string().min(10, 'Mínimo 10 caracteres').max(1000, 'Máximo 1000 caracteres'),
  languages: z.array(z.string().min(1)).min(1, 'Al menos un idioma'),
});

export const updateScheduleSchema = z.object({
  doctorId: z.string().min(1),
  schedule: z
    .array(profileScheduleItemSchema)
    .min(1, 'Al menos un horario')
    .max(10, 'Máximo 10 horarios'),
});

export const updateServicesSchema = z.object({
  doctorId: z.string().min(1),
  services: z
    .array(profileServiceSchema)
    .min(1, 'Al menos un servicio')
    .max(8, 'Máximo 8 servicios'),
});

export const updateGallerySchema = z.object({
  doctorId: z.string().min(1),
  galleryImages: z
    .array(profileImageInputSchema)
    .max(MAX_GALLERY_IMAGES, `Máximo ${MAX_GALLERY_IMAGES} imágenes`),
});

export const updateAvatarSchema = z.object({
  doctorId: z.string().min(1),
  avatar: profileImageInputSchema,
});

export const updateCoverImageSchema = z.object({
  doctorId: z.string().min(1),
  coverImage: profileImageInputSchema,
});

export const updateUserProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  email: z.string().trim().email('Correo inválido').max(254, 'Correo demasiado largo'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128),
  role: z.enum(['paciente', 'doctor']).default('doctor'),
  captchaToken: z.string().min(1).max(4096).optional(),
});

export type UpdateBasicInfoInput = z.infer<typeof updateBasicInfoSchema>;
export type UpdateSummaryInput = z.infer<typeof updateSummarySchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type UpdateServicesInput = z.infer<typeof updateServicesSchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
export type UpdateCoverImageInput = z.infer<typeof updateCoverImageSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
