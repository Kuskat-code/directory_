'use client';

import { motion } from 'framer-motion';
import { Plus, Star, Trash2 } from 'lucide-react';
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

  const addGalleryImage = () => {
    if (!onChange) return;
    onChange({
      galleryImages: [
        ...profile.galleryImages,
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400',
      ],
    });
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
                value={profile.languages.join(', ')}
                onChange={(e) =>
                  onChange({
                    languages: e.target.value
                      .split(',')
                      .map((l) => l.trim())
                      .filter(Boolean),
                  })
                }
                className="profile-input"
                placeholder="Espanol, Ingles"
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
          <h2 className="text-base font-bold text-text tracking-tight">Galeria Profesional</h2>
          {isEditing && onChange && (
            <Button type="button" variant="ghost" size="sm" onClick={addGalleryImage}>
              <Plus className="h-4 w-4" />
              Agregar foto
            </Button>
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
              whileHover={isEditing ? undefined : { scale: 1.05 }}
              className="space-y-2"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-card)] border border-border/50 bg-secondary">
                <img
                  src={imgUrl}
                  alt={`Instalacion profesional ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                {isEditing && onChange && (
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-text-muted shadow-sm transition-colors hover:text-red-500"
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
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

      <motion.section
        custom={3}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={sectionVariants}
        className={sectionClass(false)}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text tracking-tight">Resenas de Clientes</h2>
            <p className="mt-0.5 text-[11px] text-text-muted">
              Basado en {doctor.reviews} opiniones verificadas
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Ver todas
          </button>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-secondary/30 p-4">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-text leading-none">Paciente Verificado</h4>
                <p className="mt-0.5 text-[10px] text-text-muted">Atencion en {profile.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-amber-400" aria-label={`${doctor.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(doctor.rating) ? 'fill-amber-400 text-amber-400' : 'fill-border text-border'}`}
                />
              ))}
            </div>
          </div>
          <p className="pl-0.5 text-xs leading-relaxed italic text-text-muted">
            Excelente atencion y profesionalismo. El doctor me brindo un diagnostico claro y
            un tratamiento efectivo. Altamente recomendado.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
