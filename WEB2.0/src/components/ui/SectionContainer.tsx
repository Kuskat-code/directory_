import type { HTMLAttributes, ReactNode } from 'react';

interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article';
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide';
  spacing?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  narrow: 'max-w-4xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

const spacingClasses = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-20 md:py-28',
};

export function SectionContainer({
  as: Tag = 'section',
  size = 'default',
  spacing = 'md',
  className = '',
  children,
  ...props
}: SectionContainerProps) {
  return (
    <Tag
      className={[
        sizeClasses[size],
        spacingClasses[spacing],
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
