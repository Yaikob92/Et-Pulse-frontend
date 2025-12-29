export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface NewsItem {
  _id: string;
  channelProfilePic: string;
  channelUsername: string;
  createdAt: string;
  content?: string;
  mediaUrl?: string;
  likes: string[];
  comments?: CommentType[];
  likesCount: number;
  commentsCount: number;
}

export interface CommentType {
  _id: string;
  userId: User;
  newsId: NewsItem;
  username: string;
  profilePicture: string;
  content: string;
  likes: string;
  likesCount: number;
  createdAt: string;
}
