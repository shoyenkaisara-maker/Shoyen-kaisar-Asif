import type { ParsedVideo, Project, ClientInquiry } from '../types/portfolio.ts';

/**
 * Determines whether a URL or path is a video file or video provider link
 */
export function isVideoMedia(url: string | undefined): boolean {
  if (!url || !url.trim()) return false;
  const clean = url.trim().toLowerCase();
  
  // Extension check (ignoring query strings)
  const pathWithoutQuery = clean.split('?')[0];
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.m4v', '.mkv', '.ogv'];
  if (videoExtensions.some((ext) => pathWithoutQuery.endsWith(ext))) {
    return true;
  }

  // Direct video types
  if (
    clean.startsWith('data:video/') ||
    clean.startsWith('blob:') ||
    clean.includes('/uploads/') && (clean.includes('.mp4') || clean.includes('.webm') || clean.includes('.mov'))
  ) {
    return true;
  }

  // Video platforms
  if (
    clean.includes('youtube.com') ||
    clean.includes('youtu.be') ||
    clean.includes('vimeo.com') ||
    clean.includes('drive.google.com/file')
  ) {
    return true;
  }

  return false;
}

/**
 * Parses video URL to determine provider and appropriate embed or direct streaming URL
 */
export function parseVideoEmbed(url: string | undefined): ParsedVideo {
  if (!url || !url.trim()) {
    return { type: 'none', embedUrl: null, rawUrl: '' };
  }

  const cleanUrl = url.trim();
  const lowerUrl = cleanUrl.toLowerCase();

  // YouTube matchers:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = cleanUrl.match(youtubeRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      rawUrl: cleanUrl,
    };
  }

  // Vimeo matchers:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]+\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/;
  const vimeoMatch = cleanUrl.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      rawUrl: cleanUrl,
    };
  }

  // Google Drive video links:
  // - https://drive.google.com/file/d/FILE_ID/view...
  const gdriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdriveMatch = cleanUrl.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'youtube', // Can be rendered in iframe
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
      rawUrl: cleanUrl,
    };
  }

  // Direct video file (case-insensitive extension check, /uploads/, blob, or data:video)
  const pathWithoutQuery = lowerUrl.split('?')[0];
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.m4v', '.mkv', '.ogv'];
  const hasVideoExtension = videoExtensions.some((ext) => pathWithoutQuery.endsWith(ext));

  if (
    hasVideoExtension ||
    lowerUrl.startsWith('data:video/') ||
    lowerUrl.startsWith('blob:') ||
    lowerUrl.includes('/uploads/')
  ) {
    return {
      type: 'direct',
      embedUrl: cleanUrl,
      rawUrl: cleanUrl,
    };
  }

  // Fallback: If it's a valid http URL or absolute upload path, allow direct HTML5 video playback
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('/uploads/')) {
    return {
      type: 'direct',
      embedUrl: cleanUrl,
      rawUrl: cleanUrl,
    };
  }

  return {
    type: 'none',
    embedUrl: null,
    rawUrl: cleanUrl,
  };
}

/**
 * Filter and sort projects by category and query
 */
export function filterProjects(
  projects: Project[],
  categorySlug: string = 'all',
  searchQuery: string = ''
): Project[] {
  if (!Array.isArray(projects)) return [];

  const query = searchQuery.trim().toLowerCase();

  return projects
    .filter((proj) => {
      // Category filter
      const matchesCategory =
        categorySlug === 'all' || proj.category === categorySlug;
      if (!matchesCategory) return false;

      // Search query filter
      if (!query) return true;

      const titleMatch = proj.title.toLowerCase().includes(query);
      const descMatch = proj.shortDescription.toLowerCase().includes(query);
      const softwareMatch = proj.softwareUsed.some((s) =>
        s.toLowerCase().includes(query)
      );
      const notesMatch = (proj.productionNotes || '')
        .toLowerCase()
        .includes(query);

      return titleMatch || descMatch || softwareMatch || notesMatch;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Validate project creation/update
 */
export function validateProjectInput(data: Partial<Project>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!data.title || !data.title.trim()) {
    errors.push('Project title is required');
  }
  if (!data.category || !data.category.trim()) {
    errors.push('Project category is required');
  }
  if (!data.shortDescription || !data.shortDescription.trim()) {
    errors.push('Short description is required');
  }
  if (!data.coverImage || !data.coverImage.trim()) {
    errors.push('Cover image URL or upload is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate client inquiry contact form
 */
export function validateInquiryInput(data: Partial<ClientInquiry>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Please enter your full name (at least 2 characters)');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.push('Please enter a valid email address');
  }
  if (!data.projectType || !data.projectType.trim()) {
    errors.push('Please select a project type');
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Please share a brief project description (at least 10 characters)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
