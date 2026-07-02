'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ImageIcon, Plus, Trash2 } from 'lucide-react';
import type { EditableProfile, SpecialtyColorScheme } from '../types';
import { ImageUploader } from './ImageUploader';
import { FREE_GALLERY_LIMIT } from '../validation';

const EASE = [0.4, 0, 0.2, 1] as const;

const FALLBACK_GALLERY_IMAGE =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400';

interface GallerySectionProps {
  galleryImages: string[];
  isEditing: boolean;
  colors: SpecialtyColorScheme;
  onChange: (updates: Partial<EditableProfile>) => void;
}

export function GallerySection({
  galleryImages,
  isEditing,
  colors,
  onChange,
}: GallerySectionProps) {
  const updateImage = (index: number, url: string) => {
    const updated = galleryImages.map((img, i) => (i === index ? url : img));
    onChange({ galleryImages: updated });
  };

  const addImage = () => {
    if (galleryImages.length >= FREE_GALLERY_LIMIT) return;
    onChange({ galleryImages: [...galleryImages, FALLBACK_GALLERY_IMAGE] });
  };

  const removeImage = (index: number) => {
    onChange({ galleryImages: galleryImages.filter((_, i) => i !== index) });
  };

  const sectionClass = isEditing
    ? 'rounded-[var(--radius-card)] border p-6 shadow-sm md:p-8'
    : 'rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8';

  return (
    <motion.section
      aria-labelledby="gallery-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
      className={sectionClass}
      style={isEditing ? { borderColor: colors.border, backgroundColor: colors.light } : undefined}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="gallery-heading"
          className="flex items-center gap-2 text-base font-bold tracking-tight"
          style={{ color: isEditing ? colors.text : 'var(--color-text)' }}
        >
          {isEditing && <ImageIcon className="h-4 w-4" aria-hidden="true" />}
          Galería Profesional
        </h2>

        {isEditing && galleryImages.length < FREE_GALLERY_LIMIT && (
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-1 rounded-[var(--radius-button)] px-2.5 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ color: colors.primary, backgroundColor: colors.badge }}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Agregar foto
          </button>
        )}
      </div>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Galería de imágenes profesionales"
      >
        {galleryImages.map((imgUrl, i) => (
          <motion.div
            key={i}
            role="listitem"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
            whileHover={isEditing ? undefined : { scale: 1.05 }}
            className="space-y-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border bg-secondary"
              style={{ borderColor: isEditing ? colors.border : 'var(--color-border)' }}
            >
              <Image
                src={imgUrl}
                alt={`Instalación profesional ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                unoptimized
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-text-muted shadow-sm transition-colors hover:text-red-500"
                  aria-label={`Eliminar imagen ${i + 1} de la galería`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {isEditing && (
              <ImageUploader
                value={imgUrl}
                onChange={(url) => updateImage(i, url)}
                label="Cambiar imagen"
                showUrlInput
              />
            )}
          </motion.div>
        ))}
      </div>

      {galleryImages.length === 0 && !isEditing && (
        <p className="py-8 text-center text-sm text-text-muted">
          No hay imágenes en la galería.
        </p>
      )}
    </motion.section>
  );
}
