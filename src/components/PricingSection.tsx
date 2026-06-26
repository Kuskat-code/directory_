'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  Layers,
  MapPin,
  MessageSquare,
  ShieldCheck,
  User,
} from 'lucide-react';

const EASE = [0.4, 0, 0.2, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanFeature {
  text: string;
  Icon: React.ElementType;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRICING_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Presencia profesional esencial',
    priceMonthly: 0,
    priceYearly: 0,
    buttonText: 'Comenzar gratis',
    features: [
      { text: 'Perfil en directorio profesional',  Icon: User          },
      { text: 'Información de contacto esencial',  Icon: MessageSquare },
      { text: 'Ubicación en mapa interactivo',     Icon: MapPin        },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Visibilidad y conversión optimizada',
    priceMonthly: 29,
    priceYearly: 23,
    buttonText: 'Elegir Pro',
    isPopular: true,
    features: [
      { text: 'Todo lo del plan Basic',            Icon: Layers        },
      { text: 'Tarjeta digital interactiva',       Icon: User          },
      { text: 'Enlace directo a WhatsApp',         Icon: MessageSquare },
      { text: 'Dashboard de analíticas básicas',   Icon: BarChart3     },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solución para centros médicos',
    priceMonthly: 79,
    priceYearly: 63,
    buttonText: 'Contactar ventas',
    features: [
      { text: 'Todo lo del plan Pro',              Icon: Layers        },
      { text: 'Sistema de reservas inteligente',   Icon: Calendar      },
      { text: 'Posicionamiento destacado VIP',     Icon: ShieldCheck   },
      { text: 'Soporte técnico prioritario 24/7',  Icon: ShieldCheck   },
    ],
  },
];

// ─── AnimatedPrice ────────────────────────────────────────────────────────────

function AnimatedPrice({ value, isVisible }: { value: number; isVisible: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 800;
    const start = performance.now();
    let frame: number;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, isVisible]);

  return <span>{display}</span>;
}

// ─── FeatureItem ──────────────────────────────────────────────────────────────

function FeatureItem({ feature }: { feature: PlanFeature }) {
  const { Icon, text } = feature;
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <span className="text-sm text-slate-600">{text}</span>
    </li>
  );
}

// ─── PricingSection ───────────────────────────────────────────────────────────

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      className="relative overflow-hidden bg-slate-50/20 px-4 py-24"
      aria-labelledby="pricing-title"
    >
      {/* Spherical blue glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[40%] z-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.25] blur-[160px]"
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 id="pricing-title" className="text-4xl font-bold text-slate-900">
          Planes para cada etapa de tu practica
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          Desde consultorios individuales hasta centros medicos. Escala tu
          presencia digital con confianza.
        </p>

        {/* Billing toggle */}
        <div
          className="mt-8 inline-flex rounded-full bg-slate-100 p-1"
          role="group"
          aria-label="Periodo de facturacion"
        >
          <button
            type="button"
            aria-pressed={!isYearly}
            onClick={() => setIsYearly(false)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              !isYearly
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            aria-pressed={isYearly}
            onClick={() => setIsYearly(true)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              isYearly
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Anual
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto mt-12 max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PRICING_PLANS.map((plan, index) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            const isPopular = Boolean(plan.isPopular);

            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
                whileHover={{ y: -10 }}
                className={`relative flex flex-col rounded-3xl bg-white p-8 transition-all duration-300 ease-out will-change-transform hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 ${
                  isPopular
                    ? 'border-2 border-blue-500/60 shadow-md'
                    : 'border-2 border-slate-200 shadow-sm'
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute right-5 top-5">
                    <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white">
                      Popular
                    </span>
                  </div>
                )}

                {/* 1. Plan name */}
                <h3 className="mb-1 text-2xl font-bold text-slate-900">
                  {plan.name}
                </h3>

                {/* 2. Description */}
                <p className="mb-5 text-sm text-slate-500">{plan.description}</p>

                {/* 3. Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ${price === 0 ? '0' : <AnimatedPrice value={price} isVisible={true} />}
                    </span>
                    <span className="text-sm text-slate-400">/ mes</span>
                  </div>
                  {isYearly && price > 0 && (
                    <p className="mt-1 text-xs text-slate-400">Facturado anualmente</p>
                  )}
                </div>

                {/* 4. CTA button */}
                <button
                  type="button"
                  className={`mb-6 w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-white transition-colors ${
                    isPopular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-slate-950 hover:bg-slate-900'
                  }`}
                >
                  {plan.buttonText}
                </button>

                {/* 5. Features list */}
                <div className="border-t border-slate-100 pt-5">
                  <ul className="flex flex-col gap-3" role="list">
                    {plan.features.map((feature) => (
                      <FeatureItem key={feature.text} feature={feature} />
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
