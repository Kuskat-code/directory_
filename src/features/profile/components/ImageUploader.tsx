'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { Camera, Link2 } from 'lucide-react';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  isAcceptedImageMimeType,
} from '../validation';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  overlay?: boolean;
  showUrlInput?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Cambiar imagen',
  className = '',
  overlay = false,
  showUrlInput = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!isAcceptedImageMimeType(file.type)) {
      setError('Usa una imagen JPG, PNG, WebP o GIF.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError('La imagen no puede superar 5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.onerror = () => setError('No se pudo leer la imagen.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (overlay) {
    return (
      <>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 bg-text/50 text-white opacity-0 transition-opacity hover:opacity-100 ${className}`}
          aria-label={label}
        >
          <Camera className="h-5 w-5" />
          <span className="text-xs font-semibold">{label}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
          className="hidden"
          onChange={handleFile}
        />
      </>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        <Camera className="h-4 w-4" />
        {label}
      </button>
      {showUrlInput && (
        <div className="relative">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="url"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="O pega una URL de imagen"
            className="profile-input pl-9"
          />
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
