import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-secondary text-text',
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  outline: 'border border-border bg-surface text-text-muted',
};

export function Badge({
  variant = 'default',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold',
        'transition-colors duration-300 transition-premium',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
