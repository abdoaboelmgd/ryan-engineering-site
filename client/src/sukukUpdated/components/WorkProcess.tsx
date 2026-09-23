import React from 'react';
import { WORK_PROCESS_STEPS } from '../data/siteData';

export const WorkProcess: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#F7F4EE] border-t border-stone-200/60">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-rkGold/30 text-rkGoldDark text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <span>خطوات العمل المعتمدة</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3F1620] mb-4 tracking-tight">
            آلية وإجراءات العمل
          </h2>

          <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed">
            نتبع منهجية هندسية واضحة ومبسطة لضمان راحتك وسرعة إنجاز معاملتك من أول تواصل حتى اعتماد الصك.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-14 right-[12%] left-[12%] h-0.5 bg-[#C9A063]/40 z-0 border-t border-dashed border-[#C9A063]"></div>

          {WORK_PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-8 text-center border border-stone-200/80 relative z-10 shadow-sm hover:-translate-y-2 transition-all duration-300 flex flex-col items-center hover:border-rkGold hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-full bg-[#5C2430] text-rkGold font-black text-2xl flex items-center justify-center mb-4 ring-4 ring-amber-50 shadow-md border border-rkGold/30">
                {item.step}
              </div>
              <h4 className="font-extrabold text-[#3F1620] mb-2 text-lg">{item.title}</h4>
              <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
