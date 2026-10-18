import React from 'react';
import { User, Award, CheckCircle2, Film, Palette, Compass, Layers } from 'lucide-react';
import type { ProfileData } from '../types/portfolio.ts';

interface AboutSectionProps {
  profile: ProfileData;
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  onContactClick,
}) => {
  return (
    <section id="about" className="py-20 bg-[#0B101D] relative scroll-mt-20 border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Avatar & Creative Profile Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-500 opacity-30 blur-lg group-hover:opacity-60 transition duration-500" />
              
              {/* Avatar Frame */}
              <div className="relative rounded-3xl bg-[#0f172a] border border-slate-700/80 p-4 shadow-2xl flex flex-col items-center text-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border-2 border-cyan-500/40 relative shadow-inner mb-4">
                  <img
                    src={profile.avatarImage}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/90 text-[10px] font-mono text-cyan-400 border border-slate-700">
                    2D Artist
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-white">{profile.name}</h3>
                <p className="text-cyan-400 text-xs sm:text-sm font-semibold mt-1">
                  {profile.title}
                </p>

                {/* Badges / Credentials */}
                <div className="w-full mt-4 pt-4 border-t border-slate-800 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Experience:</strong> {profile.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Training:</strong> {profile.training}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Film className="w-4 h-4 text-orange-400 shrink-0" />
                    <span><strong>Primary Software:</strong> {profile.primarySoftware}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative & Software List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>About The Artist</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Crafting Expressive 2D Worlds & Cartoon Characters
            </h2>

            {/* Official Bio Paragraphs */}
            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p>{profile.aboutBio1}</p>
              <p>{profile.aboutBio2}</p>
              <p className="text-slate-300 font-medium">{profile.aboutBio3}</p>
            </div>

            {/* Creative Disciplines */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Core Animation Disciplines
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <Film className="w-5 h-5 text-cyan-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">2D Animation</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <Palette className="w-5 h-5 text-orange-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Character Design</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <Compass className="w-5 h-5 text-emerald-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Background Art</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <Layers className="w-5 h-5 text-sky-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Storyboarding</span>
                </div>
              </div>
            </div>

            {/* Software and Tools List (Clean, NO fake skill percentages as requested) */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Software & Creative Tools
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {profile.tools && profile.tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm font-semibold text-slate-200 hover:border-cyan-500 transition-colors shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={onContactClick}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              >
                Discuss a Project with Asif
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
