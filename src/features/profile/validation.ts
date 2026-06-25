import { z } from 'zod';

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
    .array(z.string().min(1, 'URL inválida'))
    .max(12, 'Máximo 12 imágenes'),
});

export const updateAvatarSchema = z.object({
  doctorId: z.string().min(1),
  avatar: z.string().min(1, 'La imagen es requerida'),
});

export type UpdateBasicInfoInput = z.infer<typeof updateBasicInfoSchema>;
export type UpdateSummaryInput = z.infer<typeof updateSummarySchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type UpdateServicesInput = z.infer<typeof updateServicesSchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
