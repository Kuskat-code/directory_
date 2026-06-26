'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { SectionContainer } from '@/src/components/ui/SectionContainer';
import { Card } from '@/src/components/ui/Card';

const EASE = [0.4, 0, 0.2, 1] as const;

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

function FeatureItem({
  feature,
  isPopular,
}: {
  feature: PlanFeature;
  isPopular: boolean;
}) {
  return (
    <li
      className={`flex items-start gap-3 text-sm ${!feature.included && !isPopular ? 'text-text-muted/50 line-through' : ''
        }`}
    >
      {feature.included ? (
        <Check
          className={`mt-0.5 h-5 w-5 shrink-0 ${isPopular ? 'text-cyan-200' : 'text-primary'}`}
          aria-hidden="true"
        />
      ) : (
        <X className="mt-0.5 h-5 w-5 shrink-0 text-text-muted/40" aria-hidden="true" />
      )}
      <span className="flex items-center gap-1.5">
        {feature.text}
        {feature.tooltip && (
          <span className="group relative">
            <HelpCircle
              className="h-3.5 w-3.5 cursor-help text-text-muted/60"
              aria-label={feature.tooltip}
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-44 -translate-x-1/2 rounded-[var(--radius-button)] bg-text px-2 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {feature.tooltip}
            </span>
          </span>
        )}
      </span>
    </li>
  );
}

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <SectionContainer
      spacing="md"
      className="bg-secondary/50"
      aria-labelledby="pricing-title"
    >
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 id="pricing-title" className="text-heading font-bold text-text">
          Planes para cada etapa de tu practica
        </h2>
        <p className="text-subheading mt-4 text-text-muted">
          Desde consultorios individuales hasta centros medicos. Escala tu presencia digital con confianza.
        </p>

        <div
          className="mt-8 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-border bg-white p-1 shadow-sm"
          role="group"
          aria-label="Periodo de facturacion"
        >
          <button
            type="button"
            aria-pressed={!isYearly}
            onClick={() => setIsYearly(false)}
            className={`rounded-[var(--radius-pill)] px-5 py-2 text-sm font-semibold transition-all duration-300 transition-premium ${!isYearly ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text'
              }`}
          >
            Mensual
          </button>
          <button
            type="button"
            aria-pressed={isYearly}
            onClick={() => setIsYearly(true)}
            className={`flex items-center gap-2 rounded-[var(--radius-pill)] px-5 py-2 text-sm font-semibold transition-all duration-300 transition-premium ${isYearly ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text'
              }`}
          >
            Anual
            <Badge variant="accent" className="text-[10px]">-20%</Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
              whileHover={{ y: -8, scale: 1.02 }}
              className={isPopular ? 'lg:-mt-2 lg:mb-2' : ''}
            >
              <Card
                padding="lg"
                elevated={isPopular}
                className={[
                  'relative flex h-full flex-col',
                  'transition-shadow duration-300 transition-premium',
                  isPopular
                    ? 'border-2 border-transparent bg-primary text-white shadow-glow [background-clip:padding-box,border-box] [background-origin:border-box] bg-[linear-gradient(var(--color-primary),var(--color-primary)),linear-gradient(135deg,#0d9488,#06b6d4)]'
                    : 'border-border bg-white hover:shadow-glow',
                ].join(' ')}
              >
                {isPopular && (
                  <Badge
                    variant="accent"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-md"
                  >
                    Más popular
                  </Badge>
                )}

                <header className="mb-6">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className={`mt-1 text-sm ${isPopular ? 'text-white/75' : 'text-text-muted'}`}>
                    {plan.description}
                  </p>
                </header>

                <div className={`mb-8 border-b pb-6 ${isPopular ? 'border-white/20' : 'border-border'}`}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      $
                      {price === 0 ? (
                        '0'
                      ) : (
                        <AnimatedPrice value={price} isVisible={true} />
                      )}
                    </span>
                    <span className={`text-sm ${isPopular ? 'text-white/70' : 'text-text-muted'}`}>
                      / mes
                    </span>
                  </div>
                </div>

                <ul className="mb-8 flex flex-1 flex-col gap-3" role="list">
                  {plan.features.map((feature) => (
                    <FeatureItem key={feature.text} feature={feature} isPopular={isPopular} />
                  ))}
                </ul>

                <Button
                  type="button"
                  variant={isPopular ? 'accent' : 'outline'}
                  className={`w-full ${isPopular ? 'border-0' : ''}`}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            </motion.article>
          );
        })}
      </div>
    </SectionContainer>
  );
}
