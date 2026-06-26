import VideoSequence from '@/src/components/VideoSequence';

interface PhoneMockupProps {
  className?: string;
}

export function PhoneMockup({ className = '' }: PhoneMockupProps) {
  return (
    <div
      className={[
        'relative mx-auto h-[480px] w-[240px] rotate-3 overflow-hidden rounded-[40px] border-[7px] border-gray-800 bg-black shadow-2xl sm:h-[520px] sm:w-[260px] sm:rounded-[42px] md:h-[560px] md:w-[280px] md:rounded-[44px] md:border-8',
        className,
      ].join(' ')}
      aria-hidden="true"
    >
      <div className="absolute top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-gray-900 md:h-6 md:w-24" />

      <VideoSequence />
    </div>
  );
}
