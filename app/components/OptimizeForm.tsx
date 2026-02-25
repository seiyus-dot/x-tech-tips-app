"use client";

import { useState } from "react";
import TweetPreview from "./TweetPreview";

export default function OptimizeForm() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [postingIndex, setPostingIndex] = useState<number | null>(null);
  const [queuingIndex, setQueuingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSuggestions([]);
    setMessage("");
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage(`❌ ${data.error}`);
      } else {
        setSuggestions(data.suggestions || []);
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
    }
    setLoading(false);
  };

  const handlePost = async (index: number) => {
    setPostingIndex(index);
    setMessage("");
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: suggestions[index] }),
      });
      if (res.ok) {
        setMessage("✅ Xに投稿しました！");
        setSuggestions([]);
        setInput("");
      } else {
        const data = await res.json();
        setMessage(`❌ 投稿失敗: ${data.error || "不明なエラー"}`);
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
    }
    setPostingIndex(null);
  };

  const handleQueue = async (index: number) => {
    setQueuingIndex(index);
    setMessage("");
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: suggestions[index] }),
      });
      if (res.ok) {
        setMessage("✅ 予約キューに追加しました");
      } else {
        setMessage("❌ 追加に失敗しました");
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
    }
    setQueuingIndex(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">ネタ → ツイート最適化</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          メモやアイデアを入力すると、バズるツイートを3パターン生成します
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="例: Pythonのwalrus operatorが便利。ループの中でif文書かなくていい"
        className="w-full bg-gray-900 text-white rounded-xl p-4 border border-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition placeholder:text-gray-600"
        rows={4}
      />

      <button
        onClick={handleOptimize}
        disabled={loading || !input.trim()}
        className="mt-3 w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            生成中...
          </span>
        ) : (
          "最適化する"
        )}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm text-center ${
            message.startsWith("✅")
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-gray-400 font-medium">
            生成結果（{suggestions.length}案）
          </p>
          {suggestions.map((text, i) => (
            <TweetPreview
              key={i}
              text={text}
              label={`案 ${i + 1}`}
              onPost={() => handlePost(i)}
              onQueue={() => handleQueue(i)}
              posting={postingIndex === i}
              queuing={queuingIndex === i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
