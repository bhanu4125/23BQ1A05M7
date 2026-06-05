// utils/logger.ts
// frontend version of the logging middleware
// same Log(stack, level, pkg, message) interface

const BASE = "http://4.224.186.213/evaluation-service";

type Stack   = "backend" | "frontend";
type Level   = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "api" | "component" | "hook" | "page" | "state" | "style" // frontend
  | "auth" | "config" | "middleware" | "utils";               // shared

let token: string | null   = null;
let tokenExpiry: number    = 0;

const creds = {
  email:        process.env.REACT_APP_EMAIL         ?? "",
  name:         process.env.REACT_APP_NAME          ?? "",
  rollNo:       process.env.REACT_APP_ROLL_NO        ?? "",
  accessCode:   process.env.REACT_APP_ACCESS_CODE   ?? "",
  clientID:     process.env.REACT_APP_CLIENT_ID     ?? "",
  clientSecret: process.env.REACT_APP_CLIENT_SECRET ?? "",
};

async function ensureToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (token && now < tokenExpiry - 120) return token;

  const res = await fetch(`${BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });

  if (!res.ok) throw new Error(`auth failed: ${res.status}`);
  const data = await res.json();
  token       = data.access_token as string;
  tokenExpiry = data.expires_in   as number;
  return token;
}

export async function Log(
  stack:   Stack,
  level:   Level,
  pkg:     Package,
  message: string
): Promise<void> {
  try {
    const t = await ensureToken();
    await fetch(`${BASE}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (e) {
    // silently fail - logging should never break the UI
    console.warn("[log] could not send log:", e);
  }
}