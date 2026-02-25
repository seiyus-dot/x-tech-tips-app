import { promises as fs } from "fs";
import path from "path";

export interface Settings {
  schedule_slots: string[];
  auto_generate_when_empty: boolean;
  projects_enabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  schedule_slots: ["09:00", "15:00", "20:00", "23:00"],
  auto_generate_when_empty: true,
  projects_enabled: true,
};

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

async function ensureSettingsFile(): Promise<void> {
  try {
    await fs.access(SETTINGS_PATH);
  } catch {
    await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  }
}

export async function getSettings(): Promise<Settings> {
  await ensureSettingsFile();
  const data = await fs.readFile(SETTINGS_PATH, "utf-8");
  return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
}

export async function updateSettings(partial: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };

  if (updated.schedule_slots) {
    updated.schedule_slots = updated.schedule_slots
      .filter((s) => /^\d{2}:\d{2}$/.test(s))
      .slice(0, 6)
      .sort();
    const unique = [...new Set(updated.schedule_slots)];
    updated.schedule_slots = unique;
  }

  await fs.writeFile(SETTINGS_PATH, JSON.stringify(updated, null, 2));
  return updated;
}
