import { promises as fs } from "fs";
import path from "path";
import { getSettings } from "./settings";

export interface QueueItem {
  id: string;
  text: string;
  status: "pending" | "posted";
  created_at: string;
  posted_at?: string;
  scheduled_date?: string;
  scheduled_time?: string;
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

async function saveQueue(queue: QueueItem[]): Promise<void> {
  await fs.writeFile(QUEUE_PATH, JSON.stringify({ queue }, null, 2));
}

function getJSTNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

function formatDateJST(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatTimeJST(d: Date): string {
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function assignNextSlot(
  existingQueue: QueueItem[],
  slots: string[]
): { date: string; time: string } | null {
  if (slots.length === 0) return null;

  const jstNow = getJSTNow();
  const currentDate = formatDateJST(jstNow);
  const currentTime = formatTimeJST(jstNow);

  const occupied = new Set(
    existingQueue
      .filter((item) => item.status === "pending" && item.scheduled_date && item.scheduled_time)
      .map((item) => `${item.scheduled_date}_${item.scheduled_time}`)
  );

  for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
    const d = new Date(jstNow.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dateStr = formatDateJST(d);

    for (const slot of slots) {
      if (dayOffset === 0 && slot <= currentTime) continue;
      const key = `${dateStr}_${slot}`;
      if (!occupied.has(key)) {
        return { date: dateStr, time: slot };
      }
    }
  }
  return null;
}

// --- Public API ---

export async function getQueue(): Promise<QueueItem[]> {
  await ensureQueueFile();
  const data = await fs.readFile(QUEUE_PATH, "utf-8");
  const parsed: QueueData = JSON.parse(data);
  return parsed.queue;
}

export async function addToQueue(text: string): Promise<QueueItem> {
  const queue = await getQueue();
  const settings = await getSettings();

  const item: QueueItem = {
    id: crypto.randomUUID(),
    text,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  const slot = assignNextSlot(queue, settings.schedule_slots);
  if (slot) {
    item.scheduled_date = slot.date;
    item.scheduled_time = slot.time;
  }

  queue.push(item);
  await saveQueue(queue);
  return item;
}

export async function addManyToQueue(texts: string[]): Promise<QueueItem[]> {
  const queue = await getQueue();
  const settings = await getSettings();
  const newItems: QueueItem[] = [];

  for (const text of texts) {
    const item: QueueItem = {
      id: crypto.randomUUID(),
      text,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    const allItems = [...queue, ...newItems];
    const slot = assignNextSlot(allItems, settings.schedule_slots);
    if (slot) {
      item.scheduled_date = slot.date;
      item.scheduled_time = slot.time;
    }
    newItems.push(item);
  }

  queue.push(...newItems);
  await saveQueue(queue);
  return newItems;
}

export async function getNextPending(): Promise<QueueItem | null> {
  const queue = await getQueue();
  return queue.find((item) => item.status === "pending") || null;
}

export async function getItemForSlot(date: string, time: string): Promise<QueueItem | null> {
  const queue = await getQueue();
  return (
    queue.find(
      (item) =>
        item.status === "pending" &&
        item.scheduled_date === date &&
        item.scheduled_time === time
    ) || null
  );
}

export async function markAsPosted(id: string): Promise<void> {
  const queue = await getQueue();
  const item = queue.find((item) => item.id === id);
  if (item) {
    item.status = "posted";
    item.posted_at = new Date().toISOString();
    await saveQueue(queue);
  }
}

export async function removeFromQueue(id: string): Promise<void> {
  let queue = await getQueue();
  queue = queue.filter((item) => item.id !== id);
  await saveQueue(queue);
}

export async function updateQueueItem(id: string, text: string): Promise<void> {
  const queue = await getQueue();
  const item = queue.find((item) => item.id === id);
  if (item) {
    item.text = text;
    await saveQueue(queue);
  }
}

export async function swapSlots(id1: string, id2: string): Promise<void> {
  const queue = await getQueue();
  const item1 = queue.find((i) => i.id === id1);
  const item2 = queue.find((i) => i.id === id2);
  if (item1 && item2) {
    const tmpDate = item1.scheduled_date;
    const tmpTime = item1.scheduled_time;
    item1.scheduled_date = item2.scheduled_date;
    item1.scheduled_time = item2.scheduled_time;
    item2.scheduled_date = tmpDate;
    item2.scheduled_time = tmpTime;
    await saveQueue(queue);
  }
}

export async function reassignSlot(id: string, date: string, time: string): Promise<void> {
  const queue = await getQueue();
  const item = queue.find((i) => i.id === id);
  if (item) {
    item.scheduled_date = date;
    item.scheduled_time = time;
    await saveQueue(queue);
  }
}

export async function reassignAllSlots(): Promise<void> {
  const queue = await getQueue();
  const settings = await getSettings();

  const pendingNoSlot = queue.filter(
    (i) => i.status === "pending" && !i.scheduled_date
  );

  for (const item of pendingNoSlot) {
    // Use the full queue (including already-assigned items from this loop)
    const slot = assignNextSlot(queue, settings.schedule_slots);
    if (slot) {
      item.scheduled_date = slot.date;
      item.scheduled_time = slot.time;
    }
  }

  await saveQueue(queue);
}
