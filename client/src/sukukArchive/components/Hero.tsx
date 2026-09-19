import React, { useState } from 'react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../data/siteData';
import { Phone, CheckCircle2, ShieldCheck, Award, Zap, Send } from 'lucide-react';

export interface HeroConfig {
  eyebrow?: string;
  headline?: string;
  highlightedHeadline?: string;
  description?: string;
  defaultService?: string;
  choices?: string[];
  formTitle?: string;
  ctaLabel?: string;
  whatsappMessage?: string;
}

export const Hero: React.FC<{ config?: HeroConfig }> = ({ config }) => {
  const [fastName, setFastName] = useState('');
  const [fastPhone, setFastPhone] = useState('');
  const [fastService, setFastService] = useState(config?.defaultService || 'تحديث الصك');

  const handleFastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastName.trim() || !fastPhone.trim()) return;

    const msg =
      `${config?.formTitle || 'طلب استشارة سريعة'}\n` +
      `------------------\n` +
      `الاسم: ${fastName.trim()}\n` +
      `الجوال: ${fastPhone.trim()}\n` +
      `الخدمة المطلوبة: ${fastService}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(config?.whatsappMessage ? `${config.whatsappMessage}\n\n${msg}` : msg)}`, '_blank');
  };

  return (
    <section id="home" className="rk-hero min-h-[92vh] flex flex-col justify-center pt-28 pb-16 relative">
      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Text Content */}
          <div className="lg:col-span-7 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-rkGold/20 text-rkGold px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-6 border border-rkGold/40 backdrop-blur-sm shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-rkGold shrink-0" />
              <span>{config?.eyebrow || 'مكتب معتمد رسمياً لتحديث الصكوك'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black text-white leading-[1.25] sm:leading-[1.2] mb-6 tracking-tight">
              {config?.headline || 'أفضل مكتب لتحديث الصكوك'} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#F2C230] via-rkGold to-[#F7D97A] drop-shadow-sm">
                {config?.highlightedHeadline || 'معتمد بالرياض والمملكة'}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-stone-200 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              {config?.description || 'مكتب ريان لتحديث الصكوك العقارية — نجمع بين الدقة المتناهية والخبرة العميقة في تحديث، فرز، ودمج الصكوك العقارية وتوثيقها إلكترونياً.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('السلام عليكم، أرغب في استشارة هندسية لتحديث صك عقاري')}`}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-cta"
                className="w-full sm:w-auto rk-btn bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2.5 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg>
                <span>استشارة عبر الواتساب</span>
              </a>

              <a
                href={`tel:${PHONE_NUMBER}`}
                id="hero-call-cta"
                className="w-full sm:w-auto bg-[#C9973C] hover:bg-[#B8860B] text-[#2B0F16] font-extrabold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2.5 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all border border-amber-200"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>اتصل بنا الآن</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 bg-white/[0.05] p-3 rounded-2xl border border-white/10 text-right backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-rkGold/20 border border-rkGold/30 flex items-center justify-center text-rkGold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">اعتماد رسمي</h4>
                  <p className="text-stone-300 text-xs">منصات بلدي وإحكام</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/[0.05] p-3 rounded-2xl border border-white/10 text-right backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-rkGold/20 border border-rkGold/30 flex items-center justify-center text-rkGold shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">خبرة 15+ سنة</h4>
                  <p className="text-stone-300 text-xs">كوادر هندسية ومساحية</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/[0.05] p-3 rounded-2xl border border-white/10 text-right backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-rkGold/20 border border-rkGold/30 flex items-center justify-center text-rkGold shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">إنجاز فوري</h4>
                  <p className="text-stone-300 text-xs">توثيق إلكتروني سريع</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fast Contact Form Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-t-4 border-rkGold relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-[#2B0F16] mb-1.5">{config?.formTitle || 'طلب استشارة سريعة'}</h3>
                <p className="text-xs sm:text-sm text-stone-500">املأ بياناتك وسيتم تحويلك مباشرة للواتساب</p>
              </div>

              <form onSubmit={handleFastSubmit} className="space-y-4" id="hero-fast-form">
                <div>
                  <label className="block text-sm font-bold text-[#2B0F16] mb-1.5 text-right">
                    الاسم الكريم <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="rk-fast-name"
                    required
                    value={fastName}
                    onChange={(e) => setFastName(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-rkGold focus:ring-1 focus:ring-rkGold transition-colors text-right text-stone-800 text-sm"
                    placeholder="أدخل اسمك هنا"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2B0F16] mb-1.5 text-right">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="rk-fast-phone"
                    required
                    dir="ltr"
                    value={fastPhone}
                    onChange={(e) => setFastPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-rkGold focus:ring-1 focus:ring-rkGold transition-colors text-right text-stone-800 text-sm"
                    placeholder="05x xxx xxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2B0F16] mb-1.5 text-right">
                    الخدمة المطلوبة
                  </label>
                  <select
                    id="rk-fast-service"
                    value={fastService}
                    onChange={(e) => setFastService(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-rkGold focus:ring-1 focus:ring-rkGold transition-colors cursor-pointer text-right text-stone-800 text-sm"
                  >
                    {(config?.choices || ['استفسار عام','تحديث الصك','فرز الصكوك العقارية','دمج الصكوك','استخراج صك بديل (تالف/مفقود)','نقل ملكية الصك']).map(choice => <option key={choice} value={choice}>{choice}</option>)}
                  </select>
                </div>

                <button
                  type="submit"
                  id="hero-submit-btn"
                  className="w-full bg-[#5C1F2E] hover:bg-[#3F1620] text-white hover:text-[#FEB922] font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2 border border-[#C9973C]/40 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#25D366]" />
                  <span className="text-white font-bold">إرسال الطلب</span>
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
