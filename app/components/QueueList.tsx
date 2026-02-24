"use client";

import { useState, useEffect, useCallback } from "react";

interface QueueItem {
  id: string;
  text: string;
  status: "pending" | "posted";
  created_at: string;
  posted_at?: string;
}

export default function QueueList({ refreshKey }: { refreshKey?: number }) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/queue");
      const data = await res.json();
      setQueue(data.queue || []);
    } catch {
      console.error("Failed to fetch queue");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue, refreshKey]);

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/queue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setQueue(queue.filter((item) => item.id !== id));
    } catch {
      console.error("Failed to delete");
    }
  };

  const handlePost = async (item: QueueItem) => {
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.text }),
      });
      if (res.ok) {
        setQueue(queue.map((q) =>
          q.id === item.id ? { ...q, status: "posted" as const } : q
        ));
      }
    } catch {
      console.error("Failed to post");
    }
  };

  const pendingItems = queue.filter((item) => item.status === "pending");
  const postedItems = queue.filter((item) => item.status === "posted");

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-1">📋 予約投稿キュー</h2>
      <p className="text-gray-400 text-sm mb-4">
        予約中: {pendingItems.length}件 / 投稿済み: {postedItems.length}件
      </p>

      {loading ? (
        <p className="text-gray-400 text-sm">読み込み中...</p>
      ) : pendingItems.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          予約中の投稿はありません
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {pendingItems.map((item, i) => (
            <div key={item.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-xs text-gray-500">#{i + 1}</span>
                  <p className="text-white text-sm mt-1">{item.text}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {new Date(item.created_at).toLocaleString("ja-JP")}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handlePost(item)}
                    className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    投稿
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
