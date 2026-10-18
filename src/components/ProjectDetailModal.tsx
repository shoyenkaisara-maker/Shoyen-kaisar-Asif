import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, ExternalLink, Calendar, Wrench, FileText, Maximize2 } from 'lucide-react';
import type { Project, CategoryItem } from '../types/portfolio.ts';
import { isVideoMedia, parseVideoEmbed } from '../utils/portfolio.ts';

interface ProjectDetailModalProps {
  project: Project | null;
  allProjects: Project[];
  categories: CategoryItem[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  allProjects,
  categories,
  onClose,
  onSelectProject,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'cover' | 'video' | 'gallery'>('cover');
  const [videoError, setVideoError] = useState<boolean>(false);

  useEffect(() => {
    if (!project) return;
    setActiveMediaIndex(0);
    setVideoError(false);
    
    // If project has video or video cover, default to video
    const hasAnyVideo = Boolean(
      (project.videoUrl && project.videoUrl.trim()) || 
      isVideoMedia(project.coverImage)
    );

    if (hasAnyVideo) {
      setViewMode('video');
    } else {
      setViewMode('cover');
    }
  }, [project]);

  // Keyboard navigation
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, allProjects]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allProjects.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onSelectProject(allProjects[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onSelectProject(allProjects[currentIndex + 1]);
    }
  };

  const categoryObj = categories.find((c) => c.slug === project.category);
  const categoryName = categoryObj ? categoryObj.name : project.category;

  const isVideoCover = isVideoMedia(project.coverImage);
  const effectiveVideoUrl = (project.videoUrl && project.videoUrl.trim())
    ? project.videoUrl
    : (isVideoCover ? project.coverImage : undefined);

  const parsedVideo = parseVideoEmbed(effectiveVideoUrl);
  const galleryList = [
    ...(isVideoCover ? [] : [project.coverImage]),
    ...(project.galleryImages || []).filter((img) => img !== project.coverImage && !isVideoMedia(img)),
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl bg-[#0B101D] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              {categoryName}
            </span>
            {project.isDemo && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60">
                Demo Content
              </span>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
              title="Previous project (Left Arrow)"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              {currentIndex + 1} / {allProjects.length}
            </span>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
              title="Next project (Right Arrow)"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-[1px] h-6 bg-slate-700/80 mx-1" />

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-950 hover:text-rose-400 transition-colors"
              title="Close modal (Escape)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Main Media Showcase */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-inner">
            {/* If video selected or available */}
            {viewMode === 'video' && parsedVideo.type !== 'none' ? (
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                {parsedVideo.type === 'youtube' && parsedVideo.embedUrl ? (
                  <iframe
                    src={parsedVideo.embedUrl}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : parsedVideo.type === 'vimeo' && parsedVideo.embedUrl ? (
                  <iframe
                    src={parsedVideo.embedUrl}
                    title={project.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : parsedVideo.type === 'direct' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
                    <video
                      key={parsedVideo.embedUrl || effectiveVideoUrl}
                      controls
                      playsInline
                      preload="auto"
                      controlsList="nodownload"
                      className="w-full h-full object-contain"
                      onError={() => setVideoError(true)}
                    >
                      <source src={parsedVideo.embedUrl || effectiveVideoUrl} type="video/mp4" />
                      <source src={parsedVideo.embedUrl || effectiveVideoUrl} type="video/webm" />
                      <source src={parsedVideo.embedUrl || effectiveVideoUrl} />
                      Your browser does not support the video tag.
                    </video>

                    {videoError && (
                      <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
                        <p className="text-sm text-slate-300">
                          Video playback encountered a browser format constraint.
                        </p>
                        <a
                          href={parsedVideo.embedUrl || effectiveVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 shadow"
                        >
                          <span>Open / Watch Video in New Tab</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-3">
                    <p>Video URL: {effectiveVideoUrl}</p>
                    <a
                      href={effectiveVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 text-slate-950 font-bold text-xs"
                    >
                      <span>Open Video File</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Image display */
              <div className="relative aspect-[16/10] sm:aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={galleryList[activeMediaIndex] || project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-contain max-h-[60vh]"
                />
              </div>
            )}

            {/* Media Toggle Switcher Bar (if both video & images exist) */}
            {parsedVideo.type !== 'none' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
                <button
                  onClick={() => setViewMode('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'video'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video</span>
                </button>
                <button
                  onClick={() => setViewMode('cover')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode !== 'video'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>View Artwork Stills</span>
                </button>
              </div>
            )}
          </div>

          {/* Multi-image Thumbnail Strip (if gallery has images) */}
          {galleryList.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Artwork Angles & Scene Frames ({galleryList.length})
              </span>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveMediaIndex(idx);
                      setViewMode('gallery');
                    }}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeMediaIndex === idx && viewMode !== 'video'
                        ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/20'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Project Details Information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Left Column: Description & Production Notes */}
            <div className="md:col-span-8 space-y-5">
              <div>
                <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white">
                  {project.title}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
                  {project.shortDescription}
                </p>
              </div>

              {project.productionNotes && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>Production & Technical Notes</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {project.productionNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Software & Specs */}
            <div className="md:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                {/* Software Used */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Software & Tools</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.softwareUsed && project.softwareUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Category & Status */}
                <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-slate-200 font-medium">{categoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Animator:</span>
                    <span className="text-slate-200 font-medium">Shoyen Kaiser Asif</span>
                  </div>
                  {project.videoUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Video Source:</span>
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
