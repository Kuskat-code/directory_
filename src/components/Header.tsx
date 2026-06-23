// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    // Quitamos 'fixed' y usamos 'relative' o bloque normal. 
    // Añadimos 'py-4' para darle un poco de espacio arriba y abajo.
    <header className="relative w-full z-50 py-4">
      <nav className="w-full max-w-[96%] mx-auto bg-white/70 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-full px-6 py-3 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          DirectorioPro
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Dashboard', 'Directorio', 'Servicios', 'Soporte'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-blue-600 transition-colors">🔔</button>
          <button className="text-gray-500 hover:text-blue-600 transition-colors">⚙️</button>
          <div className="w-8 h-8 bg-gray-300 rounded-full border border-gray-400"></div>
        </div>
      </nav>
    </header>
  );
}