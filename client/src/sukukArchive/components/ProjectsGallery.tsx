import { sukukAsset } from '../asset';
import React, { useState, useMemo } from 'react';
import { PROJECTS_DATA, WHATSAPP_NUMBER } from '../data/siteData';
import { ProjectItem } from '../types';
import { ImageModal } from './ImageModal';
import {
  Eye,
  MapPin,
  Wrench,
  MessageSquare,
  Sparkles,
  Layers,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';

export const ProjectsGallery: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [visibleCount, setVisibleCount] = useState<number>(8);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = Array.from(
      new Set(PROJECTS_DATA.map((p) => p.category).filter(Boolean) as string[])
    );
    return ['الكل', ...list];
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'الكل') return PROJECTS_DATA;
    return PROJECTS_DATA.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  // Selected project index in filtered list for Lightbox prev/next
  const selectedIndex = selectedProject
    ? filteredProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handleNext = () => {
    if (selectedIndex === -1) return;
    const nextIdx = (selectedIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIdx]);
  };

  const handlePrev = () => {
    if (selectedIndex === -1) return;
    const prevIdx =
      (selectedIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[prevIdx]);
  };

  return (
    <section id="projects" className="py-20 sm:py-24 bg-[#F7F4EE] relative overflow-hidden border-t border-stone-200/60">
      {/* Background Subtle Surveyor Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #5C1F2E 1px, transparent 1px), linear-gradient(to bottom, #5C1F2E 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      ></div>

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-rkGold/30 text-rkGoldDark text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rkGold" />
            <span>سجل حافل بالإنجازات المساحية والهندسية</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B0F16] mb-4 tracking-tight">
            معرض أعمالنا ومشاريعنا الميدانية
          </h2>

          <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed">
            استعراض موثق لنماذج من مشاريع الرفع المساحي وتوقيع القواعد وتحديث وفرز الصكوك العقارية والإشراف الهندسي عبر مختلف مناطق المملكة.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === 'الكل'
                ? PROJECTS_DATA.length
                : PROJECTS_DATA.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(8);
                }}
                className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#5C1F2E] text-white shadow-md border border-rkGold/40'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 shadow-2xs'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-rkGold text-[#2B0F16]' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Professional Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProjects.map((proj) => {
            const whatsappProjectUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `السلام عليكم، أرغب في الاستفسار عن تنفيذ عمل مساحي أو هندسي مماثل لمشروع: ${proj.title} (${proj.location || ''})`
            )}`;

            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group hover:border-rkGold"
              >
                {/* Architectural Viewport Frame */}
                <div
                  className="relative aspect-[4/3] bg-stone-900 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(proj)}
                >
                  {/* Surveyor Crosshairs (Reticle Marks) */}
                  <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none text-white/40 group-hover:text-rkGold transition-colors text-[10px] font-mono leading-none">
                    +
                  </div>
                  <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none text-white/40 group-hover:text-rkGold transition-colors text-[10px] font-mono leading-none">
                    +
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none text-white/40 group-hover:text-rkGold transition-colors text-[10px] font-mono leading-none">
                    +
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none text-white/40 group-hover:text-rkGold transition-colors text-[10px] font-mono leading-none">
                    +
                  </div>

                  {/* Top Meta Badges (Floating on image) */}
                  <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-1 pointer-events-none">
                    {proj.location && (
                      <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/15">
                        <MapPin className="w-3 h-3 text-rkGold" />
                        <span className="truncate max-w-[130px]">{proj.location.split('-')[0]}</span>
                      </span>
                    )}

                    {proj.badge && (
                      <span className="inline-flex items-center gap-1 bg-rkGold text-[#2B0F16] text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        {proj.badge}
                      </span>
                    )}
                  </div>

                  {/* Project Image */}
                  <img
                    src={sukukAsset(proj.image)}
                    alt={proj.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/project-1.jpeg';
                    }}
                  />

                  {/* Hover Overlay with Inspect Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B0F16]/95 via-[#3F1620]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                    <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs text-rkGold font-bold">
                        <Eye className="w-4 h-4" />
                        انقر للتكبير والتفاصيل
                      </span>
                      <span className="w-8 h-8 rounded-full bg-rkGold text-[#2B0F16] flex items-center justify-center shadow-md">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Shelf (Card Body) */}
                <div className="p-5 flex flex-col flex-grow text-right">
                  {/* Category Pill */}
                  {proj.category && (
                    <div className="mb-2">
                      <span className="text-[11px] font-bold text-rkGoldDark bg-amber-50 border border-rkGold/20 px-2.5 py-0.5 rounded-md inline-block">
                        {proj.category}
                      </span>
                    </div>
                  )}

                  {/* Title & Subtitle */}
                  <h3 className="font-extrabold text-[#2B0F16] text-base group-hover:text-[#5C1F2E] transition-colors mb-1.5 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {proj.subtitle}
                  </p>

                  {/* Equipment / Specs Chip */}
                  {proj.equipment && (
                    <div className="mt-auto pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500 mb-4">
                      <Wrench className="w-3.5 h-3.5 text-rkGold shrink-0" />
                      <span className="truncate">{proj.equipment}</span>
                    </div>
                  )}

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2 px-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="معاينة الصور والبيانات"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#5C1F2E]" />
                      <span>معاينة</span>
                    </button>

                    <a
                      href={whatsappProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#5C1F2E] hover:bg-[#3F1620] group-hover:bg-rkGold group-hover:text-[#2B0F16] text-white text-xs font-bold py-2 px-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      title="طلب تسعيرة لهذا المشروع"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>طلب تسعيرة</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Button */}
        {filteredProjects.length > visibleCount && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-[#5C1F2E] font-bold text-sm py-3 px-8 rounded-xl border border-[#5C1F2E]/30 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-rkGold"
            >
              <SlidersHorizontal className="w-4 h-4 text-rkGold" />
              <span>عرض المزيد من المشاريع ({filteredProjects.length - visibleCount} مشاريع إضافية)</span>
            </button>
          </div>
        )}

        {/* Bottom Banner Call to Action */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-lg text-center max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right">
            <h3 className="text-xl sm:text-2xl font-black text-[#2B0F16] mb-2">
              هل لديك مشروع هندسي أو عقار ترغب في رفعه ومطابقته؟
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              طواقمنا الميدانية مجهزة بأحدث المحطات المساحية للوصول إلى موقعك خلال 24 ساعة.
            </p>
          </div>

          <a
            href="#contact"
            className="shrink-0 bg-[#5C1F2E] hover:bg-[#3F1620] text-rkGold hover:text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-sm sm:text-base border border-rkGold/30"
          >
            طلب معاينة موقعية ومساحية
          </a>
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      <ImageModal
        project={selectedProject}
        currentIndex={selectedIndex}
        totalCount={filteredProjects.length}
        onClose={() => setSelectedProject(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
};
