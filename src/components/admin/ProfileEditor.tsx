import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Save, Lock, Shield, User, Image as ImageIcon, Clapperboard, Palette, Video, Repeat, Film, Play, Pause, Volume2, VolumeX, Sparkles, ExternalLink } from 'lucide-react';
import type { ProfileData, SocialLinks } from '../../types/portfolio.ts';

interface ProfileEditorProps {
  profile: ProfileData;
  socials: SocialLinks;
  authToken: string;
  onProfileUpdated: (profile: ProfileData) => void;
  onSocialsUpdated: (socials: SocialLinks) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  socials,
  authToken,
  onProfileUpdated,
  onSocialsUpdated,
}) => {
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);
  const [socialsForm, setSocialsForm] = useState<SocialLinks>(socials);
  
  const [newTool, setNewTool] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [socialsMsg, setSocialsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);

  // Editor Video Preview Player state
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [editorVideoMuted, setEditorVideoMuted] = useState(true);
  const [editorVideoPlaying, setEditorVideoPlaying] = useState(true);

  // Sync internal form state whenever parent props update
  React.useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  React.useEffect(() => {
    setSocialsForm(socials);
  }, [socials]);

  // File upload helper
  const uploadFile = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data.url;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setProfileMsg(null);
    try {
      const url = await uploadFile(file);
      const updatedProfile: ProfileData = {
        ...profileForm,
        logoImage: url,
        logoType: 'custom',
      };
      setProfileForm(updatedProfile);

      // Auto-save immediately to database so media never reverts
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save logo');
      onProfileUpdated(data.profile);
      setProfileMsg({ type: 'success', text: 'Brand logo uploaded and permanently saved!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Logo upload failed' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setProfileMsg(null);
    try {
      const url = await uploadFile(file);
      const updatedProfile = { ...profileForm, avatarImage: url };
      setProfileForm(updatedProfile);
      
      // Auto-save immediately to database so media never reverts
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save avatar');
      onProfileUpdated(data.profile);
      setProfileMsg({ type: 'success', text: 'Avatar uploaded and permanently saved!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Avatar upload failed' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    setProfileMsg(null);
    try {
      const url = await uploadFile(file);
      const updatedProfile = { 
        ...profileForm, 
        heroFeaturedImage: url,
        heroMediaType: 'image' as const
      };
      setProfileForm(updatedProfile);

      // Auto-save immediately to database so media never reverts
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save artwork');
      onProfileUpdated(data.profile);
      setProfileMsg({ type: 'success', text: 'Featured artwork uploaded and permanently saved!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Artwork upload failed' });
    } finally {
      setUploadingHero(false);
    }
  };

  const handleHeroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroVideo(true);
    setProfileMsg(null);
    try {
      const url = await uploadFile(file);
      const updatedProfile = { 
        ...profileForm, 
        heroVideoUrl: url,
        heroMediaType: 'video' as const
      };
      setProfileForm(updatedProfile);

      // Auto-save immediately to database so loop video never reverts
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save loop video');
      onProfileUpdated(data.profile);
      setProfileMsg({ type: 'success', text: 'Hero loop video uploaded and permanently saved!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Video upload failed' });
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const handleSetHeroVideo = async (url: string) => {
    const updatedProfile: ProfileData = {
      ...profileForm,
      heroVideoUrl: url,
      heroMediaType: 'video',
    };
    setProfileForm(updatedProfile);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        onProfileUpdated(data.profile);
        setProfileMsg({ type: 'success', text: 'Looping video activated on hero banner!' });
      }
    } catch (e: any) {
      // Profile form submit will also persist
    }
  };

  const handleToggleEditorPlay = () => {
    if (!heroVideoRef.current) return;
    if (editorVideoPlaying) {
      heroVideoRef.current.pause();
      setEditorVideoPlaying(false);
    } else {
      heroVideoRef.current.play().catch(() => {});
      setEditorVideoPlaying(true);
    }
  };

  const handleToggleEditorMute = () => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.muted = !editorVideoMuted;
    setEditorVideoMuted(!editorVideoMuted);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      onProfileUpdated(data.profile);
      setProfileMsg({ type: 'success', text: 'Profile and About Me updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocials(true);
    setSocialsMsg(null);
    try {
      const res = await fetch('/api/admin/socials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(socialsForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update social channels');
      onSocialsUpdated(data.socials);
      setSocialsMsg({ type: 'success', text: 'Contact & social links updated successfully!' });
    } catch (err: any) {
      setSocialsMsg({ type: 'error', text: err.message });
    } finally {
      setSavingSocials(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      setPasswordMsg({ type: 'success', text: 'Admin password changed successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  const addTool = () => {
    if (!newTool.trim()) return;
    if (!profileForm.tools.includes(newTool.trim())) {
      setProfileForm({
        ...profileForm,
        tools: [...profileForm.tools, newTool.trim()],
      });
    }
    setNewTool('');
  };

  const removeTool = (toolName: string) => {
    setProfileForm({
      ...profileForm,
      tools: profileForm.tools.filter((t) => t !== toolName),
    });
  };

  return (
    <div className="space-y-12">
      {/* 1. Profile & Visual Artworks Editor */}
      <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <span>Artist Profile & Visual Media</span>
            </h3>
            <p className="text-xs text-slate-400">
              Customize the hero title, featured artwork, profile picture, and bio.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>

        {profileMsg && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            profileMsg.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-800 text-rose-300'
          }`}>
            {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        {/* Brand Logo & Navigation Header Design */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-900/60 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span>Brand Logo & Navigation Header Design</span>
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Design what visitors see at the top navigation bar: your custom brand logo, your photo, or default stylized icon.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Live Navbar Sync
              </span>
            </div>
          </div>

          {/* Logo Mode Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
              Header Logo Source:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setProfileForm({ ...profileForm, logoType: 'custom' })}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  (profileForm.logoType === 'custom' || (!profileForm.logoType && profileForm.logoImage))
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-100">Custom Logo / Image</span>
                  <span className="text-[11px] text-slate-400">Upload your logo, drawing, or graphic</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProfileForm({ ...profileForm, logoType: 'avatar' })}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  profileForm.logoType === 'avatar'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-100">Artist Photo (Avatar)</span>
                  <span className="text-[11px] text-slate-400">Use your portrait photo as logo</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProfileForm({ ...profileForm, logoType: 'icon' })}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  profileForm.logoType === 'icon'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-100">Cartoon Icon</span>
                  <span className="text-[11px] text-slate-400">Default cyan Clapperboard badge</span>
                </div>
              </button>
            </div>
          </div>

          {/* If Custom Logo or Image is chosen */}
          {(profileForm.logoType === 'custom' || (!profileForm.logoType && profileForm.logoImage) || profileForm.logoType === undefined) && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                Upload Custom Logo or Picture File:
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingLogo ? 'Uploading Logo...' : 'Upload Logo File (PNG / SVG / JPG / WebP)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">or paste image URL:</span>
              </div>

              <input
                type="text"
                value={profileForm.logoImage || ''}
                onChange={(e) => setProfileForm({ ...profileForm, logoImage: e.target.value, logoType: 'custom' })}
                placeholder="https://... or /uploads/... or data:image/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Subtitle / Brand Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Navbar Brand Subtitle / Tagline
              </label>
              <input
                type="text"
                value={profileForm.brandSubtitle || ''}
                onChange={(e) => setProfileForm({ ...profileForm, brandSubtitle: e.target.value })}
                placeholder="2D Animator & Cartoon Designer"
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500">
                Shown below your name in the top navigation bar and footer.
              </span>
            </div>

            {/* Live Header Preview Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                Live Navbar Header Preview:
              </label>
              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center gap-3 shadow-inner">
                {profileForm.logoType === 'custom' && profileForm.logoImage ? (
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow">
                    <img src={profileForm.logoImage} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  </div>
                ) : profileForm.logoType === 'avatar' && profileForm.avatarImage ? (
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-cyan-500/80 overflow-hidden shrink-0 shadow">
                    <img src={profileForm.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ) : profileForm.logoImage ? (
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow">
                    <img src={profileForm.logoImage} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-slate-950 font-bold shadow shrink-0">
                    <Clapperboard className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <span className="font-extrabold text-sm text-white block">
                    {profileForm.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {profileForm.brandSubtitle || '2D Animator & Cartoon Designer'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Preview & Upload Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Avatar Picture */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
              Profile Picture / Avatar
            </span>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                <img src={profileForm.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} className="hidden" />
                </label>
                <input
                  type="text"
                  value={profileForm.avatarImage}
                  onChange={(e) => setProfileForm({ ...profileForm, avatarImage: e.target.value })}
                  placeholder="Or paste image URL..."
                  className="w-full px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Hero Featured Artwork / Looping Video (Selected Target) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-900/60 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-4 h-4" />
                  <span>Hero Featured Showcase Media (হোমপেজ হিরো ভিডিও / আর্টওয়ার্ক)</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose whether to display an auto-repeating loop animation video or a still artwork on your homepage.
                </p>
              </div>

              {/* Mode Toggle Pills: Video Loop vs Still Image */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...profileForm, heroMediaType: 'video' as const };
                    setProfileForm(updated);
                    handleSetHeroVideo(profileForm.heroVideoUrl || '/uploads/nissan-gtr-r34-skyline_3840x21-1792356186171-78975.mp4');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    profileForm.heroMediaType === 'video' || (!profileForm.heroMediaType && profileForm.heroVideoUrl)
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Loop Video (ভিডিও রিপিট হবে)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileForm({ ...profileForm, heroMediaType: 'image' })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    profileForm.heroMediaType === 'image' || (!profileForm.heroMediaType && !profileForm.heroVideoUrl)
                      ? 'bg-slate-700 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Still Image (স্থির ছবি)</span>
                </button>
              </div>
            </div>

            {/* If Video Loop Option is Selected */}
            {(profileForm.heroMediaType === 'video' || (!profileForm.heroMediaType && profileForm.heroVideoUrl)) ? (
              <div className="space-y-4">
                {/* Upload & Source Options */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-400 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingHeroVideo ? 'Uploading Video...' : 'Upload Video File (MP4 / WebM / MOV)'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                        onChange={handleHeroVideoUpload}
                        disabled={uploadingHeroVideo}
                        className="hidden"
                      />
                    </label>

                    {/* Quick Button for uploaded file */}
                    <button
                      type="button"
                      onClick={() => handleSetHeroVideo('/uploads/nissan-gtr-r34-skyline_3840x21-1792356186171-78975.mp4')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-medium hover:bg-cyan-900/70 transition-colors flex items-center gap-1.5"
                      title="Use the uploaded video file"
                    >
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Use Uploaded Reel Video</span>
                    </button>
                  </div>

                  {/* Video URL Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      Video File URL (Direct Video / Uploaded File):
                    </label>
                    <input
                      type="text"
                      value={profileForm.heroVideoUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, heroVideoUrl: e.target.value, heroMediaType: 'video' })}
                      placeholder="e.g. /uploads/my-animation.mp4 or https://domain.com/reel.mp4"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Poster / Fallback Image */}
                  <div className="space-y-1 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        Video Poster / Thumbnail (ভিডিও লোড হওয়ার আগের স্থির ছবি):
                      </label>
                      <label className="cursor-pointer text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload Poster</span>
                        <input type="file" accept="image/*" onChange={handleHeroUpload} disabled={uploadingHero} className="hidden" />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={profileForm.heroFeaturedImage}
                      onChange={(e) => setProfileForm({ ...profileForm, heroFeaturedImage: e.target.value })}
                      placeholder="Poster image URL..."
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Looping Video Live Interactive Preview Card */}
                {profileForm.heroVideoUrl && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-800/60 shadow-lg space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-cyan-300 font-mono">
                        <Repeat className="w-4 h-4 animate-spin text-cyan-400" />
                        <span>অনবরত রিপিট সক্রিয় (Continuous Auto-Repeat Active)</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-400 font-mono">
                        Auto-plays on loop
                      </span>
                    </div>

                    <div className="relative aspect-video max-w-md mx-auto rounded-xl overflow-hidden bg-black border border-slate-700 shadow-2xl group">
                      <video
                        ref={heroVideoRef}
                        key={profileForm.heroVideoUrl}
                        src={profileForm.heroVideoUrl}
                        poster={profileForm.heroFeaturedImage}
                        autoPlay
                        loop
                        muted={editorVideoMuted}
                        playsInline
                        preload="auto"
                        onPlay={() => setEditorVideoPlaying(true)}
                        onPause={() => setEditorVideoPlaying(false)}
                        className="w-full h-full object-cover"
                      />

                      {/* Floating Preview Controls */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                        <button
                          type="button"
                          onClick={handleToggleEditorMute}
                          className="w-7 h-7 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white hover:text-cyan-400 hover:border-cyan-500 flex items-center justify-center transition-all shadow"
                          title={editorVideoMuted ? 'Unmute preview sound' : 'Mute preview sound'}
                        >
                          {editorVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                        <button
                          type="button"
                          onClick={handleToggleEditorPlay}
                          className="w-7 h-7 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white hover:text-cyan-400 hover:border-cyan-500 flex items-center justify-center transition-all shadow"
                          title={editorVideoPlaying ? 'Pause video' : 'Play video'}
                        >
                          {editorVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />}
                        </button>
                      </div>

                      {/* Bottom live indicator */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] text-slate-200 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Hero Loop Active</span>
                        </span>
                        <span className="text-[10px] text-cyan-300 bg-cyan-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-cyan-800">
                          Adobe Animate CC Reel
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-900/40 text-xs text-slate-300 space-y-1">
                      <p className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>ভিডিওটি হোমপেজে হিরো সেকশনে নিরবচ্ছিন্নভাবে বারবার রিপিট হতে থাকবে।</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Visitors on your website will see this animation reel seamlessly looping with sound toggle and pause controls.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Still Artwork Image Option */
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                    <img src={profileForm.heroFeaturedImage} alt="Hero Art" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold shadow">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingHero ? 'Uploading...' : 'Upload Featured Art'}</span>
                      <input type="file" accept="image/*" onChange={handleHeroUpload} disabled={uploadingHero} className="hidden" />
                    </label>
                    <input
                      type="text"
                      value={profileForm.heroFeaturedImage}
                      onChange={(e) => setProfileForm({ ...profileForm, heroFeaturedImage: e.target.value, heroMediaType: 'image' })}
                      placeholder="Or paste artwork URL..."
                      className="w-full px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Artist Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Professional Title</label>
            <input
              type="text"
              value={profileForm.title}
              onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Hero Headline</label>
          <input
            type="text"
            value={profileForm.heroHeadline}
            onChange={(e) => setProfileForm({ ...profileForm, heroHeadline: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Hero Bio</label>
            <textarea
              rows={3}
              value={profileForm.heroBio}
              onChange={(e) => setProfileForm({ ...profileForm, heroBio: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Hero Sub-Bio</label>
            <textarea
              rows={3}
              value={profileForm.heroSubBio}
              onChange={(e) => setProfileForm({ ...profileForm, heroSubBio: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* About Section Paragraphs */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
            About Me Paragraphs (Official Bio)
          </label>
          <textarea
            rows={2}
            value={profileForm.aboutBio1}
            onChange={(e) => setProfileForm({ ...profileForm, aboutBio1: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
          />
          <textarea
            rows={2}
            value={profileForm.aboutBio2}
            onChange={(e) => setProfileForm({ ...profileForm, aboutBio2: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
          />
          <textarea
            rows={2}
            value={profileForm.aboutBio3}
            onChange={(e) => setProfileForm({ ...profileForm, aboutBio3: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
          />
        </div>

        {/* Tools & Software List */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
            Software and Creative Tools List
          </label>
          <div className="flex flex-wrap gap-2">
            {profileForm.tools.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => removeTool(t)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              placeholder="Add another tool..."
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
            />
            <button
              type="button"
              onClick={addTool}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      {/* 2. Contact & Social Channels Editor */}
      <form onSubmit={handleSaveSocials} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Contact Info & Social Links</span>
            </h3>
            <p className="text-xs text-slate-400">
              Update direct email, WhatsApp phone number, and social profiles.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingSocials}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSocials ? 'Saving...' : 'Save Contact Links'}</span>
          </button>
        </div>

        {socialsMsg && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            socialsMsg.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-800 text-rose-300'
          }`}>
            {socialsMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{socialsMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              value={socialsForm.email}
              onChange={(e) => setSocialsForm({ ...socialsForm, email: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">WhatsApp</label>
            <input
              type="text"
              value={socialsForm.whatsapp}
              onChange={(e) => setSocialsForm({ ...socialsForm, whatsapp: e.target.value })}
              placeholder="+880 1XXXXXXXXX"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">YouTube Channel</label>
            <input
              type="text"
              value={socialsForm.youtube}
              onChange={(e) => setSocialsForm({ ...socialsForm, youtube: e.target.value })}
              placeholder="https://youtube.com/@channel"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">LinkedIn Profile</label>
            <input
              type="text"
              value={socialsForm.linkedin}
              onChange={(e) => setSocialsForm({ ...socialsForm, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Facebook Profile / Page</label>
            <input
              type="text"
              value={socialsForm.facebook}
              onChange={(e) => setSocialsForm({ ...socialsForm, facebook: e.target.value })}
              placeholder="https://facebook.com/username"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Behance / ArtStation (Optional)</label>
            <input
              type="text"
              value={socialsForm.behance || ''}
              onChange={(e) => setSocialsForm({ ...socialsForm, behance: e.target.value })}
              placeholder="https://behance.net/username"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>
        </div>
      </form>

      {/* 3. Security & Password Settings */}
      <form onSubmit={handleSavePassword} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>Admin Authentication & Password</span>
          </h3>
          <p className="text-xs text-slate-400">
            Change your password to protect the portfolio dashboard.
          </p>
        </div>

        {passwordMsg && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            passwordMsg.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-800 text-rose-300'
          }`}>
            {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
        >
          {savingPassword ? 'Updating Password...' : 'Update Admin Password'}
        </button>
      </form>
    </div>
  );
};
