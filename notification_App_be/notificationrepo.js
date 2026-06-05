// repository/notification.repository.js
// in-memory store using a Map - good enough for the eval
// swap this out for a real db later if needed

const { v4: uuidv4 } = require("uuid");
const { Log } = require("../config/logger");

// our "database"
const db = new Map();

async function getAll(userId) {
  await Log("backend", "debug", "repository", `getAll called - userId=${userId || "none"}`);
  const all = Array.from(db.values());
  if (userId) {
    return all.filter(n => n.userId === userId);
  }
  return all;
}

async function getById(id) {
  const n = db.get(id) || null;
  await Log("backend", "debug", "repository", `getById id=${id} found=${n !== null}`);
  return n;
}

async function create(data) {
  const notification = {
    id:        uuidv4(),
    title:     data.title,
    message:   data.message,
    type:      data.type,
    isRead:    false,
    createdAt: new Date().toISOString(),
    userId:    data.userId,
  };
  db.set(notification.id, notification);
  await Log("backend", "info", "repository", `notification created id=${notification.id} type=${notification.type}`);
  return notification;
}

async function markRead(id) {
  const n = db.get(id);
  if (!n) {
    await Log("backend", "warn", "repository", `markRead - not found id=${id}`);
    return null;
  }
  n.isRead = true;
  db.set(id, n);
  await Log("backend", "info", "repository", `marked read id=${id}`);
  return n;
}

async function markAllRead(userId) {
  let count = 0;
  for (const [id, n] of db.entries()) {
    if (n.userId === userId && !n.isRead) {
      n.isRead = true;
      db.set(id, n);
      count++;
    }
  }
  await Log("backend", "info", "repository", `markAllRead userId=${userId} updated=${count}`);
  return count;
}

async function remove(id) {
  const had = db.has(id);
  db.delete(id);
  await Log("backend", "info", "repository", `delete id=${id} existed=${had}`);
  return had;
}

module.exports = { getAll, getById, create, markRead, markAllRead, remove };