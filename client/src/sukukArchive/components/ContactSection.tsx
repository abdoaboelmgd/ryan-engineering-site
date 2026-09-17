import React, { useState } from 'react';
import { PHONE_NUMBER, PHONE_DISPLAY, WHATSAPP_NUMBER, BRANCHES_DATA } from '../data/siteData';
import { Phone, MapPin, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('تحديث صك قديم إلى إلكتروني');
  const [details, setDetails] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    let msg =
      `طلب خدمة من الموقع\n` +
      `------------------\n` +
      `الاسم: ${name.trim()}\n` +
      `الجوال: ${phone.trim()}\n` +
      `نوع الخدمة: ${service}\n`;

    if (details.trim()) {
      msg += `التفاصيل: ${details.trim()}\n`;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#3F1620] via-[#5C1F2E] to-[#2B0F16] text-white relative overflow-hidden border-t border-rkGold/20">
      <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            تواصل معنا الآن
          </h2>
          <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto">
            إذا كنت تريد طلب معاينة أو لديك أي استفسار حول خدماتنا، يسعدنا تواصلك معنا لتقديم الدعم الكامل.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Detailed Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-right border-t-4 border-rkGold">
            <h3 className="text-2xl font-bold text-[#5C1F2E] mb-4">
              طلب خدمة أو استفسار
            </h3>
            <div className="w-16 h-1 bg-rkGold rounded-full mb-8"></div>

            <form onSubmit={handleContactSubmit} className="space-y-4 text-gray-800">
              <div>
                <label className="block text-sm font-bold text-rkNavy mb-1.5">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rkGold focus:ring-1 focus:ring-rkGold transition-colors text-right"
                  placeholder="أدخل اسمك الكريم"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-rkNavy mb-1.5">
                  رقم الجوال <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rkGold focus:ring-1 focus:ring-rkGold transition-colors text-right"
                  placeholder="05x xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-rkNavy mb-1.5">
                  نوع الخدمة المطلوبة
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rkGold focus:ring-1 focus:ring-rkGold transition-colors cursor-pointer text-right"
                >
                  <option value="تحديث صك قديم إلى إلكتروني">تحديث صك قديم إلى إلكتروني</option>
                  <option value="فرز وتجزئة صكوك">فرز وتجزئة صكوك عقارية</option>
                  <option value="دمج صكوك عقارية">دمج صكوك عقارية متجاورة</option>
                  <option value="استخراج صك بديل عن تالف أو مفقود">استخراج صك بديل عن تالف أو مفقود</option>
                  <option value="تصحيح بيانات أو حدود صك">تصحيح بيانات أو حدود صك</option>
                  <option value="رفع مساحي وإعداد مخطط كروكي">رفع مساحي وإعداد مخطط كروكي معتمد</option>
                  <option value="استشارة عامة">استشارة هندسية عامة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-rkNavy mb-1.5">
                  تفاصيل المعاملة أو العقار (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rkGold focus:ring-1 focus:ring-rkGold transition-colors text-right resize-none text-sm"
                  placeholder="اكتب هنا أي تفاصيل مساندة مثل الموقع، المساحة، أو رقم المعاملة..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5C1F2E] hover:bg-[#3F1620] text-rkGold font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mt-4 border border-rkGold/30"
              >
                <Send className="w-5 h-5" />
                <span>إرسال الطلب عبر الواتساب</span>
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-right">
            {/* Direct Phone Card */}
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-[#2B0F16] hover:bg-[#3F1620] p-6 rounded-3xl border border-rkGold/30 flex items-center justify-between transition-all group shadow-xl"
            >
              <div className="w-14 h-14 bg-rkGold text-[#2B0F16] rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <Phone className="w-6 h-6 fill-current" />
              </div>
              <div className="text-right">
                <div className="text-gray-300 text-xs sm:text-sm mb-1">اتصال هاتفي مباشر</div>
                <div className="text-xl sm:text-2xl font-black text-white" dir="ltr">
                  {PHONE_DISPLAY}
                </div>
              </div>
            </a>

            {/* Direct WhatsApp Card */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2B0F16] hover:bg-[#3F1620] p-6 rounded-3xl border border-rkGold/30 flex items-center justify-between transition-all group shadow-xl"
            >
              <div className="w-14 h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <i className="fab fa-whatsapp"></i>
              </div>
              <div className="text-right">
                <div className="text-gray-300 text-xs sm:text-sm mb-1">محادثة فورية عبر الواتساب</div>
                <div className="text-xl sm:text-2xl font-black text-rkGold" dir="ltr">
                  {PHONE_DISPLAY}
                </div>
              </div>
            </a>

            {/* Branches Card */}
            <div className="bg-[#2B0F16] p-6 sm:p-8 rounded-3xl border border-rkGold/30 shadow-xl flex-grow flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 text-rkGold">
                <MapPin className="w-6 h-6" />
                <h4 className="text-lg font-bold text-white">فروعنا بالمملكة</h4>
              </div>

              <ul className="space-y-4 text-sm leading-relaxed text-gray-200">
                {BRANCHES_DATA.map((branch, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rkGold font-black text-lg leading-none mt-0.5">•</span>
                    <div>
                      <strong className="text-white font-bold ml-1">{branch.city}:</strong>
                      <span className="text-gray-300">{branch.address}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>ساعات العمل: السبت - الخميس</span>
                <span className="text-rkGold font-semibold">8:00 ص - 9:00 م</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
