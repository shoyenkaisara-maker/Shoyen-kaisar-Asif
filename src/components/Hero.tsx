import React, { useRef, useState } from 'react';
import { ArrowDown, Mail, Sparkles, Film, Palette, Layers, Volume2, VolumeX, Pause, Play, Repeat } from 'lucide-react';
import type { ProfileData } from '../types/portfolio.ts';
import { isVideoMedia } from '../utils/portfolio.ts';

interface HeroProps {
  profile: ProfileData;
  onExplorePortfolio: () => void;
  onContactMe: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  onExplorePortfolio,
  onContactMe,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const isVideoLoop = Boolean(
    (profile.heroMediaType === 'video' && profile.heroVideoUrl && profile.heroVideoUrl.trim()) ||
    (!profile.heroMediaType && profile.heroVideoUrl && profile.heroVideoUrl.trim()) ||
    isVideoMedia(profile.heroFeaturedImage)
  );

  const loopVideoSrc = (profile.heroMediaType === 'video' && profile.heroVideoUrl)
    ? profile.heroVideoUrl
    : (isVideoMedia(profile.heroFeaturedImage) ? profile.heroFeaturedImage : (profile.heroVideoUrl || null));

  const [videoError, setVideoError] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="hero" className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 md:py-20 overflow-hidden">
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[30rem] h-[30rem] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle cartoon animation grid / frame guide lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Introduction */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status / Greeting Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Hi, I'm {profile.name}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {profile.heroHeadline || 'I Bring Stories to Life Through 2D Animation.'}
            </h1>

            {/* Bios */}
            <div className="space-y-3 max-w-2xl text-slate-300 text-base sm:text-lg leading-relaxed">
              <p>
                {profile.heroBio ||
                  "I'm a 2D Animator and Cartoon Designer with 2+ years of experience creating cartoon characters, beautiful backgrounds, and engaging visual stories using Adobe Animate CC."}
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                {profile.heroSubBio ||
                  'I turn creative ideas into engaging visual experiences through character design, background art, and 2D animation.'}
              </p>
            </div>

            {/* Key Skill Highlights Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span>Adobe Animate CC (Primary)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <Palette className="w-3.5 h-3.5 text-orange-400" />
                <span>2+ Years Experience</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Twenty One Academy Trained</span>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExplorePortfolio}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-400 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore My Portfolio</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onContactMe}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-white font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact Me</span>
              </button>
            </div>
          </div>

          {/* Right Column: Featured Animation / Artwork Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-lg group">
              {/* Glowing halo */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-orange-500/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Artwork Container Card */}
              <div className="relative rounded-2xl bg-[#0f172a] border border-slate-700/80 overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.01]">
                {/* Top preview title bar */}
                <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      {isVideoLoop && !videoError ? 'Featured Animation Reel (Loop)' : 'Featured 2D Artwork'}
                    </span>
                  </div>

                  {isVideoLoop && !videoError ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 text-[11px] font-mono">
                      <Repeat className="w-3 h-3 animate-spin text-cyan-400" />
                      <span>Looping • 24 FPS</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                      24 FPS
                    </span>
                  )}
                </div>

                {/* Media Showcase: Video Loop or Featured Artwork Image */}
                <div className="relative aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
                  {isVideoLoop && loopVideoSrc && !videoError ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        key={loopVideoSrc}
                        src={loopVideoSrc}
                        poster={profile.heroFeaturedImage}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        preload="auto"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onError={() => setVideoError(true)}
                        className="w-full h-full object-cover object-center"
                      />

                      {/* Interactive floating playback controls */}
                      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-white hover:text-cyan-400 hover:border-cyan-500 flex items-center justify-center transition-all shadow-lg"
                          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                        </button>
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-white hover:text-cyan-400 hover:border-cyan-500 flex items-center justify-center transition-all shadow-lg"
                          aria-label={isPlaying ? 'Pause looping video' : 'Play looping video'}
                          title={isPlaying ? 'Pause Video' : 'Play Video'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-cyan-400 ml-0.5" />}
                        </button>
                      </div>

                      {/* Gradient overlay for bottom captions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Bottom caption overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-xs font-medium text-slate-200 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center gap-1.5">
                          <Repeat className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                          <span>Continuous Loop</span>
                        </span>
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-cyan-800/80">
                          Adobe Animate CC
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={profile.heroFeaturedImage}
                        alt="Featured 2D Animation and Character Art by Shoyen Kaiser Asif"
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                      />
                      {/* Subtle hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                      
                      {/* Bottom caption overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-xs font-medium text-slate-200 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-700/60">
                          Vector Rigged & Hand-Crafted
                        </span>
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-cyan-800/80">
                          Adobe Animate CC
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
