// src/features/directory/components/HeroVideo.tsx
export default function HeroVideo() {
  const videoUrl = "https://res.cloudinary.com/dl6txsp09/video/upload/f_auto,q_auto/v1782191676/medical-center-hospital-business-presentation_afwzlh.mp4";

  return (
    // Hemos eliminado 'pt-24' para que el video comience justo debajo de la barra
    <section className="relative w-full pb-4"> 
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
        <video 
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <h1 className="text-white text-4xl md:text-7xl font-serif italic font-bold tracking-tight">
            DirectorioPro
          </h1>
          <p className="text-white/80 text-lg md:text-xl mt-4 max-w-xl">
            La solución definitiva para encontrar a los mejores profesionales en la Zona Oriental.
          </p>
        </div>
      </div>
    </section>
  );
}