import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyUs } from './components/WhyUs';
import { Services } from './components/Services';
import { WorkProcess } from './components/WorkProcess';
import { PartnersMarquee } from './components/PartnersMarquee';
import { ProjectsGallery } from './components/ProjectsGallery';
import { StatsBar } from './components/StatsBar';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { SmartCalculator } from './components/SmartCalculator';
import { StickyConversionBar } from './components/StickyConversionBar';
import { CodeViewerModal } from './components/CodeViewerModal';

export default function App() {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  useEffect(() => {
    const title = 'تحديث الصكوك العقارية إلكترونياً | مكتب ريان للمساحة والاستشارات الهندسية';
    const description = 'خدمات تحديث وفرز ودمج وتصحيح الصكوك العقارية والرفع المساحي في الرياض والمملكة العربية السعودية بمخرجات هندسية واضحة ومتابعة منظمة.';
    document.title = title;
    const setMeta = (selector: string, attrs: Record<string, string>) => {
      let node = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!node) { node = document.createElement('meta'); document.head.appendChild(node); }
      Object.entries(attrs).forEach(([key, value]) => node!.setAttribute(key, value));
    };
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[name="keywords"]', { name: 'keywords', content: 'تحديث الصكوك, تحديث الصك العقاري, صك إلكتروني, فرز الصكوك, دمج الصكوك, رفع مساحي للصكوك' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); document.head.appendChild(canonical); }
    canonical.rel = 'canonical'; canonical.href = `${window.location.origin}${import.meta.env.BASE_URL}sukuk/`;
  }, []);
  return (
    <div dir="rtl" className="sukuk-archive-page min-h-screen flex flex-col bg-[#F7F4EE] text-[#2F2F2F] relative selection:bg-rkGold selection:text-[#2B0F16]">
      <div className="bg-[#2B0F16] text-gray-300 py-2 px-4 text-xs flex justify-between items-center border-b border-rkGold/20 z-50">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rkGold animate-pulse"/><span>الهوية الرسمية لموقع <strong>مكتب ريان للمساحة والاستشارات الهندسية</strong> مطبقة بالكامل.</span></div>
        <button onClick={() => setIsCodeModalOpen(true)} className="text-rkGold hover:text-rkGoldLight font-bold underline cursor-pointer mr-2 transition-colors">عرض الكود المستخرج / تحميل الملف</button>
      </div>

      {/* Main Header */}
      <Header onOpenCodeModal={() => setIsCodeModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero with interactive quick consultation */}
        <Hero />
        {/* 2. Why Choose Us */}
        <WhyUs />

        {/* 3. Core Specialized Sukuk Services */}
        <Services />

        {/* 4. Smart duration and requirements calculator */}
        <SmartCalculator />

        {/* 5. Work Process & Methodology */}
        <WorkProcess />

        {/* 5. Clients & Official Accreditations Marquees */}
        <PartnersMarquee />

        {/* 6. Projects & Surveying Works Gallery */}
        <ProjectsGallery />

        {/* 7. Animated Statistics Bar */}
        <StatsBar />

        {/* 8. Frequently Asked Questions */}
        <FAQ />

        {/* 10. Contact Section & Branches */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons (WhatsApp & Call) */}
      <FloatingActions />
      <StickyConversionBar />
      <CodeViewerModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />

    </div>
  );
}
