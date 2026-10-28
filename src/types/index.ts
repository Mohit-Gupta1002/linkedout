export type ProfessionalStatus = 
  | 'Student'
  | 'Intern'
  | 'Working professional'
  | 'Freelancer'
  | 'Founder'
  | 'Job seeker'
  | 'Career break'
  | 'Other';

export type ProfessionalDomain =
  | 'Software Engineering'
  | 'AI & Machine Learning'
  | 'Data Science'
  | 'Product Management'
  | 'Design & UX'
  | 'Finance & Fintech'
  | 'Marketing'
  | 'Business Development'
  | 'Human Resources'
  | 'Consulting'
  | 'Entrepreneurship'
  | 'Legal'
  | 'Operations'
  | 'Other';

export type ExperienceLevel =
  | 'Student / no professional experience'
  | 'Intern'
  | '0–2 years'
  | '3–5 years'
  | '6–10 years'
  | '10+ years';

export interface UserProfile {
  id: string;
  email?: string;
  username: string;
  display_name: string;
  avatar_url: string;
  headline: string;
  bio: string;
  status: ProfessionalStatus;
  domain: ProfessionalDomain;
  experience: ExperienceLevel;
  company?: string;
  location: string;
  country: string;
  city?: string;
  skills: string[];
  interests: string[];
  content_preferences: string[];
  portfolio_url?: string;
  pseudonym_username?: string;
  pseudonym_avatar?: string;
  followers_count: number;
  following_count: number;
  created_at: string;
  onboarding_completed: boolean;
  
  /* Private demographic attributes - never exposed publicly */
  age_range?: string;
  gender?: string;
  is_age_gender_private?: boolean;
}

export type PostType = 'text' | 'image' | 'project' | 'achievement' | 'article' | 'discussion';

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_avatar: string;
  author_headline: string;
  author_domain: ProfessionalDomain;
  is_pseudonymous?: boolean;
  pseudonym_name?: string;
  content: string;
  post_type: PostType;
  media_urls?: string[];
  project_title?: string;
  project_link?: string;
  achievement_badge?: string;
  tags?: string[];
  community_id?: string;
  community_name?: string;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  shares_count: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_avatar: string;
  author_headline?: string;
  is_pseudonymous?: boolean;
  pseudonym_name?: string;
  content: string;
  likes_count: number;
  is_liked?: boolean;
  created_at: string;
}

export interface Story {
  id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_avatar: string;
  media_url?: string;
  media_type: 'image' | 'gradient';
  bg_gradient?: string;
  text_content?: string;
  caption?: string;
  created_at: string;
  expires_at: string;
  seen?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  banner_color: string;
  domain: ProfessionalDomain;
  members_count: number;
  is_joined?: boolean;
  channels: Channel[];
}

export interface Discussion {
  id: string;
  community_id: string;
  community_slug: string;
  channel_id: string;
  channel_name: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_avatar: string;
  is_pseudonymous: boolean;
  pseudonym_name?: string;
  title: string;
  content: string;
  tags: string[];
  likes_count: number;
  replies_count: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  created_at: string;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_avatar: string;
  is_pseudonymous: boolean;
  pseudonym_name?: string;
  content: string;
  likes_count: number;
  is_liked?: boolean;
  created_at: string;
}

export interface CompanyCategoryScores {
  management: number; // 1-5
  work_life: number;
  compensation: number;
  career_growth: number;
  culture: number;
  workload: number;
  psychological_safety: number;
  learning: number;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo_url: string;
  industry: string;
  location: string;
  website: string;
  description: string;
  overall_rating: number;
  reviews_count: number;
  scores: CompanyCategoryScores;
  positive_themes: string[];
  common_reasons_for_leaving: string[];
}

export interface CompanySubmission {
  id: string;
  company_id: string;
  company_name: string;
  is_current_employee: boolean;
  role_band: string;
  seniority_band: string;
  tenure_band: string;
  location_broad?: string;
  ratings: {
    management: number;
    work_life: number;
    compensation: number;
    growth: number;
    culture: number;
    psychological_safety: number;
  };
  pros: string;
  cons: string;
  reasons_for_leaving?: string;
  written_story?: string;
  status: 'approved' | 'pending';
  sample_date_range?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'follow' | 'like' | 'comment' | 'community' | 'mention' | 'story_reaction' | 'moderation';
  actor_name: string;
  actor_username: string;
  actor_avatar: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
}
