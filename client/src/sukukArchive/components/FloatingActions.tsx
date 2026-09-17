import React from 'react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../data/siteData';
import { Phone } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  return (
    <div
      className="fixed bottom-6 left-6 z-[99] flex flex-col gap-3 items-center"
      id="floating-actions"
    >
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-3xl shadow-xl pulse-wa transition-transform hover:scale-110"
        aria-label="تواصل عبر الواتساب"
        title="تواصل معنا عبر الواتساب"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Direct Phone Call Button */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="w-12 h-12 bg-rkGold text-[#2B0F16] rounded-full flex items-center justify-center text-xl shadow-xl transition-transform hover:scale-110 border border-amber-200"
        aria-label="اتصال هاتفي مباشر"
        title="اتصال هاتفي مباشر"
      >
        <Phone className="w-5 h-5 fill-current" />
      </a>
    </div>
  );
};
