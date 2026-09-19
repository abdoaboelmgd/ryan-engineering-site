import React from 'react';
import { ShieldCheck, Compass, Satellite } from 'lucide-react';

export interface WhyUsConfig {
  title?: string;
  description?: string;
  reasons?: { title: string; desc: string }[];
}

export const WhyUs: React.FC<{ config?: WhyUsConfig }> = ({ config }) => {
  const defaultReasons = [
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
  const reasons = config?.reasons?.map((reason, index) => ({ ...reason, icon: defaultReasons[index % defaultReasons.length].icon })) || defaultReasons;

  return (
        <section id="about" className="py-16 bg-[#F4F2EC]">
      <div className="container mx-auto px-4 lg:max-w-7xl text-center">
        <div className="max-w-3xl mx-auto mb-14">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-rkNavy mb-4">
            {config?.title || 'لماذا تختار مكتب ريان الهندسي؟'}
          </h2>

          <p className="text-rkMuted mb-12 max-w-2xl mx-auto text-lg">
            {config?.description || 'شريكك الموثوق لجميع خدماتك الهندسية والمساحية. نجمع بين الدقة العالية، الاعتماد الرسمي، والإنجاز السريع لتسهيل مشاريعك.'}
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-gray-100 rk-card-hover shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-rkNavy text-rkGold rounded-xl flex items-center justify-center font-bold text-2xl mb-6 shadow-md">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-rkNavy mb-3">{item.title}</h4>
                <p className="text-rkMuted text-sm leading-relaxed">{item.desc}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
