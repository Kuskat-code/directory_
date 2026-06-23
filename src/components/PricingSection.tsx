'use client';

import { useState } from 'react';

// 1. Tipado estricto para asegurar consistencia en los datos de los planes
interface PlanFeature {
  text: string;
  included: boolean;
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
    description: 'Establece tu presencia básica',
    priceMonthly: 0,
    priceYearly: 0,
    buttonText: 'Comenzar Gratis',
    features: [
      { text: 'Perfil público en el directorio', included: true },
      { text: 'Información de contacto básica', included: true },
      { text: 'Tarjeta digital de presentación', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Compromiso directo con clientes',
    priceMonthly: 29,
    priceYearly: 23, // ~20% de descuento
    buttonText: 'Volverse Profesional',
    isPopular: true,
    features: [
      { text: 'Tarjeta digital interactiva', included: true },
      { text: 'Enlace directo a WhatsApp', included: true },
      { text: 'Integración con redes sociales', included: true },
      { text: 'Dashboard de analíticas básicas', included: true },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Visibilidad de máximo nivel',
    priceMonthly: 79,
    priceYearly: 63,
    buttonText: 'Contactar Ventas',
    features: [
      { text: 'Todas las funciones Profesionales', included: true },
      { text: 'Sistema de reservas inteligente', included: true },
      { text: 'Posicionamiento destacado en home', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
      { text: 'Herramientas CRM para clientes', included: true },
    ],
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-20 px-4 bg-brand-light" aria-labelledby="pricing-title">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 id="pricing-title" className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 tracking-tight">
            Elige el plan perfecto
          </h2>
          <p className="text-brand-dark/80 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Muestra tu experiencia, conecta con pacientes de alto valor y expande tu red profesional.
          </p>

          {/* Selector Mensual / Anual (Toggle) */}
          <div className="inline-flex items-center justify-center gap-3 bg-brand-white p-1.5 rounded-full shadow-xs border border-brand-dark/5">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                !isYearly 
                  ? 'bg-brand-teal text-brand-white shadow-xs' 
                  : 'text-brand-dark/70 hover:text-brand-dark'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                isYearly 
                  ? 'bg-brand-teal text-brand-white shadow-xs' 
                  : 'text-brand-dark/70 hover:text-brand-dark'
              }`}
            >
              Anual
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                isYearly ? 'bg-brand-accent text-brand-white' : 'bg-brand-accent/10 text-brand-accent'
              }`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Grid de Tarjetas de Precios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch lg:gap-6">
          {PRICING_PLANS.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            
            return (
              <article
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 border ${
                  plan.isPopular
                    ? 'bg-brand-teal text-brand-white md:-translate-y-4 shadow-xl border-brand-teal'
                    : 'bg-brand-white text-brand-dark shadow-xs border-brand-dark/10'
                } hover:shadow-md hover:border-brand-accent/30`}
              >
                {/* Badge para el plan destacado */}
                {plan.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-white text-xs uppercase font-extrabold px-4 py-1 rounded-full tracking-wider shadow-sm animate-pulse-slow">
                    Más Popular
                  </span>
                )}

                <div>
                  <header className="mb-6">
                    <h3 className="text-2xl font-bold mb-1 tracking-tight">{plan.name}</h3>
                    <p className={`text-sm ${plan.isPopular ? 'text-brand-light/80' : 'text-brand-dark/60'}`}>
                      {plan.description}
                    </p>
                  </header>
                  
                  {/* Sección de Precio */}
                  <div className="flex items-baseline mb-8 border-b pb-6 border-brand-dark/10">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ${price}
                    </span>
                    <span className={`text-sm ml-1 font-medium ${plan.isPopular ? 'text-brand-light/70' : 'text-brand-dark/50'}`}>
                      / mes
                    </span>
                  </div>

                  {/* Listado de Características */}
                  <ul className="space-y-4 mb-8" role="list">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start text-sm font-medium ${
                          !feature.included && !plan.isPopular ? 'text-brand-dark/40 line-through' : ''
                        }`}
                      >
                        {feature.included ? (
                          <svg
                            className={`w-5 h-5 mr-3 shrink-0 ${
                              plan.isPopular ? 'text-brand-accent' : 'text-brand-teal'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg
                            className={`w-5 h-5 mr-3 shrink-0 ${plan.isPopular ? 'text-brand-white/40' : 'text-brand-dark/30'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botón de Acción con estados Hover pulidos */}
                <footer className="mt-auto">
                  <button
                    type="button"
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                      plan.isPopular
                        ? 'bg-brand-accent text-brand-white hover:bg-brand-accent/90 shadow-sm active:scale-98'
                        : 'bg-brand-light text-brand-dark hover:bg-brand-dark hover:text-brand-white border border-transparent active:scale-98'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}