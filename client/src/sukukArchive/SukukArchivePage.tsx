import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyUs } from './components/WhyUs';
import { Services } from './components/Services';
import { WorkProcess } from './components/WorkProcess';
import { PartnersMarquee } from './components/PartnersMarquee';
import { ProjectsGallery } from './components/ProjectsGallery';
import { StatsBar } from './components/StatsBar';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { CodeViewerModal } from './components/CodeViewerModal';

export default function App() {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div dir="rtl" className="sukuk-archive-page min-h-screen flex flex-col bg-[#F7F4EE] text-[#2F2F2F] relative selection:bg-rkGold selection:text-[#2B0F16]">
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

        {/* 4. Work Process & Methodology */}
        <WorkProcess />

        {/* 5. Clients & Official Accreditations Marquees */}
        <PartnersMarquee />

        {/* 6. Projects & Surveying Works Gallery */}
        <ProjectsGallery />

        {/* 7. Animated Statistics Bar */}
        <StatsBar />

        {/* 8. Client Testimonials */}
        <Testimonials />

        {/* 9. Frequently Asked Questions */}
        <FAQ />

        {/* 10. Contact Section & Branches */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons (WhatsApp & Call) */}
      <FloatingActions />
      <CodeViewerModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />

    </div>
  );
}
