import React from 'react';
import { Clapperboard, ArrowUp, Lock, Heart, Shield } from 'lucide-react';
import type { ProfileData, SocialLinks } from '../types/portfolio.ts';

interface FooterProps {
  profile: ProfileData;
  socials: SocialLinks;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  socials,
  onNavigate,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070A11] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand & Summary */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {profile.logoType === 'custom' && profile.logoImage ? (
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shadow-md p-1 shrink-0">
                  <img src={profile.logoImage} alt={profile.name} className="w-full h-full object-contain" />
                </div>
              ) : profile.logoType === 'avatar' && profile.avatarImage ? (
                <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-cyan-500/60 overflow-hidden shadow-md shrink-0">
                  <img src={profile.avatarImage} alt={profile.name} className="w-full h-full object-cover" />
                </div>
              ) : profile.logoImage ? (
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shadow-md p-1 shrink-0">
                  <img src={profile.logoImage} alt={profile.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20 shrink-0">
                  <Clapperboard className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">
                  {profile.name}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {profile.brandSubtitle || '2D Animator & Cartoon Designer'}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              {profile.title}. Dedicated to high-standard 2D character animation, Bengali village environment illustrations, and visual pre-production.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Trained at Twenty One Academy</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About Shoyen Kaiser Asif
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Hire / Contact Me
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Admin Portal */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Direct Contact
            </h4>
            <p className="text-xs text-slate-400">
              Email:{' '}
              <a href={`mailto:${socials.email}`} className="text-cyan-400 hover:underline">
                {socials.email}
              </a>
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portfolio Management Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Shoyen Kaiser Asif. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
