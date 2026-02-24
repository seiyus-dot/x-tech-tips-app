import { promises as fs } from "fs";
import path from "path";

export interface QueueItem {
  id: string;
  text: string;
  status: "pending" | "posted";
  created_at: string;
  posted_at?: string;
}

interface QueueData {
  queue: QueueItem[];
}

const QUEUE_PATH = path.join(process.cwd(), "data", "queue.json");

async function ensureQueueFile(): Promise<void> {
  try {
    await fs.access(QUEUE_PATH);
  } catch {
    await fs.mkdir(path.dirname(QUEUE_PATH), { recursive: true });
    await fs.writeFile(QUEUE_PATH, JSON.stringify({ queue: [] }, null, 2));
  }
}

export async function getQueue(): Promise<QueueItem[]> {
  await ensureQueueFile();
  const data = await fs.readFile(QUEUE_PATH, "utf-8");
  const parsed: QueueData = JSON.parse(data);
  return parsed.queue;
}

export async function addToQueue(text: string): Promise<QueueItem> {
  const queue = await getQueue();
  const item: QueueItem = {
    id: crypto.randomUUID(),
    text,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  queue.push(item);
  await fs.writeFile(QUEUE_PATH, JSON.stringify({ queue }, null, 2));
  return item;
}

export async function addManyToQueue(texts: string[]): Promise<QueueItem[]> {
  const queue = await getQueue();
  const items: QueueItem[] = texts.map((text) => ({
    id: crypto.randomUUID(),
    text,
    status: "pending",
    created_at: new Date().toISOString(),
  }));
  queue.push(...items);
  await fs.writeFile(QUEUE_PATH, JSON.stringify({ queue }, null, 2));
  return items;
}

export async function getNextPending(): Promise<QueueItem | null> {
  const queue = await getQueue();
  return queue.find((item) => item.status === "pending") || null;
}

export async function markAsPosted(id: string): Promise<void> {
  const queue = await getQueue();
  const item = queue.find((item) => item.id === id);
  if (item) {
    item.status = "posted";
    item.posted_at = new Date().toISOString();
    await fs.writeFile(QUEUE_PATH, JSON.stringify({ queue }, null, 2));
  }
}

export async function removeFromQueue(id: string): Promise<void> {
  let queue = await getQueue();
  queue = queue.filter((item) => item.id !== id);
  await fs.writeFile(QUEUE_PATH, JSON.stringify({ queue }, null, 2));
}

export async function updateQueueItem(id: string, text: string): Promise<void> {
  const queue = await getQueue();
  const item = queue.find((item) => item.id === id);
  if (item) {
    item.text = text;
    await fs.writeFile(QUEUE_PATH, JSON.stringify({ queue }, null, 2));
  }
}
