import { sukukUpdatedAsset } from '../asset';
import React, { useState, useEffect } from 'react';
import { PHONE_DISPLAY, PHONE_NUMBER } from '../data/siteData';
import { Phone, MessageSquare, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
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
    { label: 'خدماتنا', href: '#services' },
    { label: 'حاسبة المدة', href: '#calculator' },
    { label: 'لماذا نحن', href: '#about' },
    { label: 'أعمالنا', href: '#projects' },
    { label: 'آراء العملاء', href: '#testimonials' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F4EBDD]/95 backdrop-blur-md py-2.5 shadow-xl border-b border-rkGold/35'
          : 'bg-[#F4EBDD]/95 backdrop-blur-sm py-4 border-b border-rkGold/35'
      }`}
    >
      <div className="container mx-auto px-4 lg:max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group" id="header-logo">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl p-1.5 border border-rkGold/30 group-hover:border-rkGold transition-colors shadow-sm">
            <img
              src={sukukUpdatedAsset("logo.png")}
              alt="شعار مكتب ريان للمساحة والاستشارات الهندسية"
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
              مكتب ريان
            </h1>
            <p className="text-rkGoldLight text-xs font-semibold tracking-wide">
              للمساحة والاستشارات الهندسية
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

        {/* Action Controls: Consultation CTA + Call */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            id="header-consultation-btn"
            className="flex items-center gap-1.5 bg-[#C9973C] hover:bg-[#B8860B] text-[#2B0F16] px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-md cursor-pointer border border-amber-300"
          >
            <MessageSquare className="w-4 h-4 text-[#2B0F16]" />
            <span>طلب استشارة</span>
          </a>

          {/* Desktop Phone CTA */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            id="header-phone-cta"
            className="hidden lg:flex items-center gap-2 text-white font-bold hover:text-[#FEB922] transition-colors text-sm px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/20 hover:border-[#C9973C]/60"
            dir="ltr"
          >
            <Phone className="w-4 h-4 text-[#FEB922]" />
            <span className="text-white font-bold tracking-wider">{PHONE_DISPLAY}</span>
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
          className="md:hidden bg-[#F4EBDD] border-t border-rkGold/30 shadow-2xl px-6 py-4 transition-all"
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
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-2.5 rounded-xl text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>طلب استشارة هندسية فورية</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
