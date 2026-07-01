'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';
import type { EditableProfile, ProfileService } from '@/src/features/profile/types';
import { ImageUploader } from '@/src/features/profile/components/ImageUploader';
import { Button } from '@/src/components/ui/Button';

const EASE = [0.4, 0, 0.2, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: EASE },
  }),
};

const serviceContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const serviceItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

interface ProfileDetailsProps {
  profile: EditableProfile;
  tags: string[];
  doctor: Doctor;
  isEditing?: boolean;
  onChange?: (updates: Partial<EditableProfile>) => void;
}

export default function ProfileDetails({
  profile,
  tags,
  doctor,
  isEditing = false,
  onChange,
}: ProfileDetailsProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (!onChange) return;
      onChange({ galleryImages: [...profile.galleryImages, reader.result as string] });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };
  const [languagesText, setLanguagesText] = useState(() => profile.languages.join(', '));

  // Sincronizar idiomas si cambian externamente
  useEffect(() => {
    const parsedCurrent = languagesText
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);
    const hasChanged =
      parsedCurrent.length !== profile.languages.length ||
      parsedCurrent.some((val, idx) => val !== profile.languages[idx]);

    if (hasChanged) {
      setLanguagesText(profile.languages.join(', '));
    }
  }, [profile.languages]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + profile.galleryImages.length) % profile.galleryImages.length,
    );
  }, [profile.galleryImages.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % profile.galleryImages.length,
    );
  }, [profile.galleryImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  const updateService = (index: number, field: keyof ProfileService, value: string) => {
    if (!onChange) return;
    const services = profile.services.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    );
    onChange({ services });
  };

  const addService = () => {
    if (!onChange) return;
    onChange({
      services: [...profile.services, { title: 'Nuevo servicio', desc: 'Descripcion del servicio' }],
    });
  };

  const removeService = (index: number) => {
    if (!onChange) return;
    onChange({ services: profile.services.filter((_, i) => i !== index) });
  };

  const updateGalleryImage = (index: number, url: string) => {
    if (!onChange) return;
    const galleryImages = profile.galleryImages.map((img, i) => (i === index ? url : img));
    onChange({ galleryImages });
  };

  const removeGalleryImage = (index: number) => {
    if (!onChange) return;
    onChange({ galleryImages: profile.galleryImages.filter((_, i) => i !== index) });
  };

  const sectionClass = (editing: boolean) =>
    `rounded-[var(--radius-card)] border bg-surface p-6 shadow-sm md:p-8 ${
      editing ? 'border-primary/40 ring-2 ring-primary/10' : 'border-border'
    }`;

  return (
    <div className="space-y-6">
      <motion.section
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={sectionVariants}
        className={sectionClass(isEditing)}
      >
        <h2 className="mb-3 text-base font-bold text-text tracking-tight">Resumen Profesional</h2>
        {isEditing && onChange ? (
          <div className="space-y-3">
            <textarea
              value={profile.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
              className="profile-input profile-textarea"
              placeholder="Describe tu experiencia y enfoque profesional"
            />
            <div>
              <label className="mb-1 block text-xs font-semibold text-text-muted">
                Idiomas (separados por coma)
              </label>
              <input
                type="text"
                value={languagesText}
                onChange={(e) => {
                  const val = e.target.value;
                  setLanguagesText(val);
                  onChange({
                    languages: val
                      .split(',')
                      .map((l) => l.trim())
                      .filter(Boolean),
                  });
                }}
                className="profile-input"
                placeholder="Español, Inglés"
              />
            </div>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm leading-relaxed text-text-muted">{profile.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-[var(--radius-button)] border border-border/60 bg-secondary px-2.5 py-1 text-[11px] font-medium text-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </motion.section>

      <motion.section
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={sectionVariants}
        className={sectionClass(isEditing)}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-text tracking-tight">Areas de Practica Especializada</h2>
          {isEditing && onChange && (
            <Button type="button" variant="ghost" size="sm" onClick={addService}>
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          )}
        </div>
        <motion.div
          variants={serviceContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {profile.services.map((service, i) => (
            <motion.article
              key={i}
              variants={serviceItemVariants}
              whileHover={isEditing ? undefined : { y: -4, scale: 1.01 }}
              className={`rounded-[var(--radius-card)] border border-border p-4 ${
                isEditing ? 'bg-secondary/60' : 'bg-secondary/40 transition-all hover:border-primary/30 hover:bg-white'
              }`}
            >
              {isEditing && onChange ? (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(i, 'title', e.target.value)}
                      className="profile-input text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => removeService(i)}
                      className="shrink-0 rounded p-1 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Eliminar servicio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={service.desc}
                    onChange={(e) => updateService(i, 'desc', e.target.value)}
                    className="profile-input profile-textarea min-h-[4rem] text-[11px]"
                  />
                </div>
              ) : (
                <>
                  <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text tracking-tight">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {service.title}
                  </h3>
                  <p className="pl-3 text-[11px] leading-normal text-text-muted">{service.desc}</p>
                </>
              )}
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={sectionVariants}
        className={sectionClass(isEditing)}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-text tracking-tight">Galería Profesional</h2>
          {isEditing && onChange && (
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={profile.planType !== 'premium' && profile.planType !== 'enterprise' && profile.galleryImages.length >= 3}
              >
                <Plus className="h-4 w-4" />
                Agregar foto
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectFile}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.galleryImages.map((imgUrl, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
              className="space-y-2"
            >
              <button
                type="button"
                onClick={() => !isEditing && setLightboxIndex(i)}
                className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-border/50 bg-secondary ${
                  !isEditing ? 'cursor-zoom-in' : 'cursor-default'
                }`}
                aria-label={`Ver imagen ${i + 1} en grande`}
                tabIndex={isEditing ? -1 : 0}
              >
                <img
                  src={imgUrl}
                  alt={`Instalacion profesional ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {!isEditing && (
                  <span className="absolute inset-0 flex items-center justify-center bg-text/0 transition-colors duration-200 group-hover:bg-text/10" />
                )}
                {isEditing && onChange && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeGalleryImage(i); }}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-text-muted shadow-sm transition-colors hover:text-red-500"
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </button>
              {isEditing && onChange && (
                <ImageUploader
                  value={imgUrl}
                  onChange={(url) => updateGalleryImage(i, url)}
                  label="Cambiar"
                  showUrlInput
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Lightbox / Gallery viewer ──────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
            aria-modal="true"
            role="dialog"
            aria-label="Visor de galería"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Cerrar visor"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image counter */}
            <span className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
              {lightboxIndex + 1} / {profile.galleryImages.length}
            </span>

            {/* Prev button */}
            {profile.galleryImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image with slide animation */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={lightboxIndex}
                src={profile.galleryImages[lightboxIndex]}
                alt={`Instalación profesional ${lightboxIndex + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
              />
            </AnimatePresence>

            {/* Next button */}
            {profile.galleryImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Dot indicators */}
            {profile.galleryImages.length > 1 && (
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {profile.galleryImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      i === lightboxIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ir a imagen ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
