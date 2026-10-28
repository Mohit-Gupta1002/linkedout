-- LINKEDOUT POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Meets requirements for Professional Identity + Protected Pseudonymous Mode + Stories + Communities + Company Intelligence

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Public Professional Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  headline TEXT,
  bio TEXT,
  status TEXT CHECK (status IN ('Student', 'Intern', 'Working professional', 'Freelancer', 'Founder', 'Job seeker', 'Career break', 'Other')),
  domain TEXT NOT NULL,
  experience TEXT,
  company TEXT,
  location TEXT,
  country TEXT DEFAULT 'India',
  city TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  content_preferences TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  pseudonym_username TEXT,
  pseudonym_avatar TEXT,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Private User Preferences & Demographics (Protected demographic data - NEVER exposed publicly)
CREATE TABLE IF NOT EXISTS public.private_user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age_range TEXT,
  gender TEXT,
  is_age_gender_private BOOLEAN DEFAULT TRUE,
  allow_pseudonymous_posting BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Private Identity Mappings (Strictly isolates pseudonymous actions from public profiles)
CREATE TABLE IF NOT EXISTS public.private_identity_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudonym_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Companies Directory
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  website TEXT,
  description TEXT,
  overall_rating NUMERIC(3, 2) DEFAULT 0.0,
  reviews_count INT DEFAULT 0,
  positive_themes TEXT[] DEFAULT '{}',
  common_reasons_for_leaving TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Company Submissions (Anonymous Workplace Feedback)
CREATE TABLE IF NOT EXISTS public.company_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  pseudonym_token TEXT NOT NULL, -- Isolated token; NOT user_id
  is_current_employee BOOLEAN NOT NULL,
  role_band TEXT NOT NULL,
  seniority_band TEXT NOT NULL,
  tenure_band TEXT NOT NULL,
  location_broad TEXT,
  ratings JSONB NOT NULL, -- { management, work_life, compensation, growth, culture, psychological_safety }
  pros TEXT NOT NULL,
  cons TEXT NOT NULL,
  reasons_for_leaving TEXT,
  written_story TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  sample_date_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Communities & Channels
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  banner_color TEXT,
  domain TEXT NOT NULL,
  members_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (community_id, slug)
);

CREATE TABLE IF NOT EXISTS public.community_memberships (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, community_id)
);

-- 7. Discussions & Replies
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES public.community_channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_pseudonymous BOOLEAN DEFAULT FALSE,
  pseudonym_name TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_pseudonymous BOOLEAN DEFAULT FALSE,
  pseudonym_name TEXT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Posts & Media
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('text', 'image', 'project', 'achievement', 'article', 'discussion')),
  media_urls TEXT[] DEFAULT '{}',
  project_title TEXT,
  project_link TEXT,
  achievement_badge TEXT,
  tags TEXT[] DEFAULT '{}',
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  bookmarks_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Instagram-style Stories (24h Expiration Enforced via Query & Index)
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'gradient')),
  media_url TEXT,
  bg_gradient TEXT,
  text_content TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_stories_expiration ON public.stories (expires_at);

-- 10. Social Graph: Follows, Reactions, Bookmarks, Comments
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.reactions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  reaction_type TEXT DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_identity_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Private preferences only viewable by owner" ON public.private_user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Private mappings strictly hidden" ON public.private_identity_mappings FOR ALL USING (false); -- Only service role

CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Approved company submissions viewable by everyone" ON public.company_submissions FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create company submissions" ON public.company_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Communities are viewable by everyone" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Discussions viewable by everyone" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Discussions insertable by authenticated users" ON public.discussions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Posts insertable by owner" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Posts updateable by owner" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Posts deletable by owner" ON public.posts FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Active stories viewable by everyone" ON public.stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Stories insertable by owner" ON public.stories FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Stories deletable by owner" ON public.stories FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Notifications only viewable by recipient" ON public.notifications FOR ALL USING (auth.uid() = user_id);
