import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  variant = 'rectangular',
  className = '',
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'text'
        ? 'rounded-md h-4'
        : 'rounded-[var(--radius-card)]';

  return (
    <div
      role="status"
      aria-label="Cargando contenido"
      className={['skeleton', variantClass, className].join(' ')}
      {...props}
    />
  );
}
