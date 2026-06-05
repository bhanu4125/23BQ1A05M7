// services/notification.service.js

const repo = require("../repository/notification.repository");
const { isValidType } = require("../domain/notification");
const { Log } = require("../config/logger");

async function getAllNotifications(userId) {
  await Log("backend", "info", "service", `fetching notifications userId=${userId || "all"}`);
  return repo.getAll(userId);
}

async function getNotificationById(id) {
  await Log("backend", "info", "service", `fetching single notification id=${id}`);
  const n = await repo.getById(id);
  if (!n) {
    await Log("backend", "warn", "service", `notification not found id=${id}`);
  }
  return n;
}

async function createNotification(data) {
  const { title, message, type, userId } = data;

  if (!title || !message || !type || !userId) {
    await Log("backend", "warn", "service", "create failed - missing fields");
    throw new Error("title, message, type and userId are all required");
  }

  if (!isValidType(type)) {
    await Log("backend", "error", "service", `invalid type provided: ${type}`);
    throw new Error(`type must be one of: info, success, warning, error`);
  }

  await Log("backend", "info", "service", `creating notification for userId=${userId} type=${type}`);
  return repo.create(data);
}

async function markNotificationRead(id) {
  await Log("backend", "info", "service", `marking read id=${id}`);
  return repo.markRead(id);
}

async function markAllRead(userId) {
  await Log("backend", "info", "service", `marking all read for userId=${userId}`);
  return repo.markAllRead(userId);
}

async function deleteNotification(id) {
  await Log("backend", "info", "service", `deleting id=${id}`);
  return repo.remove(id);
}

async function getUnreadCount(userId) {
  const all = await repo.getAll(userId);
  const count = all.filter(n => !n.isRead).length;
  await Log("backend", "debug", "service", `unread count for userId=${userId} is ${count}`);
  return count;
}

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  getUnreadCount,
};