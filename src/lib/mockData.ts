import { UserProfile, Post, Story, Community, Discussion, Company, NotificationItem } from '@/types';

export const CURRENT_USER: UserProfile = {
  id: 'usr_me',
  username: 'aarav_sharma',
  display_name: 'Aarav Sharma',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  headline: 'Full-Stack & Systems Engineer | Building high-throughput distributed tools | Ex-Flipkart Intern',
  bio: 'Obsessed with developer experience, distributed databases, and high-performance web systems. Open-source contributor. Currently exploring rust & local-first architectures.',
  status: 'Working professional',
  domain: 'Software Engineering',
  experience: '0–2 years',
  company: 'Bengaluru Distributed Labs',
  location: 'Bengaluru, India',
  country: 'India',
  city: 'Bengaluru',
  skills: ['TypeScript', 'Next.js', 'Go', 'Rust', 'PostgreSQL', 'Redis', 'Docker'],
  interests: ['Software Engineering', 'AI', 'Startups', 'Career Growth', 'Workplace Culture'],
  content_preferences: ['Professional insights', 'Projects and achievements', 'Photos and Stories', 'Startup and technology news'],
  portfolio_url: 'https://github.com/aaravsharma',
  pseudonym_username: 'binary_monk',
  pseudonym_avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
  followers_count: 842,
  following_count: 312,
  created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  onboarding_completed: true,
  age_range: '21–24',
  gender: 'Man',
  is_age_gender_private: true
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    author_id: 'usr_ananya',
    author_name: 'Ananya Roy',
    author_username: 'ananya_ux',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    caption: 'Whiteboarding the new design token system for our team. Design debt cleared! 🎨',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 21 * 3600 * 1000).toISOString(),
    seen: false,
  },
  {
    id: 'story_2',
    author_id: 'usr_vikram',
    author_name: 'Vikramaditya Nair',
    author_username: 'vikram_founder',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    media_type: 'gradient',
    bg_gradient: 'linear-gradient(135deg, #102A43 0%, #0A66C2 100%)',
    text_content: 'We just onboarded our 10,000th developer on the platform! Huge milestone for our seed-stage team in Gurgaon 🚀✨',
    caption: 'Day 240 of building.',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    seen: false,
  },
  {
    id: 'story_3',
    author_id: 'usr_priya',
    author_name: 'Dr. Priya Venkatesh',
    author_username: 'priya_ai',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Speaking at AI Summit Bengaluru on edge-computing inference latency reduction ⚡',
    created_at: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 15 * 3600 * 1000).toISOString(),
    seen: false,
  },
  {
    id: 'story_4',
    author_id: 'usr_rohan',
    author_name: 'Rohan Mehta',
    author_username: 'rohan_fintech',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    media_type: 'gradient',
    bg_gradient: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
    text_content: 'UPI transactions grew 44% YoY. Building payment gateways in India is like running a real-time data river!',
    caption: 'Fintech insights',
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    seen: true,
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author_id: 'usr_priya',
    author_name: 'Dr. Priya Venkatesh',
    author_username: 'priya_ai',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    author_headline: 'Principal AI Scientist @ DeepMatrix | PhD IIT Madras',
    author_domain: 'AI & Machine Learning',
    post_type: 'project',
    project_title: 'Quantized LLM Engine for Mobile Devices',
    project_link: 'https://github.com/deepmatrix/quant-core',
    content: `Excited to open-source our work on low-bit quantization for on-device reasoning models!\n\nWe reduced RAM consumption by 58% while maintaining 96.4% of benchmark accuracy on Hindi & English code-mixing benchmarks. Running 7B models locally without cloud dependencies changes privacy entirely.\n\nKey learnings from the benchmarks:\n1. 4-bit AWQ provides the ideal Pareto efficiency for mobile ARM chips.\n2. Speculative decoding speeds up perceived generation by 2.4x.\n\nCheck out the repo and benchmarks below!`,
    media_urls: [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['ArtificialIntelligence', 'MachineLearning', 'OpenSource', 'DeepTech'],
    community_id: 'comm_ai',
    community_name: 'AI & Machine Learning',
    likes_count: 348,
    comments_count: 42,
    bookmarks_count: 94,
    shares_count: 28,
    is_liked: false,
    is_bookmarked: false,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'post_2',
    author_id: 'usr_ananya',
    author_name: 'Ananya Roy',
    author_username: 'ananya_ux',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    author_headline: 'Staff Product Designer @ FinScale | Design Systems Advocate',
    author_domain: 'Design & UX',
    post_type: 'image',
    content: `Visual storytelling and professional trust are not opposites. \n\nWhen we redesigned the transaction flow for 4 million users, we realized users needed clear visual feedback—haptic confirmations, meaningful micro-animations, and instant status breakdowns. \n\nHere is a side-by-side progression of how we reduced user anxiety during high-value bank transfers. Clean surfaces, high-contrast states, and no unnecessary friction.`,
    media_urls: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['DesignSystems', 'UXResearch', 'FintechDesign', 'VisualDesign'],
    community_id: 'comm_design',
    community_name: 'Design & UX',
    likes_count: 219,
    comments_count: 19,
    bookmarks_count: 67,
    shares_count: 14,
    is_liked: true,
    is_bookmarked: true,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'post_3',
    author_id: 'usr_rohit',
    author_name: 'Rohit Kulkarni',
    author_username: 'rohit_k',
    author_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    author_headline: 'Lead Site Reliability Engineer @ RazorCloud | Kubernetes & Observability',
    author_domain: 'Software Engineering',
    post_type: 'achievement',
    achievement_badge: '99.999% Uptime Year Celebration',
    content: `Surviving the festive peak season without a single P0 incident! 🛡️\n\nHandling 45,000 requests/sec with zero customer-facing downtime was possible because of three deliberate architecture choices:\n\n1. Aggressive circuit breakers on downstream microservices.\n2. Regional fallback caches in Redis Cluster.\n3. Automated canary rollouts that abort within 15 seconds if error rate exceeds 0.05%.\n\nProud of the entire infrastructure team in Bengaluru! Time for some team dosa and filter coffee ☕`,
    tags: ['DevOps', 'DistributedSystems', 'EngineeringExcellence', 'CloudArch'],
    community_id: 'comm_se',
    community_name: 'Software Engineering',
    likes_count: 512,
    comments_count: 63,
    bookmarks_count: 142,
    shares_count: 45,
    is_liked: false,
    is_bookmarked: false,
    created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    id: 'post_4',
    author_id: 'usr_anonymous_demo',
    author_name: 'Engineering Director',
    author_username: 'cloud_architect_anon',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    author_headline: 'Protected Pseudonymous Voice | 12+ Yrs Experience',
    author_domain: 'Software Engineering',
    is_pseudonymous: true,
    pseudonym_name: 'Verified Enterprise Lead',
    post_type: 'text',
    content: `Honest workplace advice for engineers considering early-stage startups in India vs Series C+:\n\n1. If a founder tells you "we are like a family", immediately ask to see their runway, vesting schedule, and attrition over the last 12 months.\n2. In a 0-to-1 startup, you will learn 3x faster, but the compensation discount must be backed by real equity value or accelerated learning.\n3. Protect your mental health: 70-hour weeks without equity upside is not hustle, it is exploitation.\n\nBuild things that solve real pain points, find mentors who challenge you with kindness, and never sacrifice your integrity for a valuation.`,
    tags: ['WorkplaceCulture', 'CareerAdvice', 'StartupLife', 'Transparency'],
    community_id: 'comm_culture',
    community_name: 'People & Workplace Culture',
    likes_count: 890,
    comments_count: 124,
    bookmarks_count: 310,
    shares_count: 88,
    is_liked: false,
    is_bookmarked: true,
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm_ai',
    slug: 'ai-machine-learning',
    name: 'AI & Machine Learning',
    description: 'Researchers, ML engineers, LLM builders, and data practitioners discussing models, architectures, and deployments.',
    icon: 'Brain',
    banner_color: 'linear-gradient(135deg, #102A43 0%, #0A66C2 100%)',
    domain: 'AI & Machine Learning',
    members_count: 14280,
    is_joined: true,
    channels: [
      { id: 'ch_ai_general', name: 'general', slug: 'general', description: 'General AI discussions, model releases, and news' },
      { id: 'ch_ai_projects', name: 'projects-and-code', slug: 'projects', description: 'Showcase models, fine-tunes, and inference pipelines' },
      { id: 'ch_ai_career', name: 'career-advice', slug: 'career-advice', description: 'AI interview prep, research roles, and transitions' },
      { id: 'ch_ai_salaries', name: 'salary-discussions', slug: 'salary-discussions', description: 'Anonymous & transparent compensation insights in ML' }
    ]
  },
  {
    id: 'comm_se',
    slug: 'software-engineering',
    name: 'Software Engineering',
    description: 'Systems, backend architectures, frontend craftsmanship, distributed storage, and developer workflows.',
    icon: 'Code2',
    banner_color: 'linear-gradient(135deg, #0A66C2 0%, #084e96 100%)',
    domain: 'Software Engineering',
    members_count: 28400,
    is_joined: true,
    channels: [
      { id: 'ch_se_general', name: 'general', slug: 'general', description: 'Architecture, libraries, and engineering trends' },
      { id: 'ch_se_systems', name: 'distributed-systems', slug: 'distributed-systems', description: 'High throughput, latency, concurrency, and DBs' },
      { id: 'ch_se_career', name: 'career-growth', slug: 'career-growth', description: 'Senior to Staff transitions, IC vs EM pathways' },
      { id: 'ch_se_culture', name: 'workplace-culture', slug: 'workplace-culture', description: 'On-call rotations, code reviews, and remote work' }
    ]
  },
  {
    id: 'comm_design',
    slug: 'design-ux',
    name: 'Design & UX',
    description: 'Product designers, UI engineers, and UX researchers crafting intuitive and expressive digital products.',
    icon: 'Palette',
    banner_color: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 100%)',
    domain: 'Design & UX',
    members_count: 11200,
    is_joined: false,
    channels: [
      { id: 'ch_des_general', name: 'general', slug: 'general', description: 'Design critique, UI patterns, and design tools' },
      { id: 'ch_des_systems', name: 'design-systems', slug: 'design-systems', description: 'Figma tokens, accessible components, and code parity' },
      { id: 'ch_des_portfolios', name: 'portfolio-reviews', slug: 'portfolio-reviews', description: 'Feedback on portfolios and case studies' }
    ]
  },
  {
    id: 'comm_culture',
    slug: 'workplace-culture',
    name: 'People & Workplace Culture',
    description: 'Transparent discussions on work-life balance, psychological safety, leadership, and compensation.',
    icon: 'Users',
    banner_color: 'linear-gradient(135deg, #8134AF 0%, #DD2A7B 100%)',
    domain: 'Human Resources',
    members_count: 19800,
    is_joined: true,
    channels: [
      { id: 'ch_cul_general', name: 'general', slug: 'general', description: 'General workplace conversations and experiences' },
      { id: 'ch_cul_burnout', name: 'work-life-balance', slug: 'work-life-balance', description: 'Navigating crunch times, burnout, and boundaries' },
      { id: 'ch_cul_compensation', name: 'compensation-trends', slug: 'compensation-trends', description: 'Band benchmarks, stock grants, and appraisals' }
    ]
  },
  {
    id: 'comm_startups',
    slug: 'startups-entrepreneurship',
    name: 'Startups & Entrepreneurship',
    description: 'Founders, early employees, and operators building 0-to-1 ventures in South Asia and globally.',
    icon: 'Rocket',
    banner_color: 'linear-gradient(135deg, #059669 0%, #102A43 100%)',
    domain: 'Entrepreneurship',
    members_count: 16500,
    is_joined: false,
    channels: [
      { id: 'ch_st_general', name: 'founders-lounge', slug: 'founders-lounge', description: 'Fundraising, customer validation, and hiring' },
      { id: 'ch_st_early', name: 'early-employees', slug: 'early-employees', description: 'Navigating ESOPs, risk, and startup autonomy' }
    ]
  }
];

