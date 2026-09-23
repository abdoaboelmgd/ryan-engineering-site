import { sukukUpdatedAsset } from '../asset';
import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Wrench, Tag, MessageSquare, ShieldCheck } from 'lucide-react';
import { ProjectItem } from '../types';
import { WHATSAPP_NUMBER } from '../data/siteData';

interface ImageModalProps {
  project: ProjectItem | null;
  currentIndex?: number;
  totalCount?: number;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  project,
  currentIndex = 0,
  totalCount = 0,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onNext) onNext();
      if (e.key === 'ArrowRight' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  const whatsappInquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `السلام عليكم، أرغب في الاستفسار عن تفاصيل وتكلفة تنفيذ عمل مساحي/هندسي مماثل لمشروع: ${project.title} (${project.location || ''})`
  )}`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-[#3F1620] rounded-3xl overflow-hidden shadow-2xl border border-rkGold/30 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="p-4 bg-[#3F1620] border-b border-rkGold/20 flex items-center justify-between text-white text-right">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-black/40 hover:bg-rkGold hover:text-[#3F1620] text-white rounded-full flex items-center justify-center transition-all"
              aria-label="إغلاق المعاينة"
              title="إغلاق (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {totalCount > 0 && (
              <span className="text-xs font-mono bg-black/30 border border-white/10 px-3 py-1 rounded-full text-rkGold">
                {currentIndex + 1} / {totalCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {project.badge && (
              <span className="text-xs font-bold bg-rkGold/20 text-rkGold border border-rkGold/40 px-3 py-1 rounded-full">
                {project.badge}
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-rkGold" />
              توثيق هندسي معتمد
            </span>
          </div>
        </div>

        {/* Modal Image Viewport */}
        <div className="relative flex-grow min-h-[300px] max-h-[60vh] flex items-center justify-center bg-black/60 overflow-hidden group">
          <img
            src={sukukUpdatedAsset(project.image)}
            alt={project.title}
            className="w-full h-full object-contain max-h-[60vh] transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/project-1.jpeg';
            }}
          />

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-rkGold text-white hover:text-[#3F1620] rounded-full flex items-center justify-center transition-all shadow-lg border border-white/10"
              title="المشروع السابق"
              aria-label="السابق"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-rkGold text-white hover:text-[#3F1620] rounded-full flex items-center justify-center transition-all shadow-lg border border-white/10"
              title="المشروع التالي"
              aria-label="التالي"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Modal Footer & Specifications */}
        <div className="p-5 sm:p-6 bg-[#3F1620] text-right border-t border-rkGold/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-grow">
            <h3 className="text-xl sm:text-2xl font-black text-white">{project.title}</h3>
            <p className="text-xs sm:text-sm text-rkGoldLight">{project.subtitle}</p>

            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
              {project.category && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-stone-300 px-2.5 py-1 rounded-lg">
                  <Tag className="w-3 h-3 text-rkGold" />
                  {project.category}
                </span>
              )}
              {project.location && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-stone-300 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3 h-3 text-rkGold" />
                  {project.location}
                </span>
              )}
              {project.equipment && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-stone-300 px-2.5 py-1 rounded-lg">
                  <Wrench className="w-3 h-3 text-rkGold" />
                  {project.equipment}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto bg-rkGold hover:bg-rkGoldDark text-[#3F1620] font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>طلب تسعيرة لهذا المشروع</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
