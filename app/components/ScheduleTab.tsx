"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Trash2,
  Send,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Check,
  Pencil,
} from "lucide-react";

interface QueueItem {
  id: string;
  text: string;
  status: "pending" | "posted";
  created_at: string;
  posted_at?: string;
  scheduled_date?: string;
  scheduled_time?: string;
}

interface Settings {
  schedule_slots: string[];
}

function getJSTToday(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split("T")[0];
}

function formatDateJP(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日 (${days[d.getDay()]})`;
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export default function ScheduleTab() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getJSTToday());
  const [postingId, setPostingId] = useState<string | null>(null);
  const [swapSource, setSwapSource] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [qRes, sRes] = await Promise.all([
        fetch("/api/queue"),
        fetch("/api/settings"),
      ]);
      const qData = await qRes.json();
      const sData: Settings = await sRes.json();
      setQueue(qData.queue || []);
      setSlots(sData.schedule_slots || []);
    } catch {
      console.error("Failed to fetch data");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getItemForSlot = (time: string): QueueItem | null => {
    return (
      queue.find(
        (item) =>
          item.status === "pending" &&
          item.scheduled_date === selectedDate &&
          item.scheduled_time === time
      ) || null
    );
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
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: "posted" as const, posted_at: new Date().toISOString() }
              : q
          )
        );
        setMessage("Xに投稿しました！");
      } else {
        setMessage("投稿に失敗しました");
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
    setPostingId(null);
  };

  const handleDelete = async (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch("/api/queue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      fetchData();
    }
  };

  const handleSwap = async (targetId: string) => {
    if (!swapSource || swapSource === targetId) {
      setSwapSource(null);
      return;
    }
    try {
      await fetch("/api/queue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "swap", id1: swapSource, id2: targetId }),
      });
      await fetchData();
      setMessage("スロットを入れ替えました");
    } catch {
      setMessage("入れ替えに失敗しました");
    }
    setSwapSource(null);
  };

  const startEdit = (item: QueueItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await fetch("/api/queue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id: editingId, text: editText }),
      });
      setQueue((prev) =>
        prev.map((q) => (q.id === editingId ? { ...q, text: editText } : q))
      );
      setMessage("保存しました");
    } catch {
      setMessage("保存に失敗しました");
    }
    setEditingId(null);
    setEditText("");
  };

  const unscheduledItems = queue.filter(
    (item) => item.status === "pending" && !item.scheduled_date
  );

  const todayStr = getJSTToday();
  const isToday = selectedDate === todayStr;

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold flex items-center">
          <Calendar className="mr-3 text-green-400" size={28} /> 予約スケジュール
        </h1>
        <p className="text-gray-500 mt-2">
          タイムスロットごとに投稿を管理します。
        </p>
      </header>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-xl text-sm text-center ${
            message.includes("失敗") || message.includes("エラー")
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}
        >
          {message}
        </div>
      )}

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-gray-900/40 border border-gray-800 rounded-2xl p-4">
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-lg font-bold">{formatDateJP(selectedDate)}</p>
          {isToday && (
            <span className="text-xs text-green-400 font-bold">今日</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-3 py-1 text-xs font-bold bg-gray-800 text-gray-300 hover:text-white rounded-lg transition"
            >
              今日
            </button>
          )}
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Swap Mode Banner */}
      {swapSource && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm text-blue-400 text-center">
          入れ替え先を選択してください...{" "}
          <button
            onClick={() => setSwapSource(null)}
            className="underline ml-2"
          >
            キャンセル
          </button>
        </div>
      )}

      {/* Time Slot Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      ) : slots.length === 0 ? (
        <div className="py-16 text-center bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl">
          <p className="text-gray-500 font-medium">
            タイムスロットが設定されていません。
          </p>
          <p className="mt-2 text-gray-600 text-sm">
            「連携設定」からスロットを追加してください
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map((time) => {
            const item = getItemForSlot(time);
            const isSwapTarget = swapSource && item && swapSource !== item.id;

            return (
              <div
                key={time}
                className={`flex items-stretch border rounded-2xl overflow-hidden transition-all ${
                  isSwapTarget
                    ? "border-blue-500 bg-blue-500/5 cursor-pointer"
                    : item
                      ? "border-gray-800 bg-gray-900/40 hover:border-green-500/30"
                      : "border-dashed border-gray-700 bg-gray-900/10"
                }`}
                onClick={() => isSwapTarget && handleSwap(item!.id)}
              >
                {/* Time Label */}
                <div className="w-20 flex items-center justify-center bg-gray-900/60 border-r border-gray-800 shrink-0">
                  <span className="text-sm font-mono font-bold text-blue-400">
                    {time}
                  </span>
                </div>

                {/* Content */}
                {item ? (
                  <div className="flex-1 p-4 min-w-0">
                    {editingId === item.id ? (
                      /* 編集モード */
                      <div className="space-y-3">
                        <textarea
                          className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-gray-200 leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/50 resize-y min-h-[80px]"
                          rows={Math.max(4, Math.ceil(editText.length / 35))}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono ${editText.length > 280 ? "text-red-400 font-bold" : "text-gray-500"}`}>
                            {editText.length}/280
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                              className="px-3 py-1 text-xs text-gray-400 hover:text-white transition"
                            >
                              キャンセル
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                              disabled={editText.length > 280}
                              className="px-3 py-1 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white rounded-lg transition flex items-center space-x-1"
                            >
                              <Check size={12} />
                              <span>保存</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 表示モード - 全文表示 */
                      <>
                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                          {item.text}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs font-mono ${item.text.length > 280 ? "text-red-400 font-bold" : "text-gray-600"}`}>
                            {item.text.length}/280
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(item);
                              }}
                              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-yellow-400 transition"
                              title="編集"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSwapSource(item.id);
                              }}
                              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-blue-400 transition"
                              title="入れ替え"
                            >
                              <ArrowLeftRight size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePost(item);
                              }}
                              disabled={postingId === item.id}
                              className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 transition flex items-center space-x-1"
                            >
                              {postingId === item.id ? (
                                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                              ) : (
                                <>
                                  <Send size={10} />
                                  <span>投稿</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 p-4 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">空きスロット</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Unscheduled Items */}
      {unscheduledItems.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-800">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            未割当の投稿（{unscheduledItems.length}件）
          </h3>
          {unscheduledItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900/20 border border-gray-800/50 rounded-2xl p-4"
            >
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{item.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">
                  {item.text.length}文字
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-gray-500 hover:text-red-400 transition"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
