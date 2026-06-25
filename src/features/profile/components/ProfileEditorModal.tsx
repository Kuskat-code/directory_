'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  Crown,
  FileText,
  Image as ImageIcon,
  Images,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Stethoscope,
  Trash2,
  User,
  X,
} from 'lucide-react';
import type { EditableProfile, ProfileService } from '../types';
import { ImageUploader } from './ImageUploader';
import { MEDICAL_SPECIALTIES } from '@/src/lib/constants';

const FREE_GALLERY_LIMIT = 3;
const EASE = [0.4, 0, 0.2, 1] as const;
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type TabId = 'perfil' | 'resumen' | 'banner' | 'galeria' | 'servicios';

interface TabDef {
  id: TabId;
  label: string;
  Icon: React.ElementType;
  premium?: true;
}

const TABS: TabDef[] = [
  { id: 'perfil', label: 'Perfil', Icon: User },
  { id: 'resumen', label: 'Resumen', Icon: FileText },
  { id: 'banner', label: 'Banner', Icon: ImageIcon, premium: true },
  { id: 'galeria', label: 'Galería', Icon: Images },
  { id: 'servicios', label: 'Servicios', Icon: Briefcase },
];

interface ProfileEditorModalProps {
  isOpen: boolean;
  draft: EditableProfile;
  isSaving: boolean;
  saveStatus: SaveStatus;
  saveError: string | null;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<EditableProfile>) => void;
}

