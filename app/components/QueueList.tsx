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
  const [postingId, setPostingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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
    setQueue(queue.filter((item) => item.id !== id));
    try {
      await fetch("/api/queue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      fetchQueue();
    }
  };

  const handlePost = async (item: QueueItem) => {
    setPostingId(item.id);
    setMessage("");
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
        setMessage("✅ Xに投稿しました！");
      } else {
        setMessage("❌ 投稿に失敗しました");
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
    }
    setPostingId(null);
  };

  const pendingItems = queue.filter((item) => item.status === "pending");
  const postedItems = queue.filter((item) => item.status === "posted");

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">予約投稿キュー</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          予約中 {pendingItems.length}件 ・ 投稿済み {postedItems.length}件
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-xl text-sm text-center ${
            message.startsWith("✅")
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      ) : pendingItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-gray-500 text-sm">予約中の投稿はありません</p>
          <p className="text-gray-600 text-xs mt-1">
            「ネタ最適化」や「投稿企画」で追加できます
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {pendingItems.map((item, i) => (
            <div
              key={item.id}
              className="bg-gray-900 rounded-xl p-4 border border-gray-700 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-gray-500 bg-gray-800 px-2 py-0.5 rounded-md mt-0.5 shrink-0">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm leading-relaxed">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-gray-500">
                      {item.text.length}文字 ・{" "}
                      {new Date(item.created_at).toLocaleDateString("ja-JP")}
                    </span>
                    <div className="flex gap-1.5 ml-auto">
                      <button
                        onClick={() => handlePost(item)}
                        disabled={postingId === item.id}
                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition"
                      >
                        {postingId === item.id ? "投稿中..." : "投稿する"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
