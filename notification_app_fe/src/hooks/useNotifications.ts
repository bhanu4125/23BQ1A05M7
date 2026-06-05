// hooks/useNotifications.ts

import { useState, useEffect, useCallback } from "react";
import { notifApi, Notification, CreatePayload } from "../api/notificationApi";
import { Log } from "../utils/logger";

export function useNotifications(userId: string) {
  const [items,   setItems]   = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Log("frontend", "info", "hook", `useNotifications: loading for ${userId}`);
      const data = await notifApi.getAll(userId);
      setItems(data);
      await Log("frontend", "info", "hook", `useNotifications: got ${data.length} items`);
    } catch (e) {
      setError("Failed to load notifications");
      await Log("frontend", "error", "hook", `useNotifications: fetch failed - ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (payload: CreatePayload) => {
    try {
      await Log("frontend", "info", "hook", `creating notification type=${payload.type}`);
      const n = await notifApi.create(payload);
      setItems(prev => [n, ...prev]);
    } catch (e) {
      await Log("frontend", "error", "hook", `create failed: ${String(e)}`);
      throw e;
    }
  };

  const markRead = async (id: string) => {
    try {
      const updated = await notifApi.markRead(id);
      setItems(prev => prev.map(n => n.id === id ? updated : n));
      await Log("frontend", "info", "hook", `marked read id=${id}`);
    } catch (e) {
      await Log("frontend", "error", "hook", `markRead failed id=${id}`);
    }
  };

  const markAllRead = async () => {
    try {
      await notifApi.markAllRead(userId);
      setItems(prev => prev.map(n => ({ ...n, isRead: true })));
      await Log("frontend", "info", "hook", `all read for userId=${userId}`);
    } catch (e) {
      await Log("frontend", "error", "hook", "markAllRead failed");
    }
  };

  const remove = async (id: string) => {
    try {
      await notifApi.remove(id);
      setItems(prev => prev.filter(n => n.id !== id));
      await Log("frontend", "info", "hook", `deleted id=${id}`);
    } catch (e) {
      await Log("frontend", "error", "hook", `delete failed id=${id}`);
    }
  };

  const unreadCount = items.filter(n => !n.isRead).length;

  return { items, loading, error, unreadCount, create, markRead, markAllRead, remove, refresh: fetchAll };
}
