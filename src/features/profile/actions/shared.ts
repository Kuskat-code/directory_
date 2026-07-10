import { createClient } from '@/src/lib/supabase/server';
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '../validation';

export type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;
type AcceptedImageMimeType = (typeof ACCEPTED_IMAGE_MIME_TYPES)[number];
export type Relation<T> = T | T[] | null;

export interface BasicUserRelation {
  nombre: string | null;
  correo: string | null;
}

const ACCEPTED_IMAGE_MIME_SET = new Set<string>(ACCEPTED_IMAGE_MIME_TYPES);

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error desconocido';
}

function normalizeImageMimeType(contentType: string): AcceptedImageMimeType | null {
  const normalized = contentType === 'image/jpg' ? 'image/jpeg' : contentType;
  return ACCEPTED_IMAGE_MIME_SET.has(normalized) ? (normalized as AcceptedImageMimeType) : null;
}

function getBase64DecodedSize(base64Data: string): number {
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  return Math.floor((base64Data.length * 3) / 4) - padding;
}

function hasAllowedImageSignature(buffer: Buffer, contentType: AcceptedImageMimeType): boolean {
  switch (contentType) {
    case 'image/jpeg':
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case 'image/webp':
      return buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    case 'image/gif':
      return buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a';
  }
}

export function isPremiumPlan(planType: unknown): boolean {
  return planType === 'premium' || planType === 'enterprise';
}

export function firstRelation<T>(relation: Relation<T> | undefined): T | null {
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation ?? null;
}

function isHttpImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function verifyOwnership(doctorId: string, supabase: ServerSupabaseClient): Promise<string | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== doctorId) {
    return 'Acceso no autorizado: Debes iniciar sesión y ser propietario de este perfil.';
  }
  return null;
}

export async function uploadBase64Image(
  supabase: ServerSupabaseClient,
  base64String: string,
  bucketName: string,
  fileName: string
): Promise<string> {
  const match = base64String.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) {
    if (isHttpImageUrl(base64String)) {
      return base64String;
    }
    throw new Error('Formato de imagen inválido.');
  }

  const contentType = normalizeImageMimeType(match[1]);
  if (!contentType) {
    throw new Error('Tipo de imagen no permitido.');
  }

  const base64Data = match[2];
  if (base64Data.length % 4 !== 0) {
    throw new Error('La imagen base64 está corrupta.');
  }

  const decodedSize = getBase64DecodedSize(base64Data);
  if (decodedSize <= 0 || decodedSize > MAX_IMAGE_BYTES) {
    throw new Error('La imagen excede el tamaño máximo de 5 MB.');
  }

  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.byteLength > MAX_IMAGE_BYTES || !hasAllowedImageSignature(buffer, contentType)) {
    throw new Error('El contenido del archivo no coincide con una imagen permitida.');
  }

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Error al subir a storage: ${error.message}. Asegúrate de que el bucket "${bucketName}" exista en Supabase y tenga las políticas RLS correspondientes activadas.`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrl;
}
