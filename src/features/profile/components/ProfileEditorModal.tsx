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
  Sparkles,
  Stethoscope,
  Trash2,
  User,
  X,
} from 'lucide-react';
import type { EditableProfile, ProfileService, SpecialtyColorScheme } from '../types';
import { ImageUploader } from './ImageUploader';
import { getSpecialtyColors } from '../specialty-colors';
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

  // Derive accent colors from the current specialty being edited
  const colors = getSpecialtyColors(draft.specialty);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — z-[100] cubre la navbar (z-50) */}
          <motion.div
            key="editor-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
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
            className="fixed inset-x-4 bottom-4 top-6 z-[110] mx-auto flex max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_32px_64px_-12px_rgb(10_110_122/0.25),0_0_0_1px_rgb(10_110_122/0.06)] sm:inset-x-8 md:inset-x-0 md:left-1/2 md:w-full md:-translate-x-1/2"
          >
            {/* Thin specialty-color accent strip at top */}
            <motion.div
              className="h-1 w-full shrink-0"
              animate={{ backgroundColor: colors.primary }}
              transition={{ duration: 0.4, ease: EASE }}
            />

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-white px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <motion.span
                  className="flex h-6 w-6 items-center justify-center rounded-md"
                  animate={{ backgroundColor: colors.badge }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <User
                    className="h-3.5 w-3.5"
                    style={{ color: colors.primary }}
                    aria-hidden="true"
                  />
                </motion.span>
                <h2 className="text-sm font-bold text-text">Editar perfil</h2>
              </div>

              <div className="flex items-center gap-2">
                {saveStatus === 'error' && saveError && (
                  <span className="hidden text-[11px] text-red-500 sm:block">
                    {saveError}
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-success)]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Guardado
                  </span>
                )}

                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="rounded-[var(--radius-button)] px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-50"
                >
                  Cancelar
                </button>

                {/* Save button uses specialty color */}
                <motion.button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  animate={{ backgroundColor: colors.primary }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-[var(--radius-button)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isSaving ? 'Guardando…' : 'Guardar cambios'}
                </motion.button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="ml-0.5 rounded-full p-1.5 text-text-muted transition-colors hover:bg-secondary hover:text-text"
                  aria-label="Cerrar editor"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Tab bar ────────────────────────────────────────── */}
            <div
              className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-border/60 bg-white px-3"
              style={{ scrollbarWidth: 'none' }}
            >
              {TABS.map(({ id, label, Icon, premium }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className="flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-[11px] font-semibold transition-colors"
                    style={
                      isActive
                        ? { borderBottomColor: colors.primary, color: colors.primary }
                        : { borderBottomColor: 'transparent', color: 'var(--color-text-muted)' }
                    }
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
                );
              })}
            </div>

            {/* ── Tab content ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-secondary/20 p-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.16, ease: EASE }}
                >
                  {activeTab === 'perfil' && (
                    <PerfilTab draft={draft} colors={colors} onChange={onChange} />
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
  colors,
  onChange,
}: {
  draft: EditableProfile;
  colors: SpecialtyColorScheme;
  onChange: (u: Partial<EditableProfile>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Avatar card */}
      <Card>
        <Field label="Foto de perfil">
          <div className="flex items-center gap-4">
            <img
              src={draft.avatar}
              alt="Foto de perfil actual"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
            />
            <ImageUploader
              value={draft.avatar}
              onChange={(avatar) => onChange({ avatar })}
              label="Cambiar foto"
            />
          </div>
        </Field>
      </Card>

      {/* Main info card — tinted with specialty color */}
      <motion.div
        animate={{ borderColor: colors.border, backgroundColor: colors.light }}
        transition={{ duration: 0.4, ease: EASE }}
        className="space-y-4 rounded-[var(--radius-card)] border p-4 shadow-sm"
      >
        <Field label="Nombre completo">
          <input
            type="text"
            value={draft.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="profile-input"
            placeholder="Dr. Nombre Apellido"
          />
        </Field>

        {/* Specialty — full-width with color preview dot */}
        <Field label="Especialidad">
          <div className="relative">
            {/* Specialty color swatch */}
            <motion.span
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full"
              animate={{ backgroundColor: colors.primary }}
              transition={{ duration: 0.4, ease: EASE }}
            />
            <select
              value={draft.specialty}
              onChange={(e) => onChange({ specialty: e.target.value })}
              className="profile-input pl-10"
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
            {/* relative wrapper already present in parent div; icon inside */}
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={draft.location}
                onChange={(e) => onChange({ location: e.target.value })}
                className="profile-input pl-10"
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
              onChange={(e) =>
                onChange({ experience: parseInt(e.target.value, 10) || 0 })
              }
              className="profile-input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Teléfono">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="tel"
                value={draft.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className="profile-input pl-10"
                placeholder="+503 2345 6789"
              />
            </div>
          </Field>
          <Field label="Correo electrónico">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={draft.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="profile-input pl-10"
                placeholder="doctor@email.com"
              />
            </div>
          </Field>
        </div>
      </motion.div>
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
    <Card>
      <div className="space-y-4">
        <Field label="Biografía profesional">
          <textarea
            value={draft.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            rows={7}
            className="profile-input profile-textarea resize-none"
            placeholder="Describe tu experiencia y enfoque profesional…"
            maxLength={1000}
          />
          <p className="mt-1 text-right text-[10px] text-text-muted">
            {draft.bio.length} / 1000
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
          <p className="mt-1 text-[10px] text-text-muted">
            Separa los idiomas con comas.
          </p>
        </Field>
      </div>
    </Card>
  );
}

// ─── Tab: Banner (Premium) ────────────────────────────────────────────────────

function BannerTab({ draft }: { draft: EditableProfile }) {
  return (
    <Card>
      <div className="space-y-4">
        {/* Title + badge */}
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold text-text">Imagen de portada</h3>
          <PremiumBadge />
        </div>

        {/* Dimmed preview with lock overlay */}
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border/60">
          <img
            src={draft.coverImage}
            alt="Banner actual del perfil"
            className="h-40 w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-text/20 backdrop-blur-[1px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-border/40">
              <Lock className="h-4 w-4 text-text-muted" aria-hidden="true" />
            </span>
            <p className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-text-muted backdrop-blur-sm">
              Solo lectura · versión gratuita
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-text-muted">
          Sube una imagen propia para personalizar el encabezado de tu perfil público y
          destacar tu consulta o clínica. Disponible exclusivamente en la versión Premium.
        </p>

        <PremiumUpgradeButton />
      </div>
    </Card>
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
      <Card>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">Galería profesional</h3>
            <p className="text-[11px] text-text-muted">
              {images.length} / {FREE_GALLERY_LIMIT} imágenes en versión gratuita
            </p>
          </div>
          {!atLimit && (
            <button
              type="button"
              onClick={addImage}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary/50 hover:text-primary"
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
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-border/60 bg-secondary">
                  <img
                    src={imgUrl}
                    alt={`Foto profesional ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-text-muted shadow-sm transition-colors hover:text-red-500"
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
          <div className="rounded-[var(--radius-card)] border border-dashed border-border py-10 text-center">
            <Images className="mx-auto mb-2 h-7 w-7 text-border" />
            <p className="text-xs text-text-muted">Aún no hay fotos en la galería.</p>
          </div>
        )}
      </Card>

      {/* Premium upsell — shown only at limit */}
      {atLimit && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 rounded-[var(--radius-card)] border border-amber-200/80 bg-amber-50/60 p-4"
        >
          <Crown
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-amber-800">
              Límite gratuito alcanzado
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-amber-700">
              Actualiza a Premium para subir fotos ilimitadas y destacar más tu
              clínica o consultorio.
            </p>
            <PremiumUpgradeButton className="mt-2.5" />
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
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text">Áreas de práctica</h3>
          <p className="text-[11px] text-text-muted">{services.length}/8 servicios</p>
        </div>
        {services.length < 8 && (
          <button
            type="button"
            onClick={addService}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary/50 hover:text-primary"
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
            className="rounded-[var(--radius-card)] border border-border/60 bg-secondary/30 p-3.5"
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
                className="mt-0.5 shrink-0 rounded-[var(--radius-button)] p-1 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
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
    </Card>
  );
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border/60 bg-white p-4 shadow-sm">
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
      <Crown className="h-2.5 w-2.5" aria-hidden="true" />
      Premium
    </span>
  );
}

function PremiumUpgradeButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => alert('¡Próximamente podrás adquirir tu Licencia Premium!')}
      className={`inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      Mejorar a Premium
    </button>
  );
}
