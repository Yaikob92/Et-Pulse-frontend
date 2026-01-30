import { useAuth } from "@clerk/clerk-expo";
import axios, { Axios, AxiosInstance } from "axios";

const API_BASE_URL = "https://et-pulse-backend.vercel.app/api";

// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add User-Agent to avoid being blocked by Arcjet bot protection
    config.headers["User-Agent"] = "Et-Pulse-Mobile/1.0.0 (Android; iOS)";
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/user/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/user/me"),
  updateProfile: (api: AxiosInstance, data: any) =>
    api.put("/user/profile", data),
  uploadProfilePicture: (api: AxiosInstance, imageUri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    return api.post("/user/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export const newsApi = {
  getAllNews: (api: AxiosInstance) => api.get("/news"),
  getChannelsPost: (api: AxiosInstance, username: string) =>
    api.get(`/news/channel/${username}`),
  likeNews: (api: AxiosInstance, newsId: string) =>
    api.post(`/news/${newsId}/like`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, newsId: string, content: string) =>
    api.post(`/comment/news/${newsId}`, { content }),
  likeComment: (api: AxiosInstance, commentId: string) =>
    api.post(`/comment/${commentId}/like`),
  addReply: (api: AxiosInstance, commentId: string, content: string) =>
    api.post(`/comment/${commentId}/reply`, { content }),
};

export const bookmarkApi = {
  getBookMark: (api: AxiosInstance) => api.get("/news/bookmark"),
  saveNews: (api: AxiosInstance, newsId: string) =>
    api.post(`/news/bookmark/${newsId}`),
};
