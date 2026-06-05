// api/notificationApi.ts

import axios from "axios";
import { Log } from "../utils/logger";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// log every request going out
client.interceptors.request.use((config) => {
  Log("frontend", "debug", "api", `${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// log responses + errors
client.interceptors.response.use(
  (res) => {
    Log("frontend", "info", "api", `${res.status} ${res.config.url}`);
    return res;
  },
  (err) => {
    const status = err.response?.status ?? "network error";
    Log("frontend", "error", "api", `${status} ${err.config?.url} - ${err.message}`);
    return Promise.reject(err);
  }
);

export type NotifType = "info" | "success" | "warning" | "error";

export interface Notification {
  id:        string;
  title:     string;
  message:   string;
  type:      NotifType;
  isRead:    boolean;
  createdAt: string;
  userId:    string;
}

export interface CreatePayload {
  title:   string;
  message: string;
  type:    NotifType;
  userId:  string;
}

export const notifApi = {
  getAll: async (userId?: string): Promise<Notification[]> => {
    const params = userId ? { userId } : {};
    const { data } = await client.get("/notifications", { params });
    return data.data;
  },

  create: async (payload: CreatePayload): Promise<Notification> => {
    const { data } = await client.post("/notifications", payload);
    return data.data;
  },

  markRead: async (id: string): Promise<Notification> => {
    const { data } = await client.patch(`/notifications/${id}/read`);
    return data.data;
  },

  markAllRead: async (userId: string): Promise<void> => {
    await client.patch("/notifications/read-all", { userId });
  },

  remove: async (id: string): Promise<void> => {
    await client.delete(`/notifications/${id}`);
  },
};