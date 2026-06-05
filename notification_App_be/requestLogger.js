// requestLogger.js
// logs every incoming request + response status after it finishes

const { Log } = require("./logger");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const status = res.statusCode;

    let level = "info";
    if (status >= 500) level = "error";
    else if (status >= 400) level = "warn";

    Log("backend", level, "middleware",
      `${req.method} ${req.originalUrl} -> ${status} (${ms}ms)`
    ).catch(() => {}); // fire and forget
  });

  next();
}

module.exports = { requestLogger };