export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 'disc_1',
    community_id: 'comm_se',
    community_slug: 'software-engineering',
    channel_id: 'ch_se_career',
    channel_name: 'career-growth',
    author_id: 'usr_me',
    author_name: 'Aarav Sharma',
    author_username: 'aarav_sharma',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    is_pseudonymous: false,
    title: 'How do you structure technical design docs (RFCs) that people actually read and debate?',
    content: `In our team, RFCs often either get rubber-stamped with "looks good" or turn into endless 80-comment bike-shedding threads about syntax.\n\nWhat templates or rituals have you seen work well for RFCs at scale? Specifically for:\n1. Explicitly listing non-goals upfront.\n2. Framing tradeoffs rather than pretending one architecture is purely superior.\n3. Setting a firm review time-box.`,
    tags: ['RFC', 'EngineeringProcess', 'Communication'],
    likes_count: 67,
    replies_count: 14,
    is_liked: false,
    is_bookmarked: false,
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'disc_2',
    community_id: 'comm_culture',
    community_slug: 'workplace-culture',
    channel_id: 'ch_cul_burnout',
    channel_name: 'work-life-balance',
    author_id: 'usr_anon_worker',
    author_name: 'Pseudonymous Contributor',
    author_username: 'staff_dev_anon',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    is_pseudonymous: true,
    pseudonym_name: 'Bengaluru Dev (Verified IC)',
    title: 'How do you handle unofficial expectations to respond to Slack messages after 9 PM?',
    content: `Our manager doesn't explicitly mandate 24/7 availability, but every release week, threads continue until midnight. Those who don't reply often get subtle hints during sprint reviews or lower velocity scoring.\n\nFor those of you who successfully set boundaries without hurting your promotion prospects, what was your exact strategy?`,
    tags: ['Boundaries', 'WorkLifeBalance', 'PsychologicalSafety'],
    likes_count: 142,
    replies_count: 31,
    is_liked: true,
    is_bookmarked: true,
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_razorcloud',
    slug: 'razorcloud-systems',
    name: 'RazorCloud Systems',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    industry: 'Cloud Infrastructure & Developer Tools',
    location: 'Bengaluru, India (Hybrid)',
    website: 'https://razorcloud.example.com',
    description: 'Providing edge serverless compute and distributed database infrastructure for high-scale enterprise apps across APAC.',
    overall_rating: 4.4,
    reviews_count: 68,
    scores: {
      management: 4.3,
      work_life: 4.1,
      compensation: 4.7,
      career_growth: 4.5,
      culture: 4.4,
      workload: 3.8,
      psychological_safety: 4.6,
      learning: 4.8
    },
    positive_themes: [
      'High engineering standards and mentorship',
      'Strong ESOP liquidity and competitive cash compensation',
      'Encouragement of open source contributions'
    ],
    common_reasons_for_leaving: [
      'On-call intensity during major regional shopping holidays',
      'High bar for promotion to Staff level'
    ]
  },
  {
    id: 'comp_zenfin',
    slug: 'zenfin-technologies',
    name: 'ZenFin Technologies',
    logo_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80',
    industry: 'Fintech & Digital Payments',
    location: 'Mumbai, India (In-office)',
    website: 'https://zenfin.example.com',
    description: 'UPI rails, automated merchant reconciliation, and treasury management for Tier-1 Indian commercial brands.',
    overall_rating: 3.9,
    reviews_count: 112,
    scores: {
      management: 3.7,
      work_life: 3.3,
      compensation: 4.5,
      career_growth: 4.2,
      culture: 3.8,
      workload: 3.1,
      psychological_safety: 3.6,
      learning: 4.5
    },
    positive_themes: [
      'Massive transaction volume and resume credibility',
      'Above-market base pay and annual bonuses',
      'Great domain learning in regulatory and banking integrations'
    ],
    common_reasons_for_leaving: [
      'Strict 5-day in-office attendance policy',
      'Frequent weekend production releases due to legacy bank downtimes'
    ]
  },
  {
    id: 'comp_deepmatrix',
    slug: 'deepmatrix-ai',
    name: 'DeepMatrix AI Labs',
    logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
    industry: 'Artificial Intelligence & Applied ML',
    location: 'Gurugram & San Francisco (Remote First)',
    website: 'https://deepmatrix.example.com',
    description: 'Building multi-modal frontier models and fine-tuning infrastructure for multilingual enterprise workflows.',
    overall_rating: 4.7,
    reviews_count: 44,
    scores: {
      management: 4.8,
      work_life: 4.5,
      compensation: 4.9,
      career_growth: 4.7,
      culture: 4.8,
      workload: 4.0,
      psychological_safety: 4.9,
      learning: 5.0
    },
    positive_themes: [
      'Access to state-of-the-art GPU clusters',
      'True remote-first autonomy with flexible hours',
      'Collaborative culture without ego'
    ],
    common_reasons_for_leaving: [
      'Occasional timezone overlap with US research team'
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    user_id: 'usr_me',
    type: 'like',
    actor_name: 'Ananya Roy',
    actor_username: 'ananya_ux',
    actor_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    title: 'Reaction to your post',
    message: 'liked your discussion on RFC engineering processes.',
    link: '/discussions/disc_1',
    is_read: false,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_2',
    user_id: 'usr_me',
    type: 'follow',
    actor_name: 'Vikramaditya Nair',
    actor_username: 'vikram_founder',
    actor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'New Follower',
    message: 'started following your professional updates.',
    link: '/profile/vikram_founder',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'notif_3',
    user_id: 'usr_me',
    type: 'comment',
    actor_name: 'Dr. Priya Venkatesh',
    actor_username: 'priya_ai',
    actor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    title: 'New Reply',
    message: 'replied: "Having explicit non-goals cuts review time in half. Great point."',
    link: '/discussions/disc_1',
    is_read: true,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  }
];
