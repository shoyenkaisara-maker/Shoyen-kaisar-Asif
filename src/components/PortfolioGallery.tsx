import React, { useState, useMemo } from 'react';
import { Search, Film, Palette, Trees, Layout, Box, Filter, Sparkles } from 'lucide-react';
import type { Project, CategoryItem } from '../types/portfolio.ts';
import { ProjectCard } from './ProjectCard.tsx';
import { filterProjects } from '../utils/portfolio.ts';

interface PortfolioGalleryProps {
  projects: Project[];
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onSelectProject: (project: Project) => void;
  onOpenAdmin: () => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  projects,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectProject,
  onOpenAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Find categories that contain projects (as requested: "Only show categories that contain actual projects.")
  const activeCategories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    });

    return categories.filter((cat) => (counts.get(cat.slug) || 0) > 0);
  }, [projects, categories]);

  // Filter projects by category and query
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, selectedCategory, searchQuery);
  }, [projects, selectedCategory, searchQuery]);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case '2d-animation':
        return <Film className="w-4 h-4" />;
      case 'character-design':
        return <Palette className="w-4 h-4" />;
      case 'background-art':
        return <Trees className="w-4 h-4" />;
      case 'storyboards':
        return <Layout className="w-4 h-4" />;
      default:
        return <Box className="w-4 h-4" />;
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-[#090D16] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Animation & Design Portfolio
            </h2>
            <p className="text-slate-400 max-w-xl text-sm sm:text-base">
              Explore 2D animation clips, character turnaround model sheets, rural Bengali background art, and pre-production storyboards created in Adobe Animate CC.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search art, software, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              aria-label="Search portfolio projects"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-800/80" role="tablist">
          {/* All tab */}
          <button
            role="tab"
            aria-selected={selectedCategory === 'all'}
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>All Works</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              selectedCategory === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {projects.length}
            </span>
          </button>

          {/* Active Categories Tabs */}
          {activeCategories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            const count = projects.filter((p) => p.category === category.slug).length;
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(category.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {getCategoryIcon(category.slug)}
                <span>{category.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => {
              const catObj = categories.find((c) => c.slug === project.category);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  categoryName={catObj ? catObj.name : project.category}
                  onClick={onSelectProject}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-cyan-400 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No projects found</h3>
            <p className="text-sm text-slate-400">
              {searchQuery
                ? `No artwork matched "${searchQuery}". Try a different keyword.`
                : 'No projects currently uploaded in this category.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Clear search
                </button>
              )}
              <button
                onClick={onOpenAdmin}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                Upload to this category in Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
