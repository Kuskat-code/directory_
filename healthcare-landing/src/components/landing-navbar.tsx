import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header className="fixed inset-x-4 top-4 z-50 rounded-full border border-white/15 bg-white/75 px-5 py-3 shadow-2xl shadow-slate-950/10 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <span className="text-lg font-semibold">C</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">CuraSense</p>
            <p className="text-xs text-slate-500">Premium care platform</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#services" className="transition hover:text-slate-950">
            Services
          </a>
          <a href="#doctors" className="transition hover:text-slate-950">
            Doctors
          </a>
          <a href="#reviews" className="transition hover:text-slate-950">
            Reviews
          </a>
          <a href="#contact" className="transition hover:text-slate-950">
            Contact
          </a>
        </nav>

        <div className="hidden gap-3 md:flex">
          <Button variant="ghost" className="px-5 py-2">
            Sign In
          </Button>
          <Button variant="primary" className="px-5 py-2">
            Book Now
          </Button>
        </div>
      </div>
    </header>
  );
}
