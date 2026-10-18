import React, { useState, useEffect } from 'react';
import type { PortfolioData, Project } from './types/portfolio.ts';
import { DEFAULT_PORTFOLIO_DATA } from './data/defaultData.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { PortfolioGallery } from './components/PortfolioGallery.tsx';
import { ProjectDetailModal } from './components/ProjectDetailModal.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { Sparkles, Lock, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    try {
      const cached = localStorage.getItem('asif_portfolio_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.profile && Array.isArray(parsed.projects)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached portfolio data:', e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('asif_admin_token') || sessionStorage.getItem('asif_admin_token');
  });

  // Fetch portfolio data from backend with cache busting to guarantee real-time updates
  const fetchPortfolioData = async () => {
    try {
      const res = await fetch(`/api/portfolio?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolioData(data);
        try {
          localStorage.setItem('asif_portfolio_cache', JSON.stringify(data));
        } catch (storageErr) {
          // ignore potential storage quota error
        }
      }
    } catch (err) {
      console.warn('Backend connection error, maintaining cached portfolio:', err);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Verify auth token on initial load
  useEffect(() => {
    if (authToken) {
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => {
          if (!res.ok) {
            handleLogout();
          }
        })
        .catch(() => {});
    }
  }, [authToken]);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'portfolio', 'about', 'contact'];
      const scrollY = window.scrollY;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 120;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('asif_admin_token', token);
    sessionStorage.setItem('asif_admin_token', token);
    setAuthToken(token);
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem('asif_admin_token');
    sessionStorage.removeItem('asif_admin_token');
    setAuthToken(null);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">
      {/* Admin Mode Quick Bar if logged in */}
      {authToken && !showAdmin && (
        <aside
          aria-label="Admin bar"
          className="bg-emerald-950/90 border-b border-emerald-700/60 text-emerald-300 px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">Admin Mode Active — You are editing this live portfolio.</span>
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Open Admin Dashboard</span>
          </button>
        </aside>
      )}

      {/* Main Public Navigation */}
      <Navbar
        profile={portfolioData.profile}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setShowAdmin(true)}
        isAdminLoggedIn={Boolean(authToken)}
      />

      <main>
        {/* Hero Section */}
        <Hero
          profile={portfolioData.profile}
          onExplorePortfolio={() => handleNavigate('portfolio')}
          onContactMe={() => handleNavigate('contact')}
        />

        {/* Portfolio Section */}
        <PortfolioGallery
          projects={portfolioData.projects}
          categories={portfolioData.categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectProject={(project) => setSelectedProject(project)}
          onOpenAdmin={() => setShowAdmin(true)}
        />

        {/* About Section */}
        <AboutSection
          profile={portfolioData.profile}
          onContactClick={() => handleNavigate('contact')}
        />

        {/* Contact Section */}
        <ContactSection
          socials={portfolioData.socials}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={portfolioData.profile}
        socials={portfolioData.socials}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          allProjects={portfolioData.projects}
          categories={portfolioData.categories}
          onClose={() => setSelectedProject(null)}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />
      )}

      {/* Admin Dashboard Overlay */}
      {showAdmin && (
        <AdminDashboard
          portfolioData={portfolioData}
          onClose={() => setShowAdmin(false)}
          onRefreshData={fetchPortfolioData}
          authToken={authToken}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
