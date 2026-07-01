export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface Channel {
  _id: string;
  telegram_channel_id: number;
  name: string;
  username: string;
  profile_pic?: string;
  description?: string;
  subscribers_count: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  _id: string;
  telegram_channel_id?: number;
  telegram_message_id?: number;
  channel_id?: Channel | string; // Reference to populated Channel

  // Content
  title?: string;
  content: string;
  raw_text?: string;

  // Categorization
  category?: string;
  tags?: string[];
  language?: string;

  // Nested structures
  engagement?: {
    views: number;
    forwards: number;
  };
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
  }[];
  source?: {
    platform: string;
    url?: string;
  };

  status: 'published' | 'draft' | 'deleted' | 'pending' | 'rejected';

  // Cached counters and UI status
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isLiked: boolean;

  // Dates
  published_at?: string;
  scraped_at?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  comments?: CommentType[];
}

export interface CommentType {
  _id: string;
  user: User;
  news: NewsItem;
  username: string;
  profilePicture: string;
  content: string;
  likes: string[];
  parentComment?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  news: T[];
  currentPage: number;
  totalPages: number;
  totalNews: number;
}
