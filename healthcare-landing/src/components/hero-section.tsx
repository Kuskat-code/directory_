import { ArrowRight, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: HeartPulse,
    title: "Trusted specialists",
    description: "Verified clinicians with 24/7 support and same-day appointments.",
  },
  {
    icon: ShieldCheck,
    title: "Secure care",
    description: "HIPAA-ready workflow with secure telehealth and follow-up coordination.",
  },
  {
    icon: Stethoscope,
    title: "Smart matching",
    description: "Find the right provider with advanced filters and patient-first insights.",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        autoPlay
        muted
        loop
        playsInline
        src="https://assets.mixkit.co/videos/preview/mixkit-doctor-typing-on-laptop-in-office-5190-large.mp4"
      />
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" />
      <div className="absolute inset-x-0 top-24 mx-auto h-32 w-[38rem] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-white/10 px-4 py-2 text-sm text-blue-100 shadow-lg shadow-blue-900/20 backdrop-blur">
              <HeartPulse className="h-4 w-4 text-blue-300" />
              <span>Book care in minutes with trusted specialists</span>
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Modern healthcare</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Next-gen medical care designed for clarity, trust, and speed.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                CuraSense helps patients connect with top doctors, manage appointments, and access personalized treatment journeys in a premium, secure experience.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="min-w-[12rem]" variant="primary">
                Find a Doctor
              </Button>
              <Button className="min-w-[12rem]" variant="secondary">
                Join as a Doctor
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Response time</p>
                <p className="mt-3 text-3xl font-semibold text-white"><span className="text-blue-300">3</span> min</p>
                <p className="mt-2 text-sm text-slate-300">Average triage completion</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Satisfaction</p>
                <p className="mt-3 text-3xl font-semibold text-white">98%</p>
                <p className="mt-2 text-sm text-slate-300">Patient rating across specialties</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Coverage</p>
                <p className="mt-3 text-3xl font-semibold text-white">+20</p>
                <p className="mt-2 text-sm text-slate-300">Medical specialties available</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:max-w-md lg:p-8">
            <div className="flex items-center gap-3 rounded-3xl bg-slate-950/70 p-4">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-blue-600/15 text-blue-200">
                <span className="text-xl">🩺</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Instant booking</p>
                <p className="text-lg font-semibold text-white">Find licensed doctors near you</p>
              </div>
            </div>

            <div className="space-y-5">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600/15 text-blue-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5 text-slate-100">
              <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Premium care</p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                Save time with curated doctor matches and real-time appointment updates.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-100">
                Explore plans <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
