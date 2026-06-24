'use client';

import { Pencil, Save, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

interface ProfileEditToolbarProps {
  isEditing: boolean;
  onStart: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditToolbar({
  isEditing,
  onStart,
  onSave,
  onCancel,
}: ProfileEditToolbarProps) {
  if (isEditing) {
    return (
      <div className="sticky top-20 z-30 mb-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-primary/30 bg-white/95 px-4 py-3 shadow-md backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-primary">Modo edicion — personaliza tu perfil</p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={onSave}>
            <Save className="h-4 w-4" />
            Guardar cambios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex justify-end">
      <Button type="button" variant="outline" size="sm" onClick={onStart}>
        <Pencil className="h-4 w-4" />
        Personalizar perfil
      </Button>
    </div>
  );
}
