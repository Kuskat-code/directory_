'use client';

import type { CSSProperties } from 'react';
import {
  Activity,
  Apple,
  Baby,
  Blocks,
  Bone,
  Brain,
  BrainCircuit,
  Cross,
  Droplets,
  Ear,
  Eye,
  FlaskConical,
  Footprints,
  Glasses,
  Heart,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  Pill,
  Salad,
  Smile,
  Stethoscope,
  Sun,
  Utensils,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { getSpecialtyEditorColors } from '@/src/lib/specialty-colors';

/**
 * Distinct icon pools per specialty.
 *
 * Rules enforced:
 * - Stethoscope is exclusive to Medicina General
 * - Footprints is in Ortopedia/Traumatología, never Psiquiatría
 * - Heart/HeartPulse stay on Cardiología; Ginecología uses HeartHandshake
 */
const SPECIALTY_ICON_POOLS: Record<string, LucideIcon[]> = {
  'Cardiología':            [Heart, HeartPulse, Activity],
  'Dermatología':           [Sun, Droplets],
  'Endocrinología':         [FlaskConical, Activity],
  'Gastroenterología':      [Utensils, Wheat],
  'Ginecología':            [Baby, HeartHandshake],
  'Medicina General':       [Stethoscope, Cross],
  'Neurología':             [Brain, BrainCircuit],
  'Nutrición':              [Apple, Salad],
  'Odontología':            [Smile],
  'Oftalmología':           [Eye, Glasses],
  'Ortopedia':              [Bone, Footprints],
  'Traumatología y Ortopedia': [Bone, Footprints],
  'Otorrinolaringología':   [Ear],
  'Pediatría':              [Baby, Blocks],
  'Psicología':             [Brain, MessageCircle, HeartHandshake, Pill],
  'Psiquiatría':            [Brain, MessageCircle, HeartHandshake, Pill],
  'Urología':               [Droplets],
};

/** Fallback pool (never includes Stethoscope — reserved for Medicina General). */
const FALLBACK_POOL: LucideIcon[] = [Cross, Smile, Ear, Eye];

interface ScatterSlot {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  /** Base opacity used in unfiltered (all-specialties) mode. */
  baseOpacity: number;
  delay: number;
  duration: number;
}

/**
 * 18 fixed scatter positions.  These never change — only which icon and which
 * color fills each slot changes based on the active specialty filter.
 */
const SCATTER_SLOTS: ScatterSlot[] = [
  { top:  '18%', left:  '2%',  size: 28, baseOpacity: 0.26, delay: 0,   duration: 6.5 },
  { top:  '10%', right: '3%',  size: 32, baseOpacity: 0.24, delay: 1.1, duration: 7.2 },
  { top:  '26%', left:  '16%', size: 24, baseOpacity: 0.22, delay: 0.4, duration: 5.8 },
  { top:  '34%', right: '2%',  size: 30, baseOpacity: 0.26, delay: 2.0, duration: 6.8 },
  { top:  '46%', left:  '1%',  size: 34, baseOpacity: 0.24, delay: 0.8, duration: 7.5 },
  { top:  '52%', right: '4%',  size: 26, baseOpacity: 0.27, delay: 1.6, duration: 6.2 },
  { top:  '68%', left:  '4%',  size: 28, baseOpacity: 0.23, delay: 2.4, duration: 5.5 },
  { top:  '74%', right: '5%',  size: 30, baseOpacity: 0.25, delay: 0.6, duration: 7.0 },
  { top:  '20%', left:  '48%', size: 36, baseOpacity: 0.20, delay: 1.9, duration: 8.0 },
  { top:  '82%', left:  '10%', size: 26, baseOpacity: 0.24, delay: 1.3, duration: 6.4 },
  { top:  '78%', right: '12%', size: 24, baseOpacity: 0.25, delay: 2.8, duration: 5.9 },
  { top:  '40%', right: '1%',  size: 32, baseOpacity: 0.23, delay: 0.2, duration: 7.8 },
  { top:  '60%', left:  '2%',  size: 30, baseOpacity: 0.26, delay: 2.1, duration: 6.6 },
  { top:  '58%', right: '6%',  size: 28, baseOpacity: 0.24, delay: 1.7, duration: 7.1 },
  { top:   '8%', left:  '26%', size: 24, baseOpacity: 0.21, delay: 0.9, duration: 6.0 },
  { top:  '88%', right: '3%',  size: 34, baseOpacity: 0.23, delay: 3.0, duration: 8.2 },
  { top:  '88%', left:  '22%', size: 28, baseOpacity: 0.23, delay: 2.5, duration: 7.3 },
  { top:  '32%', left:  '6%',  size: 26, baseOpacity: 0.24, delay: 1.4, duration: 6.9 },
];

/**
 * Ordered list of specialties used in unfiltered (mixed) mode.
 * Each slot index maps to one specialty so all are represented.
 */
const MIXED_SPECIALTY_ORDER = [
  'Cardiología', 'Pediatría', 'Ginecología', 'Dermatología',
  'Neurología', 'Oftalmología', 'Odontología', 'Psicología',
  'Medicina General', 'Gastroenterología', 'Urología', 'Ortopedia',
  'Endocrinología', 'Nutrición', 'Otorrinolaringología', 'Psiquiatría',
  'Traumatología y Ortopedia', 'Cardiología',
] as const;

interface SpecialtyIconBackgroundProps {
  /** Currently selected specialty filter.  Empty string = no filter (show all). */
  specialty?: string;
}

export function SpecialtyIconBackground({ specialty = '' }: SpecialtyIconBackgroundProps) {
  const activeSpecialty = specialty.trim();
  const filteredPool: LucideIcon[] | null = activeSpecialty
    ? (SPECIALTY_ICON_POOLS[activeSpecialty] ?? FALLBACK_POOL)
    : null;
  const filteredColor: string | null = activeSpecialty
    ? getSpecialtyEditorColors(activeSpecialty).primary
    : null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {SCATTER_SLOTS.map((slot, index) => {
        let Icon: LucideIcon;
        let color: string;
        let opacity: number;

        if (filteredPool && filteredColor) {
          // ── Single-specialty mode ────────────────────────────────────────────
          // All 18 positions show icons from the selected specialty's pool only,
          // tinted with that specialty's primary color.
          // Opacity boosted (×1.35) over the already-raised base so a single
          // color reads clearly.  Capped at 0.38 to avoid competing with cards.
          Icon = filteredPool[index % filteredPool.length];
          color = filteredColor;
          opacity = Math.min(slot.baseOpacity * 1.35, 0.38);
        } else {
          // ── Mixed mode (no filter) ───────────────────────────────────────────
          // Each position uses a different specialty's icon & color so the full
          // spectrum of the directory is represented.
          const slotSpecialty = MIXED_SPECIALTY_ORDER[index];
          const pool = SPECIALTY_ICON_POOLS[slotSpecialty] ?? FALLBACK_POOL;
          Icon = pool[index % pool.length];
          color = getSpecialtyEditorColors(slotSpecialty).primary;
          opacity = slot.baseOpacity;
        }

        const positionStyle: CSSProperties = {
          top: slot.top,
          left: slot.left,
          right: slot.right,
          bottom: slot.bottom,
          width: slot.size,
          height: slot.size,
          // Inline color (not Tailwind class) so it always applies regardless of
          // build-time scanning.  SVG icons use stroke="currentColor" and inherit this.
          color,
          opacity,
          animationDuration: `${slot.duration}s`,
          animationDelay: `${slot.delay}s`,
        };

        return (
          <div
            key={`${activeSpecialty || 'all'}-${index}`}
            className="animate-float-icon absolute"
            style={positionStyle}
          >
            <Icon className="h-full w-full" strokeWidth={1.25} />
          </div>
        );
      })}
    </div>
  );
}
