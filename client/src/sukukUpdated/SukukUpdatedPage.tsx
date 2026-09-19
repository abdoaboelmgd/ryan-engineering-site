import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyUs } from './components/WhyUs';
import { Services } from './components/Services';
import { SmartCalculator } from './components/SmartCalculator';
import { WorkProcess } from './components/WorkProcess';
import { PartnersMarquee } from './components/PartnersMarquee';
import { ProjectsGallery } from './components/ProjectsGallery';
import { Testimonials } from './components/Testimonials';
import { StatsBar } from './components/StatsBar';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { StickyConversionBar } from './components/StickyConversionBar';
import '../sukukUpdated.css';

export default function SukukUpdatedPage() {
  useEffect(() => {
    const title = 'مكتب ريان لتحديث الصكوك العقارية | الصفحة الرسمية';
    const description = 'خدمات تحديث وفرز ودمج الصكوك وتوثيقها إلكترونياً والرفع المساحي بالرياض والقصيم والدمام وكافة مناطق المملكة.';
    document.title = title;
    let meta = document.head.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}${import.meta.env.BASE_URL}sukuk/`;
  }, []);
  return (
    <div dir="rtl" className="sukuk-updated-page min-h-screen flex flex-col bg-[#F7F4EE] text-[#2F2F2F] relative selection:bg-rkGold selection:text-[#2B0F16] pb-16 lg:pb-0">
      {/* Main Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero with interactive multi-step quick consultation */}
        <Hero />

        {/* 2. Core Specialized Sukuk Services */}
        <Services />

        {/* 3. Why Choose Ryan */}
        <WhyUs />

        {/* 4. Smart Duration & Requirements Calculator (Conversion Booster) */}
        <SmartCalculator />

        {/* 5. Work Process & Methodology */}
        <WorkProcess />

        {/* 6. Clients & Official Accreditations Marquees */}
        <PartnersMarquee />

        {/* 7. Projects & Surveying Works Gallery (Interactive Space-Saving Magazine) */}
        <ProjectsGallery />

        {/* 8. Verified Client Testimonials */}
        <Testimonials />

        {/* 9. Animated Statistics Bar */}
        <StatsBar />

        {/* 10. Frequently Asked Questions */}
        <FAQ />

        {/* 11. Contact Section & Branches */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons (WhatsApp & Call) */}
      <FloatingActions />

      {/* Sticky Mobile Conversion Bar (Google/Social Ads Focused) */}
      <StickyConversionBar />
    </div>
  );
}


// Page-level metadata for the attached updated Sukuk package.
