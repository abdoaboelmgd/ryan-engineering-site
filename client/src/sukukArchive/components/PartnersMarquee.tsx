import { sukukAsset } from '../asset';
import React from 'react';
import { CLIENT_LOGOS, ACCREDITED_LOGOS } from '../data/siteData';

export const PartnersMarquee: React.FC = () => {
  return (
    <section id="partners" className="py-20 bg-[#F7F4EE]">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        {/* Section 1: Our Clients */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-rkNavy mb-4">عملائنا</h2>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-sm md:text-base">
            في مكتب ريان للمساحة، نعتز بثقة عملائنا من مختلف القطاعات الحكومية والخاصة والأفراد، ممن
            اختارونا لتنفيذ مشاريعهم المساحية والهندسية. تشمل قاعدة عملائنا شركات وطنية كبرى، وجهات
            حكومية، وهيئات تطوير، ومطورين عقاريين، مما يعكس التزامنا بالاحترافية والدقة في كل مشروع ننفذه.
          </p>
          <p className="text-rkGoldDark font-bold mt-4 text-base">ومن بين عملائنا:</p>
        </div>

        {/* Client Logos Marquee */}
        <div className="marquee-wrapper mb-20">
          <div className="marquee-content">
            {/* First Set */}
            {CLIENT_LOGOS.map((logo, idx) => (
              <div key={`client-1-${idx}`} className="partner-logo">
                <img
                  src={sukukAsset(logo)}
                  alt="شعار عميل"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
              </div>
            ))}
            {/* Duplicate Set for Infinite Seamless Loop */}
            {CLIENT_LOGOS.map((logo, idx) => (
              <div key={`client-2-${idx}`} className="partner-logo">
                <img
                  src={sukukAsset(logo)}
                  alt="شعار عميل"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Accreditations */}
        <div className="text-center mb-10 pt-4 border-t border-[#5C1F2E]/15">
          <h2 className="text-3xl md:text-4xl font-black text-rkNavy mb-4">معتمدون لدى</h2>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-sm md:text-base">
            نحن فخورون بكوننا مكتباً هندسياً ومساحياً معتمداً ومؤهلاً لدى نخبة من أهم الهيئات والجهات
            الحكومية والرقابية في المملكة العربية السعودية:
          </p>
        </div>

        {/* Accredited Logos Marquee */}
        <div className="marquee-wrapper">
          <div className="marquee-content" style={{ animationDuration: '30s' }}>
            {ACCREDITED_LOGOS.concat(ACCREDITED_LOGOS).concat(ACCREDITED_LOGOS).map((logo, idx) => (
              <div key={`accred-${idx}`} className="accredited-logo bg-white shadow-xs">
                <img
                  src={sukukAsset(logo)}
                  alt="اعتماد رسمي"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
