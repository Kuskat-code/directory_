"use client";
import { useEffect, useState } from "react";

interface AnimatedWordProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function AnimatedWord({ words, duration = 1800, className = "" }: AnimatedWordProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeOut = setTimeout(() => setVisible(false), duration - 300);
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      setVisible(true);
    }, duration);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(next);
    };
  }, [index, words, duration]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        minWidth: "4.8rem",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-6px)",
      }}
    >
      {words[index]}
    </span>
  );
}
