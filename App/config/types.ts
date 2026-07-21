export type Post = {
  id: string;
  channelSource: string;
  channelUsername: string;
  originalText: string;
  originalLanguage: 'am' | 'en';
  textAm: string;
  textEn: string;
  category: 'Politics' | 'Business' | 'Sports' | 'Health' | 'Entertainment' | 'International' | 'Neutral';
  importance: 1 | 2 | 3;
  isBreaking: boolean;
  viewCount: number;
  postedAt: string;
  scrapedAt: string;
  status: 'raw' | 'pending_review' | 'published';
  mediaUrl: string | null;
  mediaType: 'photo' | 'document' | null;
  commentCount: number;
};

export type RootStackParamList = {
  Home: undefined;
  Post: { post: Post };
};

// Categories the app supports
export const CATEGORIES = [
  'All',
  'Politics',
  'Business',
  'Sports',
  'Health',
  'Entertainment',
  'International',
  'Neutral'
] as const;

export type Category = typeof CATEGORIES[number];