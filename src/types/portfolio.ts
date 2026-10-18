export type ProjectCategory = 
  | '2d-animation' 
  | 'character-design' 
  | 'background-art' 
  | 'storyboards' 
  | 'other';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory | string;
  shortDescription: string;
  coverImage: string;
  videoUrl?: string;
  galleryImages: string[];
  softwareUsed: string[];
  productionNotes?: string;
  featured?: boolean;
  order: number;
  isDemo?: boolean;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  experience: string;
  training: string;
  primarySoftware: string;
  heroHeadline: string;
  heroBio: string;
  heroSubBio: string;
  heroFeaturedImage: string;
  heroMediaType?: 'video' | 'image';
  heroVideoUrl?: string;
  avatarImage: string;
  logoImage?: string;
  logoType?: 'custom' | 'avatar' | 'icon';
  brandSubtitle?: string;
  aboutBio1: string;
  aboutBio2: string;
  aboutBio3: string;
  tools: string[];
}

export interface SocialLinks {
  email: string;
  whatsapp: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  behance?: string;
  artstation?: string;
}

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange?: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface PortfolioData {
  profile: ProfileData;
  socials: SocialLinks;
  categories: CategoryItem[];
  projects: Project[];
}

export type VideoType = 'youtube' | 'vimeo' | 'direct' | 'none';

export interface ParsedVideo {
  type: VideoType;
  embedUrl: string | null;
  rawUrl: string;
}
