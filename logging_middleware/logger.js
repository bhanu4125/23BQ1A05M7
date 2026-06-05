let _token = null;
let _tokenExpiry = 0;
let _config = null;
 
const BASE = "http://4.224.186.213/evaluation-service";
 
// valid values as per the spec
const VALID_STACKS   = ["backend", "frontend"];
const VALID_LEVELS   = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  // backend only
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service",
  // frontend only
  "api", "component", "hook", "page", "state", "style",
  // shared
  "auth", "config", "middleware", "utils"
];
 
async function refreshToken() {
  const res = await fetch(`${BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email:        _config.email,
      name:         _config.name,
      rollNo:       _config.rollNo,
      accessCode:   _config.accessCode,
      clientID:     _config.clientID,
      clientSecret: _config.clientSecret,
    }),
  });
 
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`auth failed (${res.status}): ${body}`);
  }
 
  const data = await res.json();
  _token       = data.access_token;
  _tokenExpiry = data.expires_in; // unix timestamp
}
 
async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  // refresh if missing or expiring in next 2 minutes
  if (!_token || now >= _tokenExpiry - 120) {
    await refreshToken();
  }
  return _token;
}
 
/**
 * initLogger - call once at app startup
 * @param {object} config - { email, name, rollNo, accessCode, clientID, clientSecret }
 */
function initLogger(config) {
  _config      = config;
  _token       = null;
  _tokenExpiry = 0;
}
 
/**
 * Log(stack, level, pkg, message)
 * main function - matches the required signature from the spec
 *
 * @param {"backend"|"frontend"} stack
 * @param {"debug"|"info"|"warn"|"error"|"fatal"} level
 * @param {string} pkg  - must be one of the allowed package values
 * @param {string} message
 */
async function Log(stack, level, pkg, message) {
  if (!_config) {
    console.warn("[log] initLogger() not called yet, skipping");
    return null;
  }
 
  // guard against typos - will print a warning but still try to send
  if (!VALID_STACKS.includes(stack))   console.warn(`[log] unknown stack: ${stack}`);
  if (!VALID_LEVELS.includes(level))   console.warn(`[log] unknown level: ${level}`);
  if (!VALID_PACKAGES.includes(pkg))   console.warn(`[log] unknown package: ${pkg}`);
 
  try {
    const token = await getToken();
 
    const res = await fetch(`${BASE}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack:   stack,
        level:   level,
        package: pkg,
        message: message,
      }),
    });
 
    if (!res.ok) {
      const txt = await res.text();
      console.error(`[log] server rejected log (${res.status}): ${txt}`);
      return null;
    }
 
    return await res.json(); // { logID, message }
  } catch (err) {
    // dont crash the app just because logging failed
    console.error("[log] error sending log:", err.message);
    return null;
  }
}
 
module.exports = { Log, initLogger };