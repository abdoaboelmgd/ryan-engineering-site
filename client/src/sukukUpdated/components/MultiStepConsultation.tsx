import React, { useState } from 'react';
import { Send, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '../data/siteData';

export const MultiStepConsultation: React.FC = () => {
  const [propertyType, setPropertyType] = useState('سكني (فيلا / شقة)');
  const [serviceType, setServiceType] = useState('تحديث صك ورقي إلى إلكتروني');
  const [city, setCity] = useState('الرياض');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    const message =
      `طلب استشارة هندسية سريعة\n` +
      `-------------------------\n` +
      `👤 الاسم: ${fullName.trim() || 'عميل كريم'}\n` +
      `📱 رقم الجوال: ${phone.trim()}\n` +
      `🏢 نوع العقار: ${propertyType}\n` +
      `📋 الخدمة المطلوبة: ${serviceType}\n` +
      `📍 المدينة: ${city}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border-t-4 border-[#C9973C] relative">
      {/* Form Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-[#9E7124] border border-[#C9973C]/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9973C]" />
          <span>استشارة مجانية • تسعيرة فورية</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#2B0F16]">
          طلب دراسة واستشارة سريعة
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          حدد تفاصيل عقارك وسيتم التواصل معك مباشرة عبر الواتساب
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        {/* 1. نوع العقار */}
        <div>
          <label className="block text-xs font-extrabold text-[#2B0F16] mb-1.5">
            1. نوع العقار
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['سكني (فيلا / شقة)', 'أرض فضاء / خام', 'تجاري / استثماري'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPropertyType(item)}
                className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer text-center leading-tight ${
                  propertyType === item
                    ? 'bg-amber-50 border-[#C9973C] text-[#5C1F2E] shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 2. الإجراء والخدمة المطلوبة + المدينة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-extrabold text-[#2B0F16] mb-1.5">
              2. الإجراء المطلوب
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs font-medium focus:border-[#C9973C] focus:outline-none"
            >
              <option value="تحديث صك ورقي إلى إلكتروني">تحديث صك ورقي إلى إلكتروني</option>
              <option value="فرز وتجزئة وحدات أو فلل">فرز وتجزئة وحدات أو فلل</option>
              <option value="دمج صكوك عقارية متجاورة">دمج صكوك عقارية متجاورة</option>
              <option value="رفع مساحي وقرار ذرعة">رفع مساحي وقرار ذرعة</option>
              <option value="منصة إحكام وتثبيت التملك">منصة إحكام وتثبيت التملك</option>
              <option value="تصحيح حدود وأطوال ومساحة">تصحيح حدود وأطوال ومساحة</option>
              <option value="استخراج صك بدل فاقد أو تالف">استخراج بدل فاقد أو تالف</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#2B0F16] mb-1.5">
              المدينة / المنطقة
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs font-medium focus:border-[#C9973C] focus:outline-none"
            >
              <option value="الرياض">الرياض</option>
              <option value="المنطقة الشرقية">المنطقة الشرقية</option>
              <option value="جدة ومكة المكرمة">جدة ومكة المكرمة</option>
              <option value="القصيم">القصيم</option>
              <option value="المدينة المنورة">المدينة المنورة</option>
              <option value="باقي مدن المملكة">باقي مدن المملكة</option>
            </select>
          </div>
        </div>

        {/* 3. بيانات الاتصال السريعة */}
        <div className="pt-1 border-t border-stone-100">
          <label className="block text-xs font-extrabold text-[#2B0F16] mb-1.5">
            3. بيانات التواصل السريع
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-[#C9973C] focus:outline-none"
                placeholder="الاسم الكريم (اختياري)"
              />
            </div>
            <div>
              <input
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs text-right focus:border-[#C9973C] focus:outline-none"
                placeholder="رقم الجوال (05x xxx xxxx) *"
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-black py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg transition-all cursor-pointer mt-2"
        >
          <Send className="w-4 h-4" />
          <span>إرسال الطلب والاستشارة فوراً عبر الواتساب</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>بياناتك سرية ومحمية 100%</span>
          </span>
          <span className="text-stone-400">رد فوري خلال دقائق</span>
        </div>
      </form>
    </div>
  );
};
