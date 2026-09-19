import React, { useEffect, useState, useRef } from 'react';
import { STATS_DATA } from '../data/siteData';

export const StatsBar: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(STATS_DATA.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1800;
          const steps = 40;
          const intervalTime = duration / steps;
          let currentStep = 0;

          const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounts(
              STATS_DATA.map((stat) => Math.round(stat.value * progress))
            );

            if (currentStep >= steps) {
              clearInterval(interval);
              setCounts(STATS_DATA.map((stat) => stat.value));
            }
          }, intervalTime);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="rk-stats py-16 bg-[#2B0F16] border-y border-rkGold/20 text-white relative">
      <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
          {STATS_DATA.map((stat, idx) => (
            <div key={idx} className="py-4 md:py-0">
              <div className="text-4xl md:text-5xl font-black text-rkGold mb-2 tracking-tight">
                {stat.prefix || ''}
                {hasAnimated ? counts[idx] : stat.value}
                {stat.suffix || ''}
              </div>
              <div className="text-gray-300 font-medium text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
