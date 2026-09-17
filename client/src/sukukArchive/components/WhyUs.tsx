import React from 'react';
import { ShieldCheck, Compass, Satellite } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const reasons = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-rkGold" />,
      title: 'اعتماد رسمي موثوق',
      desc: 'معتمدون لدى البلديات ووزارة الشؤون البلدية والقروية والإسكان، منصة بلدي، منصة إحكام، وكافة كتابات العدل لضمان سلامة معاملاتك.',
    },
    {
      icon: <Compass className="w-8 h-8 text-rkGold" />,
      title: 'حلول هندسية متكاملة',
      desc: 'فريق متكامل من مهندسين ومساحين مرخصين ومصنفين يضمنون لك إنجاز كافة معاملات الصكوك والمخططات بدقة وسرعة متناهية.',
    },
    {
      icon: <Satellite className="w-8 h-8 text-rkGold" />,
      title: 'أحدث التقنيات المساحية',
      desc: 'نستخدم أحدث أجهزة GPS والمحطات الشاملة (Total Station) لتقديم تقارير مساحية دقيقة معتمدة وخالية تماماً من الأخطاء.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-24 bg-[#F7F4EE] border-t border-stone-200/60">
      <div className="container mx-auto px-4 lg:max-w-7xl text-center">
        <div className="max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-rkGold/30 text-rkGoldDark text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-rkGold" />
            <span>الموثوقية والخبرة الهندسية في المملكة</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B0F16] mb-4 tracking-tight">
            لماذا تختار مكتب ريان لتحديث الصكوك؟
          </h2>

          <p className="text-stone-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            شريكك الهندسي والمساحي المعتمد. نجمع بين الدقة الميدانية المتناهية، والاعتماد الرسمي، والإنجاز السريع لتيسير كافة معاملاتك العقارية بأمان تام.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-right">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-stone-200/80 rk-card-hover shadow-sm hover:shadow-xl hover:border-rkGold transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-[#5C1F2E] rounded-2xl flex items-center justify-center mb-6 shadow-md border border-rkGold/30 text-rkGold">
                  {item.icon}
                </div>
                <h4 className="text-xl font-extrabold text-[#2B0F16] mb-3">{item.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-rkGoldDark">
                <span>خدمة معتمدة وفورية</span>
                <span className="text-stone-300">•</span>
                <span>فريق مرخص</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
