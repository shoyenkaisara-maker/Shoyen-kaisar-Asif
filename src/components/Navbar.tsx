import React, { useState } from 'react';
import { Sparkles, Menu, X, Lock, ExternalLink, Mail, Clapperboard } from 'lucide-react';
import type { ProfileData } from '../types/portfolio.ts';

interface NavbarProps {
  profile: ProfileData;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeSection,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-1"
          aria-label="Go to homepage"
        >
          {profile.logoType === 'custom' && profile.logoImage ? (
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-500/60 group-hover:scale-105 transition-all p-1 shrink-0">
              <img
                src={profile.logoImage}
                alt={profile.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : profile.logoType === 'avatar' && profile.avatarImage ? (
            <div className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-cyan-500/60 overflow-hidden shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <img
                src={profile.avatarImage}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : profile.logoImage ? (
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-500/60 group-hover:scale-105 transition-all p-1 shrink-0">
              <img
                src={profile.logoImage}
                alt={profile.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Clapperboard className="w-5 h-5 text-slate-950 font-bold" />
            </div>
          )}
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              {profile.name}
            </span>
            <span className="text-xs text-slate-400 font-medium block">
              {profile.brandSubtitle || '2D Animator & Cartoon Designer'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('contact')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail className="w-4 h-4" />
            <span>Hire Me</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              isAdminLoggedIn
                ? 'bg-emerald-950/50 text-emerald-400 border-emerald-700/80 hover:bg-emerald-900/50'
                : 'bg-slate-900/80 text-slate-400 border-slate-700/70 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Portfolio Management Dashboard"
            aria-label="Admin Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin'}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-400 hover:text-slate-200"
            aria-label="Admin Dashboard"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B101D] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-sm shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Hire Shoyen Kaiser Asif</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portfolio Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
