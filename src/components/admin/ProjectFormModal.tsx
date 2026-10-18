import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Video, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import type { Project, CategoryItem } from '../../types/portfolio.ts';

interface ProjectFormModalProps {
  project: Project | null;
  categories: CategoryItem[];
  authToken: string;
  onClose: () => void;
  onSaved: (project: Project) => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  categories,
  authToken,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(project);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    category: '2d-animation',
    shortDescription: '',
    coverImage: '',
    videoUrl: '',
    galleryImages: [],
    softwareUsed: ['Adobe Animate CC'],
    productionNotes: '',
    featured: false,
    order: 1,
    isDemo: false,
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newTool, setNewTool] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        galleryImages: project.galleryImages || [],
        softwareUsed: project.softwareUsed || ['Adobe Animate CC'],
      });
    } else {
      setFormData({
        title: '',
        category: categories[0]?.slug || '2d-animation',
        shortDescription: '',
        coverImage: '',
        videoUrl: '',
        galleryImages: [],
        softwareUsed: ['Adobe Animate CC'],
        productionNotes: '',
        featured: false,
        order: 99,
        isDemo: false,
      });
    }
  }, [project, categories]);

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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setErrorMsg('');
    try {
      const url = await uploadFile(file);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setErrorMsg('');
    try {
      const url = await uploadFile(file);
      setFormData((prev) => {
        const next = { ...prev, videoUrl: url };
        // If coverImage is empty, also set coverImage to this video URL so saving is immediately valid
        if (!next.coverImage || !next.coverImage.trim()) {
          next.coverImage = url;
        }
        return next;
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const captureFrameFromVideo = () => {
    const video = document.getElementById('admin-preview-video') as HTMLVideoElement;
    if (!video) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({ ...prev, coverImage: dataUrl }));
      }
    } catch (e) {
      console.warn('Frame capture restricted or unavailable:', e);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    setErrorMsg('');
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...uploadedUrls],
      }));
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const addGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index),
    }));
  };

  const addCustomTool = () => {
    if (!newTool.trim()) return;
    if (!formData.softwareUsed?.includes(newTool.trim())) {
      setFormData((prev) => ({
        ...prev,
        softwareUsed: [...(prev.softwareUsed || []), newTool.trim()],
      }));
    }
    setNewTool('');
  };

  const toggleTool = (toolName: string) => {
    const current = formData.softwareUsed || [];
    if (current.includes(toolName)) {
      setFormData((prev) => ({
        ...prev,
        softwareUsed: current.filter((t) => t !== toolName),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        softwareUsed: [...current, toolName],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.title || !payload.title.trim()) {
      setErrorMsg('Project title is required');
      return;
    }
    if (!payload.coverImage || !payload.coverImage.trim()) {
      if (payload.videoUrl && payload.videoUrl.trim()) {
        payload.coverImage = payload.videoUrl.trim();
      } else {
        setErrorMsg('Cover image or video is required (upload file or paste URL)');
        return;
      }
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const endpoint = isEditing && project
        ? `/api/admin/projects/${project.id}`
        : '/api/admin/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      onSaved(data.project);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const standardTools = [
    'Adobe Animate CC',
    'Adobe Photoshop',
    'Adobe Premiere Pro',
    'Adobe After Effects',
    'AI-assisted creative tools',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-white">
            {isEditing ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Project Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Traditional Boat Journey Animation"
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Category <span className="text-cyan-400">*</span>
              </label>
              <select
                value={formData.category || '2d-animation'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Short Description <span className="text-cyan-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="A concise summary of what was animated or designed..."
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Cover Image Upload / URL */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
              Cover Image / Primary Still <span className="text-cyan-400">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow">
                <Upload className="w-4 h-4" />
                <span>{uploadingCover ? 'Uploading...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400">or paste image URL / SVG data:</span>
            </div>

            <input
              type="text"
              value={formData.coverImage || ''}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://... or /uploads/... or data:image/..."
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />

            {formData.coverImage && (
              <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Video URL or File */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
              Video Showcase (Optional)
            </label>
            <p className="text-[11px] text-slate-400">
              Paste a YouTube link (e.g. youtube.com/watch?v=... or youtu.be/...), Vimeo link, or upload an MP4/WebM file.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>{uploadingVideo ? 'Uploading Video...' : 'Upload MP4 / WebM File'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400">or paste video URL:</span>
            </div>

            <input
              type="text"
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />

            {formData.videoUrl && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                  Live Video Player Preview:
                </span>
                <div className="w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden border border-slate-700 relative shadow-inner">
                  <video
                    id="admin-preview-video"
                    src={formData.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={captureFrameFromVideo}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold hover:bg-cyan-900 transition-colors shadow-sm"
                  >
                    📸 Capture Current Frame as Cover Image
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Play to any moment, pause, and click to set that moment as the artwork still.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Gallery Images */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Additional Gallery Angles & Expressions ({formData.galleryImages?.length || 0})
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition-colors border border-slate-700">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingGallery ? 'Uploading...' : 'Batch Upload Files'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Or paste an image URL to add..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={addGalleryUrl}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 hover:text-white"
              >
                Add
              </button>
            </div>

            {formData.galleryImages && formData.galleryImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-700 group">
                    <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Software Used Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Software Used in this Project
            </label>
            <div className="flex flex-wrap gap-2">
              {standardTools.map((tool) => {
                const isSelected = formData.softwareUsed?.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    {tool}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Add custom tool..."
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
              />
              <button
                type="button"
                onClick={addCustomTool}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200"
              >
                Add Tool
              </button>
            </div>
          </div>

          {/* Production Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Production & Technical Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.productionNotes || ''}
              onChange={(e) => setFormData({ ...formData, productionNotes: e.target.value })}
              placeholder="e.g. Frame rate, rigging details, color palette notes..."
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Toggles: Featured & Demo */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-slate-200">Featured Project</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.isDemo)}
                onChange={(e) => setFormData({ ...formData, isDemo: e.target.checked })}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-slate-200">
                Mark as Demo Content (Easy to identify and remove)
              </span>
            </label>
          </div>

          {/* Save / Cancel */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving Project...' : isEditing ? 'Update Project' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
