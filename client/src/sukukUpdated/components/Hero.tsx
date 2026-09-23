import React from 'react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../data/siteData';
import { Phone, CheckCircle2, ShieldCheck, Award, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-[92vh] flex flex-col justify-center pt-28 pb-16 relative overflow-hidden bg-[#fef3c7]">
      {/* خلفية لونية هادئة وعميقة تحافظ على وضوح النص والنموذج */}
      <div
        className="sukuk-hero-surface absolute inset-0 z-0"
        aria-hidden="true"
      />

      {/* 
        2. المحتوى الأمامي ونموذج الاستشارة
      */}
      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Text Content */}
          <div className="text-center">
            {/* Trust and License Badges Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 bg-neutral-900/80 text-[#FEB922] px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-400/30 backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FEB922] shrink-0" />
                <span>مكتب استشارات هندسية ومساحية مرخص</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-neutral-900/80 text-stone-200 px-3 py-1.5 rounded-full text-xs font-medium border border-white/15 backdrop-blur-md shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>اعتماد بلدي • إحكام • كتابة العدل</span>
              </div>


            </div>

            {/* Heading Container with Crystal-Clear Translucent Burgundy Backdrop */}
            <div className="bg-gradient-to-l from-[#3F1620]/28 via-[#2B0F16]/18 to-[#3F1620]/10 backdrop-blur-[2.5px] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#C9973C]/25 shadow-xl mb-3.5 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[2.9rem] font-black text-white leading-[1.3] sm:leading-[1.25] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_6px_20px_rgba(43,15,22,0.95)] m-0">
                أفضل مكتب معتمد في المملكة <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#F2C230] via-[#FEB922] to-[#F7D97A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  لتحديث الصكوك
                </span>
              </h1>
            </div>

            {/* Subtitle Container with Crystal-Clear Translucent Burgundy Backdrop */}
            <div className="bg-gradient-to-l from-[#3F1620]/22 via-[#2B0F16]/14 to-[#3F1620]/08 backdrop-blur-[2px] rounded-2xl p-3.5 sm:p-4.5 border border-[#C9973C]/20 shadow-lg mb-8 max-w-2xl mx-auto">
              <p className="text-center text-sm sm:text-base md:text-lg text-white leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] m-0">
                مكتب ريان للمساحة والاستشارات الهندسية — نجمع بين دقة الرصد الميداني والخبرة النظامية الشاملة في تحديث،
                فرز، دمج، وتوثيق الصكوك العقارية إلكترونياً بأعلى معايير الاعتماد والسرعة.
              </p>
            </div>

            {/* Direct High-Converting CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('السلام عليكم، أرغب في استشارة هندسية سريعة لتحديث صك عقاري (حملة إعلانية)')}`}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-cta"
                className="w-full sm:w-auto rk-btn bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2.5 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <svg className="w-6 h-6 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>استشارة فورية عبر الواتساب</span>
              </a>

              <a
                href={`tel:${PHONE_NUMBER}`}
                id="hero-call-cta"
                className="w-full sm:w-auto rk-btn rk-btn-call bg-[#C9973C] hover:bg-[#B8860B] text-[#2B0F16] font-extrabold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2.5 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all border border-amber-200"
              >
                <Phone className="w-5 h-5 fill-current text-[#2B0F16]" />
                <span className="text-[#2B0F16]">اتصل بنا الآن</span>
              </a>
            </div>

            {/* Trust Pillars */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-8 border-t border-neutral-800/60">
              <div className="flex items-center gap-3 bg-neutral-900/80 p-3 rounded-2xl border border-white/10 text-right backdrop-blur-md shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#C9973C]/25 border border-[#C9973C]/40 flex items-center justify-center text-[#FEB922] shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#FEB922]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">اعتماد رسمي</h4>
                  <p className="text-stone-300 text-xs">منصات بلدي وإحكام</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-neutral-900/80 p-3 rounded-2xl border border-white/10 text-right backdrop-blur-md shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#C9973C]/25 border border-[#C9973C]/40 flex items-center justify-center text-[#FEB922] shrink-0">
                  <Award className="w-5 h-5 text-[#FEB922]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">خبرة 15+ سنة</h4>
                  <p className="text-stone-300 text-xs">كوادر هندسية ومساحية</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-neutral-900/80 p-3 rounded-2xl border border-white/10 text-right backdrop-blur-md shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#C9973C]/25 border border-[#C9973C]/40 flex items-center justify-center text-[#FEB922] shrink-0">
                  <Zap className="w-5 h-5 text-[#FEB922]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">إنجاز قياسي</h4>
                  <p className="text-stone-300 text-xs">توثيق إلكتروني سريع</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
