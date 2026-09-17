import { sukukAsset } from '../asset';
import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, FileCode, Layers, Terminal } from 'lucide-react';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'react' | 'css'>('html');
  const [htmlCode, setHtmlCode] = useState<string>('جاري تحميل كود الموقع المستخرج...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch(sukukAsset('ryan-sa-sukuk-original.html'))
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.text();
        })
        .then((text) => setHtmlCode(text))
        .catch(() => {
          setHtmlCode('<!-- تعذر تحميل ملف الكود المصدري الأصلي -->');
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const textToCopy = activeTab === 'html' ? htmlCode : activeTab === 'react' ? reactOverviewCode : cssCode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ryan-sa-sukuk.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reactOverviewCode = `// هيكلية تطبيق React لموقع مكتب ريان لتحديث الصكوك
// تم استخراج كافة الأقسام والمكونات والبيانات بدقة تامة:
// - Header: شريط علوي مع الشعار والقائمة وأرقام الاتصال
// - Hero: الواجهة الترحيبية ونموذج الاستشارة الفورية المرتبط بالواتساب
// - WhyUs: ميزات اعتماد المكتب الرسمي والحلول الهندسية
// - Services: 8 خدمات أساسية لتحديث وفرز ودمج الصكوك
// - WorkProcess: 4 مراحل متسلسلة لسير العمل
// - PartnersMarquee: شريط عملائنا وشريط الاعتمادات الرسمية
// - ProjectsGallery: معرض أعمال حقيقي مع صور الرفع المساحي
// - StatsBar: إحصائيات الخبرة والعملاء مع عداد رقمي متحرك
// - Testimonials: تقييمات وآراء العملاء الموثقة
// - FAQ: أسئلة شائعة تفاعلية بنظام الأكورديون
// - ContactSection: نموذج تواصل متكامل وفروع المملكة (الرياض، الدمام، القصيم)
// - FloatingActions: أزرار الواتساب والاتصال العائمة`;

  const cssCode = `/* ألوان وهوية موقع ريان الرسمية المستخرجة من https://ryan-sa.com/ */
:root {
  --rk-maroon: #5C1F2E;        /* عنابي ملكي أساسي (Primary Brand Maroon) */
  --rk-maroon-dark: #3F1620;   /* عنابي داكن */
  --rk-maroon-deep: #2B0F16;   /* عنابي عميق */
  --rk-gold: #C9973C;          /* ذهبي ملكي معتمد (Official Royal Gold) */
  --rk-gold-light: #D8B87E;    /* ذهبي فاتح */
  --rk-gold-dark: #9E7124;     /* ذهبي غامق */
  --rk-bg-cream: #F7F4EE;      /* بيج عاجي دافئ */
  --rk-bg-warm: #E8DFD0;       /* بيج أرضي هادئ */
  --rk-whatsapp: #25D366;
  --rk-text: #2F2F2F;
}

/* خطوط الهوية الرسمية: Alexandria, Cairo, Tajawal */
body {
  font-family: 'Alexandria', 'Cairo', 'Tajawal', sans-serif;
  direction: rtl;
}`;

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0e1720] text-gray-200 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-white/15 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir="ltr"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#14202c] border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-rkGold" />
            <span className="text-white font-bold text-sm">
              Extracted Source Code • ryan-sa.com/sukuk
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition-colors border border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-semibold">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-rkGold hover:bg-rkGoldDark text-[#2B0F16] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              title="تنزيل الملف المستخرج بصيغة HTML جاهز للتشغيل"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل الملف (.html)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors ml-2"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-[#111b26] border-b border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'html'
                ? 'border-rkGold text-rkGold bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>ryan-sa-sukuk.html (Original Source)</span>
          </button>

          <button
            onClick={() => setActiveTab('react')}
            className={`flex items-center gap-2 py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'react'
                ? 'border-rkGold text-rkGold bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>React App Components</span>
          </button>

          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-2 py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'css'
                ? 'border-rkGold text-rkGold bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>Theme & Colors (CSS)</span>
          </button>
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-auto p-4 bg-[#0a1017] font-mono text-xs leading-relaxed select-all">
          <pre className="text-gray-300 whitespace-pre-wrap break-all">
            {activeTab === 'html' && htmlCode}
            {activeTab === 'react' && reactOverviewCode}
            {activeTab === 'css' && cssCode}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-[#14202c] border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
          <span>URL: https://ryan-sa.com/sukuk</span>
          <span className="text-rkGoldLight">جاهز للاستخدام الكامل في أي بيئة ويب أو متصفح</span>
        </div>
      </div>
    </div>
  );
};
