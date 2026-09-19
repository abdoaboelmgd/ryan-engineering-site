import React, { useState, useEffect } from 'react';
import { PHONE_NUMBER, PHONE_DISPLAY, WHATSAPP_NUMBER } from '../data/siteData';
import { Phone, MessageCircle } from 'lucide-react';

export const StickyConversionBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after user scrolls down past the hero (280px)
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const defaultWhatsappMsg = encodeURIComponent(
    'السلام عليكم، أرغب في استشارة هندسية سريعة لتحديث أو فرز صك عقاري.'
  );

  return (
    <div
      id="sticky-mobile-conversion-bar"
      className="fixed bottom-0 inset-x-0 z-[95] lg:hidden bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-[0_-8px_25px_rgba(0,0,0,0.15)] py-2.5 px-3 transition-transform duration-300 transform translate-y-0"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Direct Call Button */}
        <a
          href={`tel:${PHONE_NUMBER}`}
          id="sticky-call-btn"
          className="flex-1 bg-[#C9973C] hover:bg-[#B8860B] active:scale-95 text-[#2B0F16] font-extrabold text-xs sm:text-sm py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-amber-300 transition-all text-center"
        >
          <Phone className="w-4 h-4 text-[#2B0F16] shrink-0" />
          <span>اتصال مباشر</span>
        </a>

        {/* WhatsApp Direct Consultation */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${defaultWhatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          id="sticky-whatsapp-btn"
          className="flex-[1.4] bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-extrabold text-xs sm:text-sm py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all text-center"
        >
          <MessageCircle className="w-4 h-4 text-white shrink-0 fill-current" />
          <span>واتساب فوري</span>
        </a>
      </div>
    </div>
  );
};
