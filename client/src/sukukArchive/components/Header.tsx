import { sukukAsset } from '../asset';
import React, { useState, useEffect } from 'react';
import { PHONE_DISPLAY, PHONE_NUMBER } from '../data/siteData';
import { Code2, Phone, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenCodeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCodeModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '#home' },
    { label: 'لماذا نحن', href: '#about' },
    { label: 'خدماتنا', href: '#services' },
    { label: 'عملائنا', href: '#partners' },
    { label: 'أعمالنا', href: '#projects' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#3F1620]/95 backdrop-blur-md py-2.5 shadow-xl border-b border-rkGold/20'
          : 'bg-[#5C1F2E]/95 backdrop-blur-sm py-4 border-b border-rkGold/20'
      }`}
    >
      <div className="container mx-auto px-4 lg:max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group" id="header-logo">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl p-1.5 border border-rkGold/30 group-hover:border-rkGold transition-colors shadow-sm">
            <img
              src={sukukAsset("logo.png")}
              alt="شعار مكتب ريان للمساحة والاستشارات الهندسية"
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                // fallback if missing
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
              مكتب ريان
            </h1>
            <p className="text-rkGoldLight text-xs font-semibold tracking-wide">
              لتحديث الصكوك العقارية
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-white/95 font-medium text-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-rkGold transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rkGold hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls: Code Viewer Modal + Call CTA */}
        <div className="flex items-center gap-3">
          {/* Code Viewer Button */}
          <button
            onClick={onOpenCodeModal}
            id="view-code-button"
            className="flex items-center gap-1.5 bg-rkGold/20 hover:bg-rkGold text-rkGold hover:text-[#2B0F16] border border-rkGold/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            title="استعراض الكود المصدري المستخرج للموقع"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">الكود المستخرج</span>
            <span className="sm:hidden">الكود</span>
          </button>

          {/* Desktop Phone CTA */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            id="header-phone-cta"
            className="hidden lg:flex items-center gap-2 text-white font-bold hover:text-rkGold transition-colors text-sm px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/15 hover:border-rkGold/50"
            dir="ltr"
          >
            <Phone className="w-4 h-4 text-rkGold" />
            <span>{PHONE_DISPLAY}</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-rkGold" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          className="md:hidden bg-[#2B0F16] border-t border-rkGold/20 shadow-2xl px-6 py-4 transition-all"
        >
          <nav className="flex flex-col text-white font-medium space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 border-b border-white/10 hover:text-rkGold transition-colors text-base"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center justify-center gap-2 bg-rkGold text-[#2B0F16] font-bold py-2.5 rounded-xl shadow-md"
                dir="ltr"
              >
                <Phone className="w-4 h-4" />
                <span>{PHONE_DISPLAY}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCodeModal?.();
                }}
                className="flex items-center justify-center gap-2 bg-white/10 text-rkGold font-bold py-2.5 rounded-xl border border-rkGold/30 text-sm"
              >
                <Code2 className="w-4 h-4" />
                <span>عرض كود الموقع المستخرج</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
