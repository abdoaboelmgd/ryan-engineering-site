import React from 'react';
import { WORK_PROCESS_STEPS } from '../data/siteData';

export const WorkProcess: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="section-title text-3xl font-bold text-rkNavy mb-4">
            آلية وإجراءات العمل
          </h2>

          <p className="text-rkMuted text-lg">
            نتبع منهجية واضحة ومبسطة لضمان راحتك من أول تواصل حتى تسليم المشروع
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-10 right-[12%] left-[12%] h-1 bg-gray-200 z-0 border-t border-dashed border-gray-400"></div>

          {WORK_PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-8 text-center border border-gray-100 relative z-10 shadow-sm hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-rkNavy text-rkGold font-bold text-2xl flex items-center justify-center mb-4 ring-4 ring-white shadow-md">
                {item.step}
              </div>
              <h4 className="font-bold text-rkNavy mb-2 text-lg">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
