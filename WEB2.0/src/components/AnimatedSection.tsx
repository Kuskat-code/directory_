'use client';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}

export default function AnimatedSection({ children, className, delay = 0, as: Tag = 'section' }: Props) {
  const MotionTag = motion(Tag);

  return (
    <MotionTag
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
