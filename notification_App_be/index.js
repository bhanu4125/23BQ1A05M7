// src/index.js
require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const { requestLogger }    = require("./requestLogger");
const notificationRoutes   = require("./notificationroutesjs");
const { Log }              = require("./logger");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// health check - handy for testing the server is up
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/notifications", notificationRoutes);

// catch-all 404
app.use((req, res) => {
  Log("backend", "warn", "route", `404 ${req.method} ${req.originalUrl}`).catch(() => {});
  res.status(404).json({ success: false, message: "route not found" });
});

app.listen(PORT, async () => {
  await Log("backend", "info", "config", `server started on port ${PORT}`);
  console.log(`backend running on http://localhost:${PORT}`);
});