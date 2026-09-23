import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/siteData';

interface ServiceEstimate {
  id: string;
  name: string;
  category: string;
  avgDuration: string;
  reqs: string[];
  stages: string[];
}

const ESTIMATES: ServiceEstimate[] = [
  {
    id: 'sukuk-update',
    name: 'تحديث الصك الورقي لإلكتروني',
    category: 'الصكوك العقارية',
    avgDuration: '2 - 4 أيام عمل',
    reqs: ['صورة الصك الورقي واضحة', 'صورة الهوية الوطنية للمالك أو الوكالة الشرعية', 'موقع العقار (لوكيشن)'],
    stages: ['تدقيق بيانات الصك والمطابقة', 'الرفع المساحي ورفع المعاملة بمنصة بلدي', 'الاعتماد وتوثيق الهوية العقارية في البورصة العقارية'],
  },
  {
    id: 'subdivision',
    name: 'فرز وتجزئة الوحدات أو الأراضي',
    category: 'الفرز والدمج',
    avgDuration: '3 - 7 أيام عمل',
    reqs: ['الصك الإلكتروني المحدث', 'رخصة البناء وشهادة إتمام البناء (للمباني)', 'المخططات المعمارية المعتمدة'],
    stages: ['المعاينة الميدانية ورفع الوحدات', 'إعداد محاضر الفرز ومطابقة الكود السعودي', 'اعتماد محضر الفرز وإصدار الصكوك المستقلة'],
  },
  {
    id: 'survey-decision',
    name: 'الرفع المساحي وقرار الذرعة',
    category: 'المساحة الهندسية',
    avgDuration: '24 - 48 ساعة',
    reqs: ['صك الملكية أو مشهد التملك', 'تحديد موعد المعاينة الميدانية مع المساح'],
    stages: ['رصد الإحداثيات بأجهزة GPS RTK و Total Station', 'إسقاط الكروكي التنظيمي وفق نظام WGS84', 'تصديق قرار الذرعة ورفعه على منصة بلدي'],
  },
  {
    id: 'ehkaam',
    name: 'معاملات منصة إحكام وتثبيت التملك',
    category: 'إحكام واللجان',
    avgDuration: 'حسب لجان النظر',
    reqs: ['وثائق الإحياء القديمة أو الصك', 'بيانات المالك والورثة إن وجد', 'موقع العقار لتصوير الحدود'],
    stages: ['الرفع المساحي التوبوغرافي الدقيق', 'إعداد التقرير الفني والمصور الشامل', 'استكمال منصة إحكام ومتابعة فحص اللجنة'],
  },
  {
    id: 'boundary-overlap',
    name: 'معالجة التداخل وتعديل الأطوال',
    category: 'المنازعات والحدود',
    avgDuration: '3 - 5 أيام عمل',
    reqs: ['صك الملكية', 'مخطط التقسيم أو صكوك المجاورين إن توفرت'],
    stages: ['كشف التداخل بالرصد الإحداثي الدقيق', 'إعداد تقرير فني مساحي للجهة المعنية', 'تصحيح الأطوال واعتماد التعديل الرسمي'],
  },
];

export const SmartCalculator: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>(ESTIMATES[0].id);

  const current = ESTIMATES.find((item) => item.id === selectedService) || ESTIMATES[0];

  const handleWhatsappInquiry = () => {
    const msg = `السلام عليكم، أود الاستفسار عن متطلبات ومدة إنجاز معاملة: ${current.name} (عبر الحاسبة الفورية للموقع).`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="calculator" className="py-20 bg-gradient-to-b from-[#F7F4EE] via-white to-[#F7F4EE] border-t border-stone-200/70">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300/80 text-[#8B6535] text-xs font-black px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A063]" />
            <span>حاسبة المتطلبات والمدة التقديرية الفورية</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3F1620] mb-4 tracking-tight">
            كم تستغرق معاملتك وما هي متطلباتها؟
          </h2>

          <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed">
            حدد نوع المعاملة لمعرفة المدة القياسية المعتادة لإنجازها، والمستندات المطلوبة للبدء الفوري بكل شفافية ووضوح.
          </p>
        </div>

        {/* Interactive Box */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Services Tab Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-2 gap-1.5 bg-stone-100/80 border-b border-stone-200">
            {ESTIMATES.map((item) => {
              const isActive = item.id === selectedService;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedService(item.id)}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                    isActive
                      ? 'bg-[#5C2430] text-white shadow-md'
                      : 'bg-white/70 hover:bg-white text-stone-700 hover:text-[#5C2430]'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isActive ? 'text-[#C89A52]' : 'text-stone-400'}`}>
                    {item.category}
                  </span>
                  <span className="leading-snug line-clamp-1">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Requirements & Process */}
              <div className="lg:col-span-7 space-y-6 text-right">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C9A063] shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#3F1620]">{current.name}</h3>
                    <p className="text-xs sm:text-sm text-stone-500">وفق اشتراطات كتابة العدل ومنصة بلدي</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                  <h4 className="font-extrabold text-sm text-[#3F1620] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>المستندات المطلوبة للبدء:</span>
                  </h4>
                  <ul className="space-y-2">
                    {current.reqs.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A063] mt-2 shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stages */}
                <div>
                  <h4 className="font-extrabold text-sm text-[#3F1620] mb-3 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#C9A063]" />
                    <span>مراحل التنفيذ الفني:</span>
                  </h4>
                  <div className="space-y-2">
                    {current.stages.map((stage, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center gap-3 text-xs sm:text-sm bg-white p-3 rounded-xl border border-stone-200/70"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#5C2430] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <span className="text-stone-800 font-medium">{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Time Estimate & CTA Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#3F1620] via-[#3F1620] to-[#5C2430] p-7 rounded-3xl text-white shadow-xl relative overflow-hidden text-center lg:text-right">
                <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 space-y-6">
                  <div>
                    <span className="text-xs font-bold text-[#C89A52] bg-[#C89A52]/15 px-3 py-1 rounded-full border border-[#C89A52]/30 inline-block mb-3">
                      المدة التقديرية للإنجاز
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center lg:justify-start gap-3">
                      <Clock className="w-8 h-8 text-[#C89A52]" />
                      <span>{current.avgDuration}</span>
                    </div>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                      نلتزم بمتابعة المعاملة لحظة بلحظة حتى صدور الاعتماد وتوثيق الصك الإلكتروني.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="text-xs text-amber-200 flex items-center justify-center lg:justify-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#C89A52]" />
                      <span>ضمان استرداد كامل الأتعاب حال عدم مطابقة المخطط</span>
                    </div>

                    <button
                      onClick={handleWhatsappInquiry}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>ابدأ معاملتك الآن عبر الواتساب</span>
                    </button>

                    <p className="text-[11px] text-stone-400 text-center">
                      استشارة ومراجعة مجانية لأوراقك وصكك قبل التعاقد
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