export function ProfileEditorModal({
  isOpen,
  draft,
  isSaving,
  saveStatus,
  saveError,
  onSave,
  onCancel,
  onChange,
}: ProfileEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('perfil');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="editor-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="editor-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Editor de perfil profesional"
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 24 }}
            transition={{ duration: 0.26, ease: EASE }}
            className="fixed inset-x-4 bottom-4 top-6 z-50 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 sm:inset-x-8 md:inset-x-0 md:left-1/2 md:w-full md:-translate-x-1/2"
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Editar perfil
              </h2>

              <div className="flex items-center gap-2">
                {saveStatus === 'error' && saveError && (
                  <span className="hidden text-[11px] text-red-500 sm:block">{saveError}</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Guardado
                  </span>
                )}

                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isSaving ? 'Guardando…' : 'Guardar cambios'}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="ml-0.5 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  aria-label="Cerrar editor"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Tab bar ────────────────────────────────────────── */}
            <div
              className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-zinc-100 px-3 dark:border-zinc-800"
              style={{ scrollbarWidth: 'none' }}
            >
              {TABS.map(({ id, label, Icon, premium }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-[11px] font-semibold transition-colors ${
                    activeTab === id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                  {premium && (
                    <Crown
                      className="h-2.5 w-2.5 text-amber-400"
                      aria-label="Función Premium"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── Tab content ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.16, ease: EASE }}
                >
                  {activeTab === 'perfil' && (
                    <PerfilTab draft={draft} onChange={onChange} />
                  )}
                  {activeTab === 'resumen' && (
                    <ResumenTab draft={draft} onChange={onChange} />
                  )}
                  {activeTab === 'banner' && <BannerTab draft={draft} />}
                  {activeTab === 'galeria' && (
                    <GaleriaTab draft={draft} onChange={onChange} />
                  )}
                  {activeTab === 'servicios' && (
                    <ServiciosTab draft={draft} onChange={onChange} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Tab: Perfil ──────────────────────────────────────────────────────────────

function PerfilTab({
  draft,
  onChange,
}: {
  draft: EditableProfile;
  onChange: (u: Partial<EditableProfile>) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Foto de perfil">
        <div className="flex items-center gap-4">
          <img
            src={draft.avatar}
            alt="Foto de perfil actual"
            className="h-14 w-14 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
          />
          <ImageUploader
            value={draft.avatar}
            onChange={(avatar) => onChange({ avatar })}
            label="Cambiar foto"
          />
        </div>
      </Field>

      <Field label="Nombre completo">
        <input
          type="text"
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="profile-input"
          placeholder="Dr. Nombre Apellido"
        />
      </Field>

      <Field label="Especialidad">
        <div className="relative">
          <Stethoscope className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <select
            value={draft.specialty}
            onChange={(e) => onChange({ specialty: e.target.value })}
            className="profile-input pl-8"
          >
            {MEDICAL_SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ubicación">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={draft.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="profile-input pl-8"
              placeholder="Ciudad, Depto."
            />
          </div>
        </Field>
        <Field label="Años de experiencia">
          <input
            type="number"
            min={0}
            max={60}
            value={draft.experience}
            onChange={(e) => onChange({ experience: parseInt(e.target.value, 10) || 0 })}
            className="profile-input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono">
          <div className="relative">
            <Phone className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="tel"
              value={draft.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="profile-input pl-8"
              placeholder="+503 2345 6789"
            />
          </div>
        </Field>
        <Field label="Correo electrónico">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              value={draft.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="profile-input pl-8"
              placeholder="doctor@email.com"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}

// ─── Tab: Resumen ─────────────────────────────────────────────────────────────

function ResumenTab({
  draft,
  onChange,
}: {
  draft: EditableProfile;
  onChange: (u: Partial<EditableProfile>) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Biografía profesional">
        <textarea
          value={draft.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          rows={7}
          className="profile-input profile-textarea resize-none"
          placeholder="Describe tu experiencia y enfoque profesional…"
          maxLength={1000}
        />
        <p className="mt-1 text-right text-[10px] text-zinc-400">
          {draft.bio.length}/1000
        </p>
      </Field>

      <Field label="Idiomas hablados">
        <input
          type="text"
          value={draft.languages.join(', ')}
          onChange={(e) =>
            onChange({
              languages: e.target.value
                .split(',')
                .map((l) => l.trim())
                .filter(Boolean),
            })
          }
          className="profile-input"
          placeholder="Español, Inglés, Francés…"
        />
        <p className="mt-1 text-[10px] text-zinc-400">Separa los idiomas con comas.</p>
      </Field>
    </div>
  );
}

// ─── Tab: Banner (Premium) ────────────────────────────────────────────────────

function BannerTab({ draft }: { draft: EditableProfile }) {
  return (
    <div className="space-y-4">
      {/* Section title + badge */}
      <div className="flex items-center gap-2.5">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          Imagen de portada
        </h3>
        <PremiumBadge />
      </div>

      {/* Dimmed preview with lock */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <img
          src={draft.coverImage}
          alt="Banner actual del perfil"
          className="h-40 w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-900/30 backdrop-blur-[1px]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
            <Lock className="h-4 w-4 text-white" aria-hidden="true" />
          </span>
          <p className="text-[11px] font-medium text-white/80">
            Solo lectura · versión gratuita
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Sube una imagen propia para personalizar el encabezado de tu perfil público y
        destacar tu consulta o clínica. Disponible exclusivamente en la versión Premium.
      </p>

      <PremiumUpgradeButton />
    </div>
  );
}

// ─── Tab: Galería ─────────────────────────────────────────────────────────────

function GaleriaTab({
  draft,
  onChange,
}: {
  draft: EditableProfile;
  onChange: (u: Partial<EditableProfile>) => void;
}) {
  const images = draft.galleryImages;
  const atLimit = images.length >= FREE_GALLERY_LIMIT;

  const addImage = () => {
    if (atLimit) return;
    onChange({ galleryImages: [...images, FALLBACK_IMG] });
  };

  const removeImage = (idx: number) => {
    onChange({ galleryImages: images.filter((_, i) => i !== idx) });
  };

  const updateImage = (idx: number, url: string) => {
    onChange({ galleryImages: images.map((img, i) => (i === idx ? url : img)) });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Galería profesional
          </h3>
          <p className="text-[11px] text-zinc-400">
            {images.length} / {FREE_GALLERY_LIMIT} imágenes gratuitas
          </p>
        </div>
        {!atLimit && (
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-primary/60 hover:text-primary dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-primary/50 dark:hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Agregar foto
          </button>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {images.map((imgUrl, i) => (
            <div key={i} className="space-y-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                <img
                  src={imgUrl}
                  alt={`Foto profesional ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-zinc-500 shadow-sm transition-colors hover:text-red-500 dark:bg-zinc-900/90"
                  aria-label={`Eliminar foto ${i + 1}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <ImageUploader
                value={imgUrl}
                onChange={(url) => updateImage(i, url)}
                label="Cambiar"
                showUrlInput
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 py-10 text-center dark:border-zinc-700">
          <Images className="mx-auto mb-2 h-7 w-7 text-zinc-300" />
          <p className="text-xs text-zinc-400">Aún no hay fotos en la galería.</p>
        </div>
      )}

      {/* Premium upsell — only when at limit */}
      {atLimit && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/80 p-4 dark:border-amber-800/30 dark:bg-amber-950/20"
        >
          <Crown
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <div>
            <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              Límite gratuito alcanzado
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-amber-600 dark:text-amber-400">
              Actualiza a Premium para subir fotos ilimitadas y destacar más tu
              clínica o consultorio.
            </p>
            <button
              type="button"
              onClick={() => alert('¡Próximamente podrás adquirir tu Licencia Premium!')}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-700 shadow-sm transition-colors hover:bg-amber-50 dark:border-amber-700/50 dark:bg-zinc-900 dark:text-amber-400 dark:hover:bg-amber-950/40"
            >
              <Crown className="h-3 w-3" />
              Mejorar a Premium
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Tab: Servicios ───────────────────────────────────────────────────────────

function ServiciosTab({
  draft,
  onChange,
}: {
  draft: EditableProfile;
  onChange: (u: Partial<EditableProfile>) => void;
}) {
  const services = draft.services;

  const addService = () => {
    if (services.length >= 8) return;
    onChange({
      services: [
        ...services,
        { title: 'Nuevo servicio', desc: 'Descripción del servicio.' },
      ],
    });
  };

  const updateService = (i: number, field: keyof ProfileService, value: string) => {
    onChange({
      services: services.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    });
  };

  const removeService = (i: number) => {
    onChange({ services: services.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Áreas de práctica
          </h3>
          <p className="text-[11px] text-zinc-400">{services.length}/8 servicios</p>
        </div>
        {services.length < 8 && (
          <button
            type="button"
            onClick={addService}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-primary/60 hover:text-primary dark:border-zinc-700 dark:text-zinc-300"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Agregar servicio
          </button>
        )}
      </div>

      <div className="space-y-3">
        {services.map((service, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-700 dark:bg-zinc-800/60"
          >
            <div className="mb-2 flex items-start gap-2">
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateService(i, 'title', e.target.value)}
                className="profile-input flex-1 text-xs font-semibold"
                placeholder="Título del servicio"
              />
              <button
                type="button"
                onClick={() => removeService(i)}
                className="mt-0.5 shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                aria-label="Eliminar servicio"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea
              value={service.desc}
              onChange={(e) => updateService(i, 'desc', e.target.value)}
              rows={2}
              className="profile-input profile-textarea min-h-[4rem] resize-none text-[11px]"
              placeholder="Descripción del servicio…"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-400">
      <Crown className="h-2.5 w-2.5" aria-hidden="true" />
      Premium
    </span>
  );
}

function PremiumUpgradeButton() {
  return (
    <button
      type="button"
      onClick={() => alert('¡Próximamente podrás adquirir tu Licencia Premium!')}
      className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-900/30"
    >
      <Crown className="h-3.5 w-3.5" aria-hidden="true" />
      Mejorar a Premium
    </button>
  );
}
