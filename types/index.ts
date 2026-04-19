export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface NewsItem {
  _id: string;
  telegramId?: string;
  sourceUrl?: string;

  // Channel info
  channelName?: string;
  channelUsername: string;
  channelProfilePic: string;

  // Content
  content?: string;
  title?: string;
  summary?: string;

  // Media
  mediaUrl?: string;
  videoUrl?: string;
  coverImage?: string;

  // Categorization
  category?: string;
  tags?: string[];
  language?: string;

  // Engagement
  views: number;
  likesCount: number;
  commentsCount: number;
  forwards: number;
  isLiked: boolean;

  // Source
  source?: 'telegram' | 'cms';

  // Dates
  createdAt: string;
  publishedAt?: string;

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
