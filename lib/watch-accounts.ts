import fs from "fs";
import path from "path";

export interface WatchAccount {
  id: string; // X API user ID
  username: string; // @username (without @)
  name: string; // display name
  added_at: string;
}

const DATA_PATH = path.join(process.cwd(), "data", "watch-accounts.json");

function readData(): { accounts: WatchAccount[] } {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { accounts: [] };
  }
}

function writeData(data: { accounts: WatchAccount[] }) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function getWatchAccounts(): WatchAccount[] {
  return readData().accounts;
}

export function addWatchAccount(account: WatchAccount): WatchAccount {
  const data = readData();
  // 重複チェック
  if (data.accounts.some((a) => a.id === account.id)) {
    return account;
  }
  data.accounts.push(account);
  writeData(data);
  return account;
}

export function removeWatchAccount(accountId: string): boolean {
  const data = readData();
  const before = data.accounts.length;
  data.accounts = data.accounts.filter((a) => a.id !== accountId);
  if (data.accounts.length < before) {
    writeData(data);
    return true;
  }
  return false;
}
