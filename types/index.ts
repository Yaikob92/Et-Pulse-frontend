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
  publishedAt: string;
  content?: string;
  mediaUrl?: string;
  comments?: string;
  likesCount: number;
  commentsCount: number;
}
