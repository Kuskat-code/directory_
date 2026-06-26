'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, X } from 'lucide-react';

const EASE = [0.4, 0, 0.2, 1] as const;

// ─── Data (unchanged) ─────────────────────────────────────────────────────────

interface PlanFeature {
  text: string;
  included: boolean;
  tooltip?: string;
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

const PRICING_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Presencia profesional esencial',
    priceMonthly: 0,
    priceYearly: 0,
    buttonText: 'Comenzar gratis',
    features: [
      { text: 'Perfil publico en el directorio', included: true },
      { text: 'Informacion de contacto basica', included: true },
      { text: 'Tarjeta digital interactiva', included: false, tooltip: 'Disponible en plan Pro' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Visibilidad y conversion optimizada',
    priceMonthly: 29,
    priceYearly: 23,
    buttonText: 'Elegir Pro',
    isPopular: true,
    features: [
      { text: 'Tarjeta digital interactiva', included: true, tooltip: 'Perfil enriquecido con CTA directo' },
      { text: 'Enlace directo a WhatsApp', included: true },
      { text: 'Integracion con redes sociales', included: true },
      { text: 'Dashboard de analiticas', included: true, tooltip: 'Metricas de visitas y contactos' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solucion para centros medicos',
    priceMonthly: 79,
    priceYearly: 63,
    buttonText: 'Contactar ventas',
    features: [
      { text: 'Todas las funciones Pro', included: true },
      { text: 'Sistema de reservas inteligente', included: true, tooltip: 'Agenda integrada multi-especialista' },
      { text: 'Posicionamiento destacado', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
      { text: 'Herramientas CRM', included: true },
    ],
  },
];

// ─── AnimatedPrice (unchanged) ────────────────────────────────────────────────

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
  return (
    <li className="flex items-start gap-3">
      {feature.included ? (
        <Check
          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
          aria-hidden="true"
        />
      ) : (
        <X
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-300"
          aria-hidden="true"
        />
      )}
      <span
        className={`text-sm ${
          feature.included ? 'text-slate-600' : 'text-slate-400 line-through'
        }`}
      >
        {feature.text}
        {feature.tooltip && (
          <span className="group relative ml-1 inline-block">
            <HelpCircle
              className="inline h-3.5 w-3.5 cursor-help text-slate-400"
              aria-label={feature.tooltip}
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-44 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {feature.tooltip}
            </span>
          </span>
        )}
      </span>
    </li>
  );
}

// ─── PricingSection ───────────────────────────────────────────────────────────

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      className="bg-slate-50 px-4 py-24"
      aria-labelledby="pricing-title"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="pricing-title"
          className="text-4xl font-bold text-slate-900"
        >
          Planes para cada etapa de tu practica
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          Desde consultorios individuales hasta centros medicos. Escala tu
          presencia digital con confianza.
        </p>

        {/* ── Billing toggle ─────────────────────────────────────────── */}
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

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {PRICING_PLANS.map((plan, index) => {
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          const isPopular = Boolean(plan.isPopular);

          return (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col rounded-3xl border bg-white p-8 transition-shadow duration-300 ${
                isPopular
                  ? 'border-slate-200 shadow-md hover:shadow-lg'
                  : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Popular badge — top right */}
              {isPopular && (
                <div className="absolute right-5 top-5">
                  <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white">
                    Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <header className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-slate-900">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </header>

              {/* Price */}
              <div className="mb-8 border-b border-slate-100 pb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    $
                    {price === 0 ? (
                      '0'
                    ) : (
                      <AnimatedPrice value={price} isVisible={true} />
                    )}
                  </span>
                  <span className="text-sm text-slate-400">/ mes</span>
                </div>
                {isYearly && price > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    Facturado anualmente
                  </p>
                )}
              </div>

              {/* Features list */}
              <ul className="mb-8 flex flex-1 flex-col gap-3.5" role="list">
                {plan.features.map((feature) => (
                  <FeatureItem key={feature.text} feature={feature} />
                ))}
              </ul>

              {/* CTA button */}
              <button
                type="button"
                className={`w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-white transition-colors ${
                  isPopular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-950 hover:bg-slate-900'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
