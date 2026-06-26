import { forwardRef, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevated = true,
      hoverable = false,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-[var(--radius-card)] bg-surface border border-border',
          elevated ? 'shadow-md' : 'shadow-sm',
          hoverable
            ? 'transition-all duration-300 transition-premium hover:shadow-lg hover:-translate-y-0.5'
            : '',
          paddingClasses[padding],
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
