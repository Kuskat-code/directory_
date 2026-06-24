'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { useDebounce } from '@/src/hooks/use-debounce';
import { EL_SALVADOR_DEPARTMENTS_ORIENTE } from '@/src/lib/constants';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

const POPULAR_SPECIALTIES = [
  'Medicina General',
  'Cardiología',
  'Pediatría',
  'Dermatología',
  'Ginecología',
  'Psiquiatría',
];

const EASE = [0.4, 0, 0.2, 1] as const;

interface AutocompleteProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  icon: React.ReactNode;
  onChange: (value: string) => void;
  expanded: boolean;
}

function AutocompleteField({
  id,
  label,
  placeholder,
  value,
  options,
  icon,
  onChange,
  expanded,
}: AutocompleteProps) {
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const debouncedQuery = useDebounce(inputValue, 200);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const handleSelect = useCallback(
    (option: string) => {
      setInputValue(option);
      onChange(option);
      setOpen(false);
    },
    [onChange],
  );

  const handleBlur = () => {
    window.setTimeout(() => setOpen(false), 150);
    const match = options.find((o) => o.toLowerCase() === inputValue.toLowerCase());
    if (match) {
      onChange(match);
    } else if (!inputValue) {
      onChange('');
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary">
        {icon}
      </div>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        className={[
          'w-full rounded-[var(--radius-button)] border border-border bg-white py-3.5 pl-11 pr-4 text-sm text-text',
          'outline-none transition-all duration-300 transition-premium',
          'placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20',
          expanded ? 'md:py-4 md:text-base' : '',
        ].join(' ')}
      />
      {open && filtered.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-2 max-h-52 w-full overflow-auto rounded-[var(--radius-card)] border border-border bg-white py-1 shadow-lg"
        >
          {filtered.slice(0, 8).map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm text-text hover:bg-secondary transition-colors duration-200"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface HeroSearchProps {
  videoSrc?: string;
  variant?: 'gradient' | 'video';
}

export default function HeroSearch({ videoSrc, variant = 'gradient' }: HeroSearchProps) {
  const router = useRouter();
  const locationId = useId();
  const [location, setLocation] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    router.push(`/directorio${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handlePopularClick = (spec: string) => {
    router.push(`/directorio?specialty=${encodeURIComponent(spec)}`);
  };

  const showVideo = variant === 'video' && videoSrc;

  return (
    <section
      className={[
        'relative flex items-center justify-center overflow-hidden px-4',
        variant === 'video' ? 'h-[50vh] min-h-[400px]' : 'min-h-[85vh] py-28 md:py-32',
      ].join(' ')}
    >
      {showVideo ? (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            src={videoSrc}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-text/15 via-transparent to-surface"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 gradient-primary" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(6_182_212/0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(10_110_122/0.5),transparent_50%)]" />
        </div>
      )}

      {variant !== 'video' && (
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-white/30 bg-white/10 text-white backdrop-blur-sm"
            >
              +500 especialistas verificados en El Salvador
            </Badge>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-display font-bold text-white"
          >
            Medical Directory of{' '}
            <span className="text-cyan-200">El Salvador</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-subheading mx-auto mt-5 max-w-2xl text-white/85"
          >
            Encuentra medicos verificados, compara resenas reales y agenda citas con la
            confianza que mereces. Salud de calidad, a un clic de distancia.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            onFocus={() => setSearchFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setSearchFocused(false);
              }
            }}
            className={[
              'relative z-50 mx-auto mt-10 rounded-[var(--radius-card)] border border-white/25 bg-white/95 p-3 shadow-glow backdrop-blur-xl',
              'transition-all duration-500 transition-premium md:p-4',
              searchFocused ? 'scale-[1.02] shadow-lg ring-2 ring-white/40' : '',
            ].join(' ')}
            role="search"
            aria-label="Buscar medicos por ubicacion"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
              <AutocompleteField
                id={locationId}
                label="Ubicacion"
                placeholder="Donde? (ej. San Miguel)"
                value={location}
                options={EL_SALVADOR_DEPARTMENTS_ORIENTE}
                icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
                onChange={setLocation}
                expanded={searchFocused}
              />
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full shrink-0 md:w-auto md:min-w-[140px]"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                Buscar
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-sm font-medium text-white/70">Populares:</span>
            {POPULAR_SPECIALTIES.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => handlePopularClick(spec)}
                className="rounded-[var(--radius-pill)] border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 transition-premium hover:border-white/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {spec}
              </button>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}
