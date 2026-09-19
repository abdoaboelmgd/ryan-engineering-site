import React from 'react';
import { Phone, MessageCircle, ArrowUpRight, FileText, Layers, Boxes, FileCheck2, FileSignature, ArrowRightLeft, DraftingCompass, Stamp } from 'lucide-react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../data/siteData';
import { ServiceItem } from '../types';

const SERVICE_ICONS = [FileText, Layers, Boxes, FileCheck2, FileSignature, ArrowRightLeft, DraftingCompass, Stamp];
export interface ServicesConfig { title?: string; description?: string; items?: ServiceItem[]; }

export const Services: React.FC<{ config?: ServicesConfig }> = ({ config }) => {
  const defaultItems: ServiceItem[] = [
    { id: 1, title: 'تحديث الصك', icon: 'fa-file-contract', desc: 'تحديث الصكوك العقارية القديمة وتحويلها إلى صكوك إلكترونية معتمدة.' },
    { id: 2, title: 'فرز الصكوك', icon: 'fa-layer-group', desc: 'فرز وتجزئة الصكوك العقارية إلى قطع أو وحدات مستقلة معتمدة.' },
    { id: 3, title: 'دمج الصكوك', icon: 'fa-object-group', desc: 'دمج عدة صكوك متجاورة في صك عقاري واحد موحد.' },
    { id: 4, title: 'تصحيح بيانات الصك', icon: 'fa-clipboard-check', desc: 'تصحيح المساحة والحدود وبيانات المالك في الصك العقاري.' },
    { id: 5, title: 'استخراج صك بديل', icon: 'fa-file-signature', desc: 'استخراج صك بديل لصك تالف أو مفقود بإجراءات نظامية سريعة.' },
    { id: 6, title: 'نقل ملكية الصك', icon: 'fa-exchange-alt', desc: 'إتمام إجراءات نقل ملكية الصكوك بين الأطراف أو الورثة بسلاسة.' },
    { id: 7, title: 'تحديث المخطط الهندسي للصك', icon: 'fa-draw-polygon', desc: 'مطابقة وتحديث المخطط الهندسي المرفق بالصك مع الواقع الفعلي.' },
    { id: 8, title: 'متابعة معاملات كتابة العدل', icon: 'fa-stamp', desc: 'متابعة كامل إجراءات المعاملة لدى كتابة العدل حتى الاعتماد النهائي.' },
  ];
  const items = config?.items || defaultItems;
  return <section id="services" className="py-20 bg-white">
    <div className="container mx-auto px-2 md:px-4 lg:max-w-7xl">
      <div className="text-center mb-16"><h2 className="section-title text-3xl md:text-4xl font-bold text-rkNavy mb-4">{config?.title || 'خدماتنا المتخصصة في تحديث الصكوك'}</h2><p className="text-rkMuted text-lg">{config?.description || 'باقة متكاملة من خدمات تحديث وتوثيق الصكوك العقارية لتلبية كافة احتياجاتك'}</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {items.map((srv, index) => { const Icon = SERVICE_ICONS[index] || FileText; const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`أرغب بالاستفسار عن خدمة: ${srv.title}`)}`; return <div key={srv.id} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden rk-card-hover rk-reveal flex flex-col group relative"><div className="p-4 md:p-6 flex-grow text-center flex flex-col items-center justify-start relative z-10"><div className="w-14 h-14 md:w-16 md:h-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-rkGoldDark text-2xl md:text-3xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"><Icon className="w-7 h-7 md:w-8 md:h-8" /></div><h4 className="font-bold text-rkNavy mb-2 text-sm md:text-lg">{srv.title}</h4><p className="text-xs md:text-sm text-gray-500 leading-relaxed">{srv.desc}</p></div><div className="grid grid-cols-2 gap-px bg-gray-200 border-t border-gray-200 mt-auto"><a href={`tel:${PHONE_NUMBER}`} className="bg-white hover:bg-gray-50 py-3 text-rkNavy font-bold text-xs md:text-sm flex flex-col items-center justify-center gap-1 transition-colors" title="اتصال"><Phone className="w-4 h-4 text-rkGoldDark"/><span>اتصال</span></a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="bg-white hover:bg-[#e8fceb] py-3 text-[#0b3d23] font-bold text-xs md:text-sm flex flex-col items-center justify-center gap-1 transition-colors" title="تواصل واتساب"><MessageCircle className="w-5 h-5 text-[#25D366]"/><span>واتساب</span></a></div></div>; })}
      </div>
      <div className="text-center mt-12"><a href="#contact" className="inline-flex items-center gap-2 bg-rkNavy text-white hover:bg-rkNavyDeep font-bold py-3 px-8 rounded-xl transition-colors shadow-md text-lg"><span>اطلب تسعيرة لمشروعك</span><ArrowUpRight className="w-5 h-5"/></a></div>
    </div>
  </section>;
};
