import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  FolderKanban, 
  User, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  Layers,
  LogOut
} from 'lucide-react';
import type { PortfolioData, Project, CategoryItem, ProfileData, SocialLinks, ClientInquiry } from '../../types/portfolio.ts';
import { ProjectFormModal } from './ProjectFormModal.tsx';
import { MessagesInbox } from './MessagesInbox.tsx';
import { ProfileEditor } from './ProfileEditor.tsx';

interface AdminDashboardProps {
  portfolioData: PortfolioData;
  onClose: () => void;
  onRefreshData: () => void;
  authToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  portfolioData,
  onClose,
  onRefreshData,
  authToken,
  onLoginSuccess,
  onLogout,
}) => {
  // Tabs: 'projects' | 'profile' | 'messages'
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'messages'>('projects');

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Project Modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Messages state
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Feedback notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch inquiries when authenticated
  const fetchMessages = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.messages) {
        setInquiries(data.messages);
        setUnreadCount(data.messages.filter((m: ClientInquiry) => m.status === 'unread').length);
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchMessages();
    }
  }, [authToken]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLoginSuccess(data.token);
      setPasswordInput('');
      showToast('Welcome back, Shoyen Kaiser Asif!');
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect password');
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Reorder Project
  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    if (!authToken) return;
    const projects = [...portfolioData.projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    // Swap
    const temp = projects[index];
    projects[index] = projects[targetIndex];
    projects[targetIndex] = temp;

    const orderedIds = projects.map((p) => p.id);

    try {
      const res = await fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!authToken) return;
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        showToast(`Project "${title}" deleted`);
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Clear demo projects
  const handleClearDemoProjects = async () => {
    if (!authToken) return;
    if (!window.confirm('Remove all demo sample projects from your portfolio? You can replace them with your own real artwork.')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/clear-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        showToast('All demo projects removed. Your portfolio is now clean!');
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Restore demo projects
  const handleResetDemo = async () => {
    if (!authToken) return;
    if (!window.confirm('Restore initial sample demo projects?')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/reset-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        showToast('Demo projects restored');
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If NOT logged in, show login screen
  if (!authToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Portfolio Admin Portal</h3>
            <p className="text-xs text-slate-400">
              Enter your master password to manage your 2D animation portfolio, upload artwork, and view client inquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Admin Password
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter master password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const demoCount = portfolioData.projects.filter((p) => p.isDemo).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#090D16] flex flex-col overflow-hidden">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="h-16 px-4 sm:px-8 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Live Portfolio</span>
          </button>
          <div className="hidden sm:block h-5 w-[1px] bg-slate-700" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              {portfolioData.profile.name} — Control Center
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projects ({portfolioData.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Visuals</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'messages'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inquiries</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Sign out of admin"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* --- Tab 1: Projects Manager --- */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Portfolio Projects Management</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {portfolioData.projects.length} Total
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Add, edit, delete, and reorder your 2D animation clips, character designs, and background illustrations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {demoCount > 0 && (
                  <button
                    onClick={handleClearDemoProjects}
                    className="px-3.5 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 text-xs font-semibold transition-colors"
                    title="Remove sample demo items in one click"
                  >
                    Clear Demo Content ({demoCount})
                  </button>
                )}

                <button
                  onClick={handleResetDemo}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  title="Restore default sample projects"
                >
                  Reset Defaults
                </button>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowProjectModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>

            {/* Projects Table / Card List */}
            <div className="space-y-3">
              {portfolioData.projects.map((proj, idx) => {
                const cat = portfolioData.categories.find((c) => c.slug === proj.category);
                return (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{proj.title}</h4>
                          {proj.isDemo && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                              Demo
                            </span>
                          )}
                          {proj.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-cyan-400 font-medium">{cat ? cat.name : proj.category}</span>
                          <span>•</span>
                          <span>{proj.softwareUsed?.join(', ')}</span>
                          {proj.videoUrl && (
                            <>
                              <span>•</span>
                              <span className="text-rose-400">Video</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Reorder, Edit, Delete */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleMoveProject(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-20"
                        title="Move Up in Portfolio"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleMoveProject(idx, 'down')}
                        disabled={idx === portfolioData.projects.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-20"
                        title="Move Down in Portfolio"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-[1px] bg-slate-700 mx-1" />

                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setShowProjectModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-950/50"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- Tab 2: Profile & Visual Assets --- */}
        {activeTab === 'profile' && (
          <ProfileEditor
            profile={portfolioData.profile}
            socials={portfolioData.socials}
            authToken={authToken}
            onProfileUpdated={() => {
              showToast('Profile updated!');
              onRefreshData();
            }}
            onSocialsUpdated={() => {
              showToast('Contact info updated!');
              onRefreshData();
            }}
          />
        )}

        {/* --- Tab 3: Messages & Leads --- */}
        {activeTab === 'messages' && (
          <MessagesInbox
            messages={inquiries}
            authToken={authToken}
            onRefresh={fetchMessages}
          />
        )}
      </main>

      {/* Project Add/Edit Modal */}
      {showProjectModal && (
        <ProjectFormModal
          project={editingProject}
          categories={portfolioData.categories}
          authToken={authToken}
          onClose={() => setShowProjectModal(false)}
          onSaved={() => {
            setShowProjectModal(false);
            showToast('Project saved successfully!');
            onRefreshData();
          }}
        />
      )}
    </div>
  );
};
