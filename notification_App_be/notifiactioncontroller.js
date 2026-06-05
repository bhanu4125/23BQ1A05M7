// controllers/notification.controller.js

const svc = require("../services/notification.service");
const { Log } = require("../config/logger");

// GET /api/notifications?userId=xxx
async function getAll(req, res) {
  try {
    const { userId } = req.query;
    await Log("backend", "info", "controller", `GET /notifications userId=${userId || "all"}`);
    const data = await svc.getAllNotifications(userId);
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    await Log("backend", "error", "controller", `getAll error: ${err.message}`);
    return res.status(500).json({ success: false, message: "something went wrong" });
  }
}

// GET /api/notifications/:id
async function getById(req, res) {
  try {
    const { id } = req.params;
    await Log("backend", "info", "controller", `GET /notifications/${id}`);
    const n = await svc.getNotificationById(id);
    if (!n) return res.status(404).json({ success: false, message: "not found" });
    return res.json({ success: true, data: n });
  } catch (err) {
    await Log("backend", "error", "controller", `getById error: ${err.message}`);
    return res.status(500).json({ success: false, message: "something went wrong" });
  }
}

// POST /api/notifications
async function create(req, res) {
  try {
    await Log("backend", "info", "controller", `POST /notifications body=${JSON.stringify(req.body)}`);
    const n = await svc.createNotification(req.body);
    return res.status(201).json({ success: true, data: n });
  } catch (err) {
    await Log("backend", "warn", "controller", `create validation error: ${err.message}`);
    return res.status(400).json({ success: false, message: err.message });
  }
}

// PATCH /api/notifications/:id/read
async function markRead(req, res) {
  try {
    const { id } = req.params;
    await Log("backend", "info", "controller", `PATCH /notifications/${id}/read`);
    const n = await svc.markNotificationRead(id);
    if (!n) return res.status(404).json({ success: false, message: "not found" });
    return res.json({ success: true, data: n });
  } catch (err) {
    await Log("backend", "error", "controller", `markRead error: ${err.message}`);
    return res.status(500).json({ success: false, message: "something went wrong" });
  }
}

// PATCH /api/notifications/read-all
async function markAllRead(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });
    await Log("backend", "info", "controller", `PATCH /notifications/read-all userId=${userId}`);
    const count = await svc.markAllRead(userId);
    return res.json({ success: true, message: `${count} notifications updated` });
  } catch (err) {
    await Log("backend", "error", "controller", `markAllRead error: ${err.message}`);
    return res.status(500).json({ success: false, message: "something went wrong" });
  }
}

// DELETE /api/notifications/:id
async function remove(req, res) {
  try {
    const { id } = req.params;
    await Log("backend", "info", "controller", `DELETE /notifications/${id}`);
    const deleted = await svc.deleteNotification(id);
    if (!deleted) return res.status(404).json({ success: false, message: "not found" });
    return res.json({ success: true, message: "deleted" });
  } catch (err) {
    await Log("backend", "error", "controller", `delete error: ${err.message}`);
    return res.status(500).json({ success: false, message: "something went wrong" });
  }
}

// GET /api/notifications/unread-count?userId=xxx
async function unreadCount(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });
    const count = await svc.getUnreadCount(userId);
    return res.json({ success: true, count });
  } catch (err) {
    await Log("backend", "error", "controller", `unreadCount error: ${err.message}`);
    return res.status(500).json({ success: false, message: "something went wrong" });
  }
}

module.exports = { getAll, getById, create, markRead, markAllRead, remove, unreadCount };