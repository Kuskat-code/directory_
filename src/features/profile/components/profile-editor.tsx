'use client';

import { CheckCircle, Loader2, Pencil, Save, XCircle, X } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';
import { buildDefaultProfile } from '../lib/defaults';
import { useProfileEditor } from '../hooks/use-profile-editor';
import { useSpecialtyColors } from '../hooks/use-specialty-colors';
import { BasicInfoSection } from './basic-info-section';
import { SummarySection } from './summary-section';
import { PracticeAreasSection } from './practice-areas-section';
import { GallerySection } from './gallery-section';

interface ProfileEditorProps {
  doctor: Doctor;
  tags?: string[];
  children?: (ctx: ProfileEditorContext) => React.ReactNode;
}

export interface ProfileEditorContext {
  profile: ReturnType<typeof useProfileEditor>['profile'];
  isEditing: boolean;
  isLoaded: boolean;
  colors: ReturnType<typeof useSpecialtyColors>;
}

export function ProfileEditor({ doctor, tags = [], children }: ProfileEditorProps) {
  const defaults = buildDefaultProfile(doctor);
  const {
    profile,
    isEditing,
    isLoaded,
    isSaving,
    saveStatus,
    saveError,
    startEditing,
    cancelEditing,
    saveProfile,
    updateDraft,
  } = useProfileEditor(doctor.id, defaults);

  const colors = useSpecialtyColors(profile.specialty);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16" aria-label="Cargando perfil">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditToolbar
        isEditing={isEditing}
        isSaving={isSaving}
        saveStatus={saveStatus}
        saveError={saveError}
        colors={colors}
        onStart={startEditing}
        onSave={saveProfile}
        onCancel={cancelEditing}
      />

      {isEditing && (
        <BasicInfoSection
          profile={profile}
          isEditing={isEditing}
          colors={colors}
          onChange={updateDraft}
        />
      )}

      <SummarySection
        profile={profile}
        tags={tags}
        isEditing={isEditing}
        colors={colors}
        onChange={updateDraft}
      />

      <PracticeAreasSection
        services={profile.services}
        isEditing={isEditing}
        colors={colors}
        onChange={updateDraft}
      />

      <GallerySection
        galleryImages={profile.galleryImages}
        isEditing={isEditing}
        colors={colors}
        onChange={updateDraft}
      />

      {children?.({ profile, isEditing, isLoaded, colors })}
    </div>
  );
}

interface EditToolbarProps {
  isEditing: boolean;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
  colors: ReturnType<typeof useSpecialtyColors>;
  onStart: () => void;
  onSave: () => void;
  onCancel: () => void;
}

function EditToolbar({
  isEditing,
  isSaving,
  saveStatus,
  saveError,
  colors,
  onStart,
  onSave,
  onCancel,
}: EditToolbarProps) {
  if (!isEditing) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border-2 px-4 py-2 text-sm font-semibold transition-all hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            borderColor: colors.primary,
            color: colors.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.primary;
          }}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Personalizar perfil
        </button>
      </div>
    );
  }

  return (
    <div
      className="sticky top-20 z-30 mb-6 rounded-[var(--radius-card)] border shadow-md backdrop-blur-sm"
      style={{ borderColor: colors.border, backgroundColor: `${colors.light}f5` }}
      role="toolbar"
      aria-label="Controles de edición"
    >
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <Loader2
              className="h-4 w-4 animate-spin"
              style={{ color: colors.primary }}
              aria-hidden="true"
            />
          )}
          {saveStatus === 'saved' && (
            <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
          )}
          {saveStatus === 'error' && (
            <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
          )}

          <p className="text-sm font-semibold" style={{ color: colors.text }}>
            {saveStatus === 'saving' && 'Guardando cambios...'}
            {saveStatus === 'saved' && 'Cambios guardados exitosamente'}
            {saveStatus === 'error' && (saveError ?? 'Error al guardar')}
            {saveStatus === 'idle' && 'Modo edición — personaliza tu perfil'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] px-3 py-1.5 text-sm font-semibold text-text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] px-4 py-1.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
