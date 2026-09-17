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
        <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg>
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
