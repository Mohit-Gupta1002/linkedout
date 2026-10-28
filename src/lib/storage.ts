import { 
  UserProfile, Post, Story, Community, Discussion, DiscussionReply, 
  Company, CompanySubmission, NotificationItem 
} from '@/types';
import { 
  CURRENT_USER, INITIAL_STORIES, INITIAL_POSTS, 
  INITIAL_COMMUNITIES, INITIAL_DISCUSSIONS, INITIAL_COMPANIES, INITIAL_NOTIFICATIONS 
} from './mockData';

const STORAGE_KEYS = {
  USER: 'linkedout_current_user',
  POSTS: 'linkedout_posts',
  STORIES: 'linkedout_stories',
  COMMUNITIES: 'linkedout_communities',
  DISCUSSIONS: 'linkedout_discussions',
  DISC_REPLIES: 'linkedout_discussion_replies',
  COMPANIES: 'linkedout_companies',
  COMPANY_SUBMISSIONS: 'linkedout_company_submissions',
  NOTIFICATIONS: 'linkedout_notifications',
  FOLLOWED_USERS: 'linkedout_followed_users',
  THEME: 'linkedout_theme'
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const StorageEngine = {
  // User Profile & Onboarding
  getUser(): UserProfile {
    return safeGetItem<UserProfile>(STORAGE_KEYS.USER, CURRENT_USER);
  },

  updateUser(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    safeSetItem(STORAGE_KEYS.USER, updated);
    return updated;
  },

  completeOnboarding(data: Partial<UserProfile>): UserProfile {
    return this.updateUser({
      ...data,
      onboarding_completed: true
    });
  },

  // Posts
  getPosts(): Post[] {
    return safeGetItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  },

  addPost(postData: Omit<Post, 'id' | 'created_at' | 'likes_count' | 'comments_count' | 'bookmarks_count' | 'shares_count'>): Post {
    const posts = this.getPosts();
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      bookmarks_count: 0,
      shares_count: 0,
      is_liked: false,
      is_bookmarked: false
    };
    const updated = [newPost, ...posts];
    safeSetItem(STORAGE_KEYS.POSTS, updated);
    return newPost;
  },

  toggleLikePost(postId: string): Post | null {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) return null;
    const post = posts[index];
    const isLiked = !post.is_liked;
    const updatedPost: Post = {
      ...post,
      is_liked: isLiked,
      likes_count: isLiked ? post.likes_count + 1 : Math.max(0, post.likes_count - 1)
    };
    posts[index] = updatedPost;
    safeSetItem(STORAGE_KEYS.POSTS, posts);
    return updatedPost;
  },

  toggleBookmarkPost(postId: string): Post | null {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) return null;
    const post = posts[index];
    const isBookmarked = !post.is_bookmarked;
    const updatedPost: Post = {
      ...post,
      is_bookmarked: isBookmarked,
      bookmarks_count: isBookmarked ? post.bookmarks_count + 1 : Math.max(0, post.bookmarks_count - 1)
    };
    posts[index] = updatedPost;
    safeSetItem(STORAGE_KEYS.POSTS, posts);
    return updatedPost;
  },

  deletePost(postId: string): boolean {
    const posts = this.getPosts();
    const filtered = posts.filter(p => p.id !== postId);
    safeSetItem(STORAGE_KEYS.POSTS, filtered);
    return true;
  },

  // Stories (enforcing 24h expiration!)
  getStories(): Story[] {
    const stories = safeGetItem<Story[]>(STORAGE_KEYS.STORIES, INITIAL_STORIES);
    const now = new Date();
    // Exclude expired stories
    const activeStories = stories.filter(s => new Date(s.expires_at) > now);
    if (activeStories.length !== stories.length) {
      safeSetItem(STORAGE_KEYS.STORIES, activeStories);
    }
    return activeStories;
  },

  addStory(storyData: {
    media_type: 'image' | 'gradient';
    media_url?: string;
    bg_gradient?: string;
    text_content?: string;
    caption?: string;
  }): Story {
    const user = this.getUser();
    const stories = this.getStories();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    
    const newStory: Story = {
      id: `story_${Date.now()}`,
      author_id: user.id,
      author_name: user.display_name,
      author_username: user.username,
      author_avatar: user.avatar_url,
      media_type: storyData.media_type,
      media_url: storyData.media_url,
      bg_gradient: storyData.bg_gradient,
      text_content: storyData.text_content,
      caption: storyData.caption,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      seen: false
    };

    const updated = [newStory, ...stories];
    safeSetItem(STORAGE_KEYS.STORIES, updated);
    return newStory;
  },

  markStorySeen(storyId: string): void {
    const stories = this.getStories();
    const updated = stories.map(s => s.id === storyId ? { ...s, seen: true } : s);
    safeSetItem(STORAGE_KEYS.STORIES, updated);
  },

  deleteStory(storyId: string): void {
    const stories = this.getStories();
    const filtered = stories.filter(s => s.id !== storyId);
    safeSetItem(STORAGE_KEYS.STORIES, filtered);
  },

  // Communities
  getCommunities(): Community[] {
    return safeGetItem<Community[]>(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES);
  },

  getCommunityBySlug(slug: string): Community | undefined {
    return this.getCommunities().find(c => c.slug === slug);
  },

  toggleJoinCommunity(communityId: string): Community | null {
    const communities = this.getCommunities();
    const index = communities.findIndex(c => c.id === communityId);
    if (index === -1) return null;
    const comm = communities[index];
    const isJoined = !comm.is_joined;
    const updated: Community = {
      ...comm,
      is_joined: isJoined,
      members_count: isJoined ? comm.members_count + 1 : Math.max(0, comm.members_count - 1)
    };
    communities[index] = updated;
    safeSetItem(STORAGE_KEYS.COMMUNITIES, communities);
    return updated;
  },

  // Discussions
  getDiscussions(communityId?: string): Discussion[] {
    const discussions = safeGetItem<Discussion[]>(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
    if (communityId) {
      return discussions.filter(d => d.community_id === communityId);
    }
    return discussions;
  },

  getDiscussionById(id: string): Discussion | undefined {
    return this.getDiscussions().find(d => d.id === id);
  },

  addDiscussion(data: {
    community_id: string;
    community_slug: string;
    channel_id: string;
    channel_name: string;
    title: string;
    content: string;
    tags: string[];
    is_pseudonymous: boolean;
  }): Discussion {
    const user = this.getUser();
    const discussions = this.getDiscussions();
    const newDiscussion: Discussion = {
      id: `disc_${Date.now()}`,
      community_id: data.community_id,
      community_slug: data.community_slug,
      channel_id: data.channel_id,
      channel_name: data.channel_name,
      author_id: user.id,
      author_name: data.is_pseudonymous ? (user.pseudonym_username || 'Verified Contributor') : user.display_name,
      author_username: data.is_pseudonymous ? (user.pseudonym_username || 'anonymous_contributor') : user.username,
      author_avatar: data.is_pseudonymous ? (user.pseudonym_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80') : user.avatar_url,
      is_pseudonymous: data.is_pseudonymous,
      pseudonym_name: data.is_pseudonymous ? (user.pseudonym_username || 'Protected Identity') : undefined,
      title: data.title,
      content: data.content,
      tags: data.tags,
      likes_count: 0,
      replies_count: 0,
      is_liked: false,
      is_bookmarked: false,
      created_at: new Date().toISOString()
    };
    const updated = [newDiscussion, ...discussions];
    safeSetItem(STORAGE_KEYS.DISCUSSIONS, updated);
    return newDiscussion;
  },

  toggleLikeDiscussion(id: string): Discussion | null {
    const list = this.getDiscussions();
    const index = list.findIndex(d => d.id === id);
    if (index === -1) return null;
    const disc = list[index];
    const isLiked = !disc.is_liked;
    const updated: Discussion = {
      ...disc,
      is_liked: isLiked,
      likes_count: isLiked ? disc.likes_count + 1 : Math.max(0, disc.likes_count - 1)
    };
    list[index] = updated;
    safeSetItem(STORAGE_KEYS.DISCUSSIONS, list);
    return updated;
  },

  // Discussion Replies
  getDiscussionReplies(discussionId: string): DiscussionReply[] {
    const replies = safeGetItem<DiscussionReply[]>(STORAGE_KEYS.DISC_REPLIES, [
      {
        id: 'reply_1',
        discussion_id: 'disc_1',
        author_id: 'usr_priya',
        author_name: 'Dr. Priya Venkatesh',
        author_username: 'priya_ai',
        author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        is_pseudonymous: false,
        content: 'Having an explicit "Non-Goals" section at the very top cuts discussion time by at least 50%. It forces authors to narrow the scope before debate starts.',
        likes_count: 18,
        is_liked: true,
        created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      },
      {
        id: 'reply_2',
        discussion_id: 'disc_1',
        author_id: 'usr_rohit',
        author_name: 'Rohit Kulkarni',
        author_username: 'rohit_k',
        author_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        is_pseudonymous: false,
        content: 'We also add an "Operational Checklist" to RFCs: monitoring alerts, rollback strategy, and capacity limits. If that section is blank, the RFC is incomplete.',
        likes_count: 12,
        is_liked: false,
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ]);
    return replies.filter(r => r.discussion_id === discussionId);
  },

  addDiscussionReply(discussionId: string, content: string, isPseudonymous: boolean): DiscussionReply {
    const user = this.getUser();
    const allReplies = safeGetItem<DiscussionReply[]>(STORAGE_KEYS.DISC_REPLIES, []);
    const newReply: DiscussionReply = {
      id: `reply_${Date.now()}`,
      discussion_id: discussionId,
      author_id: user.id,
      author_name: isPseudonymous ? (user.pseudonym_username || 'Protected Engineer') : user.display_name,
      author_username: isPseudonymous ? (user.pseudonym_username || 'pseudonymous_user') : user.username,
      author_avatar: isPseudonymous ? (user.pseudonym_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80') : user.avatar_url,
      is_pseudonymous: isPseudonymous,
      pseudonym_name: isPseudonymous ? (user.pseudonym_username || 'Verified IC') : undefined,
      content,
      likes_count: 0,
      is_liked: false,
      created_at: new Date().toISOString()
    };
    safeSetItem(STORAGE_KEYS.DISC_REPLIES, [...allReplies, newReply]);

    // Increment discussion replies count
    const discussions = this.getDiscussions();
    const discIndex = discussions.findIndex(d => d.id === discussionId);
    if (discIndex !== -1) {
      discussions[discIndex].replies_count += 1;
      safeSetItem(STORAGE_KEYS.DISCUSSIONS, discussions);
    }

    return newReply;
  },

  // Companies & Workplace Experience
  getCompanies(): Company[] {
    return safeGetItem<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  },

  getCompanyBySlug(slug: string): Company | undefined {
    return this.getCompanies().find(c => c.slug === slug);
  },

  getCompanySubmissions(companyId?: string): CompanySubmission[] {
    const submissions = safeGetItem<CompanySubmission[]>(STORAGE_KEYS.COMPANY_SUBMISSIONS, [
      {
        id: 'sub_1',
        company_id: 'comp_razorcloud',
        company_name: 'RazorCloud Systems',
        is_current_employee: true,
        role_band: 'Software Engineering',
        seniority_band: 'Senior / Staff',
        tenure_band: '2–4 years',
        location_broad: 'Bengaluru, India',
        ratings: {
          management: 4.5,
          work_life: 4.0,
          compensation: 4.8,
          growth: 4.6,
          culture: 4.5,
          psychological_safety: 4.7
        },
        pros: 'Extreme engineering ownership. Team members are encouraged to write design proposals and challenge architectural decisions without hierarchy blocking you.',
        cons: 'Can get fast-paced during Q3 enterprise rollouts. On-call compensation is high but rotations are demanding.',
        status: 'approved',
        sample_date_range: 'Last 12 months',
        created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'sub_2',
        company_id: 'comp_zenfin',
        company_name: 'ZenFin Technologies',
        is_current_employee: false,
        role_band: 'Product Management',
        seniority_band: 'Mid-level',
        tenure_band: '1–2 years',
        location_broad: 'Mumbai, India',
        ratings: {
          management: 3.5,
          work_life: 3.0,
          compensation: 4.5,
          growth: 4.0,
          culture: 3.5,
          psychological_safety: 3.4
        },
        pros: 'Market reputation is stellar. If you ship features here, you will learn how to handle multi-crore payment volumes and compliance.',
        cons: 'Strict in-office requirements with little flexibility. Leadership changes priorities rapidly based on regulatory swings.',
        reasons_for_leaving: 'Sought better work-life balance and remote flexibility.',
        status: 'approved',
        sample_date_range: 'Last 6 months',
        created_at: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString()
      }
    ]);
    if (companyId) {
      return submissions.filter(s => s.company_id === companyId);
    }
    return submissions;
  },

  addCompanySubmission(data: Omit<CompanySubmission, 'id' | 'created_at' | 'status'>): CompanySubmission {
    const list = this.getCompanySubmissions();
    const newSubmission: CompanySubmission = {
      ...data,
      id: `sub_${Date.now()}`,
      status: 'approved', // Moderation passes for demonstration
      sample_date_range: 'Submitted today',
      created_at: new Date().toISOString()
    };
    const updated = [newSubmission, ...list];
    safeSetItem(STORAGE_KEYS.COMPANY_SUBMISSIONS, updated);
    return newSubmission;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return safeGetItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  markNotificationRead(id: string): void {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
    safeSetItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsRead(): void {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => ({ ...n, is_read: true }));
    safeSetItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  getUnreadNotificationsCount(): number {
    return this.getNotifications().filter(n => !n.is_read).length;
  },

  // Social Graph / Follows
  getFollowedUserIds(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.FOLLOWED_USERS, ['usr_priya', 'usr_rohit', 'usr_ananya']);
  },

  toggleFollowUser(userId: string): boolean {
    const list = this.getFollowedUserIds();
    const isFollowing = list.includes(userId);
    const updated = isFollowing ? list.filter(id => id !== userId) : [...list, userId];
    safeSetItem(STORAGE_KEYS.FOLLOWED_USERS, updated);
    return !isFollowing;
  },

  isFollowingUser(userId: string): boolean {
    return this.getFollowedUserIds().includes(userId);
  }
};
