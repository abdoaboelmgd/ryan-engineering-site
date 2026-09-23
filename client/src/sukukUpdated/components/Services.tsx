import React from 'react';
import { SERVICES_DATA, PHONE_NUMBER, WHATSAPP_NUMBER } from '../data/siteData';
import {
  Phone,
  CheckCircle2,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  FileText,
  Layers,
  Boxes,
  FileCheck2,
  FileSearch,
  Users,
  MapPin,
  Landmark,
} from 'lucide-react';

const SERVICE_ICONS: Record<number, React.ReactNode> = {
  1: <FileText className="w-7 h-7 text-[#C9A063]" />,
  2: <Layers className="w-7 h-7 text-[#C9A063]" />,
  3: <Boxes className="w-7 h-7 text-[#C9A063]" />,
  4: <FileCheck2 className="w-7 h-7 text-[#C9A063]" />,
  5: <FileSearch className="w-7 h-7 text-[#C9A063]" />,
  6: <Users className="w-7 h-7 text-[#C9A063]" />,
  7: <MapPin className="w-7 h-7 text-[#C9A063]" />,
  8: <Landmark className="w-7 h-7 text-[#C9A063]" />,
};

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 sm:py-24 bg-gradient-to-b from-[#F7F4EE]/50 via-white to-[#F7F4EE]/30 relative overflow-hidden">
      {/* Background Subtle Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#5C2430 1px, transparent 1px), radial-gradient(#C9A063 1px, #fff 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-rkGold/30 text-rkGoldDark text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-rkGold" />
            <span>خدمات هندسية ومساحية معتمدة لدى الأمانات وكتابة العدل</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3F1620] mb-4 tracking-tight">
            خدماتنا المتخصصة في الصكوك العقارية
          </h2>

          <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed">
            حزمة متكاملة من الحلول المساحية والتوثيقية الاحترافية بأعلى معايير الدقة الهندسية، مصممة لتيسير فرز وتحديث ودمج وتوثيق عقارك بكل يسر.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.map((srv, index) => {
            const formattedIndex = String(index + 1).padStart(2, '0');
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `السلام عليكم ورحمة الله، أرغب في الاستفسار وطلب خدمة: ${srv.title}`
            )}`;

            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between overflow-hidden group hover:border-rkGold"
              >
                {/* Top Accent Gradient on Hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rkGold via-rkGoldLight to-rkGold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Top Meta: Number & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="text-xs font-black tracking-wider text-rkGold bg-amber-50/90 px-2 py-0.5 rounded-md border border-rkGold/20 font-mono">
                      {formattedIndex}
                    </span>
                    {srv.badge && (
                      <span className="text-[11px] font-bold text-[#5C2430] bg-[#5C2430]/5 border border-[#5C2430]/10 px-2.5 py-0.5 rounded-full">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-[#F7F4EE] border border-[#C9A063]/40 text-[#C9A063] group-hover:bg-[#5C2430] transition-all duration-300 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105">
                      {SERVICE_ICONS[srv.id] || <FileText className="w-7 h-7 text-[#C9A063]" />}
                    </div>
                    <h3 className="font-extrabold text-[#3F1620] text-base md:text-lg group-hover:text-[#5C2430] transition-colors leading-snug">
                      {srv.title}
                    </h3>
                  </div>

                  {/* Golden subtle line */}
                  <div className="w-10 h-0.5 bg-gradient-to-r from-rkGold to-transparent mb-3.5"></div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
                    {srv.desc}
                  </p>

                  {/* Feature Bullets */}
                  {srv.features && srv.features.length > 0 && (
                    <div className="mt-auto pt-3 border-t border-stone-100 space-y-2 mb-5">
                      {srv.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A063] shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow bg-[#5C2430] hover:bg-[#3F1620] text-white hover:text-[#C89A52] text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C89A52]" />
                    <span className="text-white font-bold">طلب الخدمة</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                  </a>

                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="w-9 h-9 rounded-xl border border-stone-200 hover:border-rkGold hover:bg-amber-50 text-[#5C2430] hover:text-rkGoldDark flex items-center justify-center transition-colors shrink-0"
                    title={`اتصال هاتفي مباشر بخصوص ${srv.title}`}
                    aria-label={`اتصال بخصوص ${srv.title}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#5C2430]" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Assurance Ribbon */}
        <div className="mt-14 p-6 bg-gradient-to-r from-[#3F1620] via-[#3F1620] to-[#5C2430] rounded-3xl border border-rkGold/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-rkGold/20 border border-rkGold/40 text-rkGold flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-white">
                هل تحتاج إلى استشارة مساحية أو تسعيرة مخصصة لمعاملتك؟
              </h4>
              <p className="text-xs sm:text-sm text-stone-300">
                مهندسونا جاهزون لمراجعة صكك العقاري ومخططاتك وتقديم الرأي الفني مجاناً فوراً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('السلام عليكم، أحتاج استشارة هندسية وفنية بشأن معاملة صك عقاري')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto bg-rkGold hover:bg-rkGoldDark text-[#3F1620] font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              <span>استشارة مجانية فورية</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
