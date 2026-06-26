'use client';

import { useState } from 'react';

const videos = [
  '/videos/consultorio.mp4',
  '/videos/doctor_writting.mp4',
  '/videos/escritorio.mp4',
];

export default function VideoSequence() {
  const [current, setCurrent] = useState(0);

  const handleEnded = () => {
    setCurrent((prev) => (prev + 1) % videos.length);
  };

  return (
    <video
      key={videos[current]}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={videos[current]} type="video/mp4" />
    </video>
  );
}
