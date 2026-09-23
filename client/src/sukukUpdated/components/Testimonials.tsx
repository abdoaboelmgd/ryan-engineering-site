import React from 'react';
import { TESTIMONIALS_DATA } from '../data/siteData';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#F7F4EE] border-t border-stone-200/60">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-rkGold/30 text-rkGoldDark text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <span>آراء وتجارب العملاء</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3F1620] mb-4 tracking-tight">
            ماذا يقول عملاؤنا
          </h2>

          <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed">
            ثقة عملائنا وشركاء النجاح هي الأساس الراسخ الذي نبني عليه تميزنا الهندسي المستمر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-stone-200/80 shadow-sm p-8 rounded-3xl rk-card-hover flex flex-col justify-between relative hover:border-rkGold hover:shadow-xl transition-all"
            >
              <Quote className="absolute top-6 left-6 w-8 h-8 text-amber-200/50" />
              <div>
                <div className="flex items-center gap-1 text-rkGold mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-loose text-stone-600 mb-6 italic text-right">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-stone-100 pt-4 text-right">
                <div className="w-12 h-12 rounded-full bg-[#5C2430]/10 text-[#5C2430] border border-rkGold/30 flex items-center justify-center font-bold text-lg shrink-0">
                  {t.initial}
                </div>
                <div>
                  <div className="font-extrabold text-[#3F1620] text-sm sm:text-base">{t.name}</div>
                  <div className="text-xs text-stone-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
