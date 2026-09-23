import { sukukUpdatedAsset } from '../asset';
import React, { useState, useMemo } from 'react';
import { PROJECTS_DATA, WHATSAPP_NUMBER } from '../data/siteData';
import { ProjectItem } from '../types';
import { ImageModal } from './ImageModal';
import {
  Eye,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const ProjectsGallery: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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

  const activeProject = filteredProjects[currentIndex] || filteredProjects[0];

  const handleNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  // Lightbox navigation
  const selectedIndex = selectedProject
    ? filteredProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handleModalNext = () => {
    if (selectedIndex === -1) return;
    const nextIdx = (selectedIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIdx]);
  };

  const handleModalPrev = () => {
    if (selectedIndex === -1) return;
    const prevIdx = (selectedIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[prevIdx]);
  };

  return (
    <section id="projects" className="py-16 sm:py-20 bg-[#F7F4EE] relative overflow-hidden border-t border-stone-200/60">
      <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-[#C9A063]/40 text-[#8B6535] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-[#C9A063]" />
            <span>مجلة المشاريع الميدانية والأعمال المنجزة</span>
          </div>

          <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#3F1620] mb-3 tracking-tight">
            معرض أعمالنا ومشاريعنا الميدانية
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            تصفح نماذج من الرفوعات المساحية وتحديث الصكوك عبر مجلة المشاريع المدمجة، أو استعرض الألبوم الكامل بنقرة واحدة.
          </p>
        </div>

        {/* Compact Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mb-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#5C2430] text-white shadow-sm border border-[#C9A063]/40'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* COMPACT INTERACTIVE MAGAZINE CONTAINER (Saves space by default) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden transition-all duration-300">
          {/* Magazine Top Control Bar */}
          <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
              <span className="w-2 h-2 rounded-full bg-[#C9A063] animate-pulse"></span>
              <span>
                المشروع <strong className="text-[#5C2430]">{currentIndex + 1}</strong> من{' '}
                <strong className="text-[#5C2430]">{filteredProjects.length}</strong>
              </span>
            </div>

            {/* Toggle Full Grid / Compact Magazine */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-50 text-[#5C2430] border border-stone-200 hover:border-[#C9A063] px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#C9A063]" />
                  <span>تصغير لحاوية العرض</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#C9A063]" />
                  <span>عرض الشبكة الكاملة ({filteredProjects.length} مشاريع)</span>
                </>
              )}
            </button>
          </div>

          {/* MODE A: COMPACT SLIDER MAGAZINE VIEW (DEFAULT - SAVES MAXIMUM VERTICAL SPACE) */}
          {!isExpanded && activeProject && (
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Project Image & Carousel Area */}
                <div className="lg:col-span-7 relative">
                  <div
                    className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md group cursor-pointer"
                    onClick={() => setSelectedProject(activeProject)}
                  >
                    <img
                      src={sukukUpdatedAsset(activeProject.image)}
                      alt={activeProject.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/project-1.jpeg';
                      }}
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                      {activeProject.location && (
                        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                          <MapPin className="w-3 h-3 text-[#C89A52]" />
                          <span>{activeProject.location}</span>
                        </span>
                      )}
                      {activeProject.badge && (
                        <span className="inline-flex items-center bg-[#C9A063] text-[#3F1620] text-xs font-black px-3 py-1 rounded-full shadow-sm">
                          {activeProject.badge}
                        </span>
                      )}
                    </div>

                    {/* Hover Inspect Indicator */}
                    <div className="absolute inset-0 bg-[#3F1620]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-white font-bold text-sm">
                      <Eye className="w-5 h-5 text-[#C89A52]" />
                      <span>انقر لمعاينة الصورة بالحجم الكامل</span>
                    </div>
                  </div>

                  {/* Navigation Arrows for Slider */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handlePrevSlide}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-[#5C2430] text-stone-700 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        title="المشروع السابق"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextSlide}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-[#5C2430] text-stone-700 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        title="المشروع التالي"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Thumbnail Dots */}
                    <div className="flex items-center gap-1 max-w-[200px] overflow-hidden">
                      {filteredProjects.slice(0, 10).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            currentIndex === idx ? 'w-6 bg-[#C9A063]' : 'w-1.5 bg-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Details & Inquiries */}
                <div className="lg:col-span-5 text-right space-y-4">
                  {activeProject.category && (
                    <span className="text-[11px] font-bold text-[#8B6535] bg-amber-50 border border-[#C9A063]/30 px-3 py-1 rounded-md inline-block">
                      {activeProject.category}
                    </span>
                  )}

                  <h3 className="text-xl sm:text-2xl font-black text-[#3F1620]">
                    {activeProject.title}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {activeProject.subtitle}
                  </p>

                  {activeProject.equipment && (
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700">
                      <strong className="text-[#5C2430] block mb-1">التقنيات والمعدات المستخدمة:</strong>
                      <span>{activeProject.equipment}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setSelectedProject(activeProject)}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#5C2430]" />
                      <span>تكبير ومعاينة المستند</span>
                    </button>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`السلام عليكم، استفسار عن عمل مساحي مشابه لمشروع: ${activeProject.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>طلب تنفيذ مماثل</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE B: EXPANDED FULL GRID (ONLY SHOWN WHEN VISITOR CLICKS "عرض الشبكة الكاملة") */}
          {isExpanded && (
            <div className="p-6 sm:p-8 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden hover:border-[#C9A063] transition-all group flex flex-col justify-between"
                  >
                    <div
                      className="relative aspect-[4/3] bg-stone-900 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedProject(proj)}
                    >
                      <img
                        src={sukukUpdatedAsset(proj.image)}
                        alt={proj.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/project-1.jpeg';
                        }}
                      />
                      <div className="absolute inset-0 bg-[#3F1620]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <Eye className="w-4 h-4 text-[#C89A52]" />
                        <span>تكبير</span>
                      </div>
                    </div>

                    <div className="p-4 text-right">
                      <h4 className="font-extrabold text-sm text-[#3F1620] mb-1 line-clamp-1">
                        {proj.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mb-3">
                        {proj.subtitle}
                      </p>

                      <div className="flex gap-1.5 pt-2 border-t border-stone-200">
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="flex-1 bg-white hover:bg-stone-200 text-stone-700 py-1.5 px-2 rounded-lg text-xs font-bold border border-stone-200"
                        >
                          معاينة
                        </button>
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`السلام عليكم، استفسار عن مشروع: ${proj.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#5C2430] text-white py-1.5 px-2 rounded-lg text-xs font-bold text-center"
                        >
                          استفسار
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      <ImageModal
        project={selectedProject}
        currentIndex={selectedIndex}
        totalCount={filteredProjects.length}
        onClose={() => setSelectedProject(null)}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
      />
    </section>
  );
};
