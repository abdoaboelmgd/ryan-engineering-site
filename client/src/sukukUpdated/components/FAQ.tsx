import React, { useState } from 'react';
import { FAQ_DATA } from '../data/siteData';
import { Plus, Minus } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-white border-t border-stone-200/60">
      <div className="container mx-auto px-4 lg:max-w-3xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-rkGold/30 text-rkGoldDark text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <span>إجابات واضحة ومباشرة</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3F1620] mb-4 tracking-tight">
            الأسئلة الأكثر شيوعاً
          </h2>

          <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed">
            إجابات شاملة لأهم التساؤلات والاستفسارات المتعلقة بتحديث وفرز الصكوك العقارية وإجراءات الرفع المساحي.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-rkGold/50"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full p-5 font-bold text-[#3F1620] text-right flex justify-between items-center gap-4 hover:bg-stone-100/70 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{item.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-rkGold text-[#3F1620]' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 bg-white text-right border-t border-stone-100">
                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
