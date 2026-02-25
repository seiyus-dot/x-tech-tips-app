import { readFileSync } from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf-8");
    const vars: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      vars[key] = value;
      process.env[key] = value;
    }
    return vars;
  } catch {
    return {};
  }
}

const vars = loadEnv();

export const env = {
  ANTHROPIC_API_KEY: vars.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || "",
  X_API_KEY: vars.X_API_KEY || process.env.X_API_KEY || "",
  X_API_SECRET: vars.X_API_SECRET || process.env.X_API_SECRET || "",
  X_ACCESS_TOKEN: vars.X_ACCESS_TOKEN || process.env.X_ACCESS_TOKEN || "",
  X_ACCESS_TOKEN_SECRET: vars.X_ACCESS_TOKEN_SECRET || process.env.X_ACCESS_TOKEN_SECRET || "",
  CRON_SECRET: vars.CRON_SECRET || process.env.CRON_SECRET || "",
};
