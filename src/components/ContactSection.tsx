import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Phone, Youtube, Linkedin, Facebook, Share2 } from 'lucide-react';
import type { SocialLinks } from '../types/portfolio.ts';

interface ContactSectionProps {
  socials: SocialLinks;
  onInquirySubmitted?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ socials, onInquirySubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '2D Animation Video',
    budgetRange: '$500 - $1,500',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ id: string; message: string } | null>(null);

  const projectTypes = [
    '2D Animation Video',
    'Cartoon Character Design',
    '2D Background Art',
    'Storyboards & Pre-production',
    'Full Cartoon Episode / Series',
    'Other Creative Work',
  ];

  const budgetOptions = [
    'Under $500',
    '$500 - $1,500',
    '$1,500 - $3,000',
    '$3,000 - $5,000',
    '$5,000+',
    'Flexible / Open to Discussion',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setSuccessInfo(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message. Please try again.');
      }

      setStatus('success');
      setSuccessInfo({
        id: data.inquiryId,
        message: data.message,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        projectType: '2D Animation Video',
        budgetRange: '$500 - $1,500',
        message: '',
      });

      if (onInquirySubmitted) {
        onInquirySubmitted();
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error submitting contact request');
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#090D16] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Have a Project in Mind? Let's Work Together.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Looking for a 2D animator, cartoon designer, or background artist for your next project? I'd love to hear about your ideas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          
          {/* Left Column: Direct Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>Direct Contact Details</span>
              </h3>

              {/* Email */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                <a
                  href={`mailto:${socials.email}`}
                  className="text-base sm:text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors block break-all"
                >
                  {socials.email}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp</span>
                <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{socials.whatsapp}</span>
                </p>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Professional Social Profiles
                </span>
                
                <div className="space-y-2 text-sm">
                  {socials.youtube && (
                    <a
                      href={socials.youtube.startsWith('http') ? socials.youtube : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-rose-400 transition-colors p-2 rounded-lg bg-slate-900/60 border border-slate-800"
                    >
                      <Youtube className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{socials.youtube}</span>
                    </a>
                  )}

                  {socials.linkedin && (
                    <a
                      href={socials.linkedin.startsWith('http') ? socials.linkedin : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors p-2 rounded-lg bg-slate-900/60 border border-slate-800"
                    >
                      <Linkedin className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="truncate">{socials.linkedin}</span>
                    </a>
                  )}

                  {socials.facebook && (
                    <a
                      href={socials.facebook.startsWith('http') ? socials.facebook : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors p-2 rounded-lg bg-slate-900/60 border border-slate-800"
                    >
                      <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate">{socials.facebook}</span>
                    </a>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 italic pt-1">
                  * Note: Social links and contact numbers can be configured or updated anytime in the Admin Dashboard.
                </p>
              </div>
            </div>

            {/* Quick response note */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Available for Commission & Studio Work</span>
              </span>
              <p className="text-slate-300">
                Open to freelance contracts, YouTube animated series, children's book pre-vis, and studio production pipelines.
              </p>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5" aria-label="Project Inquiry Form">
                
                {/* Status Messages */}
                {status === 'success' && successInfo && (
                  <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 space-y-1 shadow-lg">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Inquiry Sent Successfully!</span>
                    </div>
                    <p className="text-xs text-emerald-300">{successInfo.message}</p>
                    <p className="text-[11px] font-mono text-emerald-400/80 pt-1">Ref ID: {successInfo.id}</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 flex items-start gap-2 text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-name" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Your Full Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="inquiry-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan / Studio Director"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-email" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="inquiry-email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Project Type & Budget Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-projectType" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Project Type <span className="text-cyan-400">*</span>
                    </label>
                    <select
                      id="inquiry-projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      {projectTypes.map((type, idx) => (
                        <option key={idx} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-budget" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Budget Range (Optional)
                    </label>
                    <select
                      id="inquiry-budget"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      {budgetOptions.map((budget, idx) => (
                        <option key={idx} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Description Message */}
                <div className="space-y-1.5">
                  <label htmlFor="inquiry-message" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Project Description & Requirements <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    required
                    rows={5}
                    placeholder="Tell Asif about your animation requirements, desired duration, style references, timeline, or scope of character/background art..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Sending to Shoyen Kaiser Asif...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Project Inquiry</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-500">
                  Submissions are transmitted securely to Asif's project queue and reviewed directly.
                </p>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
