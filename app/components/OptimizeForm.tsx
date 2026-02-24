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
      setSuggestions(data.suggestions || []);
    } catch {
      setMessage("エラーが発生しました");
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
        setMessage("✅ 投稿しました！");
      } else {
        setMessage("❌ 投稿に失敗しました");
      }
    } catch {
      setMessage("❌ 投稿に失敗しました");
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
        setMessage("✅ 予約に追加しました！");
      } else {
        setMessage("❌ 追加に失敗しました");
      }
    } catch {
      setMessage("❌ 追加に失敗しました");
    }
    setQueuingIndex(null);
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-1">📝 ネタ → ツイート最適化</h2>
      <p className="text-gray-400 text-sm mb-4">メモやアイデアを入力すると、バズるツイート3案を生成</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="例: Pythonのwalrus operatorが便利。ループの中でif文書かなくていい"
        className="w-full bg-gray-900 text-white text-sm rounded-lg p-3 border border-gray-600 outline-none focus:border-blue-500 resize-none transition"
        rows={3}
      />

      <button
        onClick={handleOptimize}
        disabled={loading || !input.trim()}
        className="mt-3 w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 transition"
      >
        {loading ? "生成中..." : "最適化する"}
      </button>

      {message && <p className="mt-3 text-sm text-center">{message}</p>}

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-3">
          {suggestions.map((text, i) => (
            <TweetPreview
              key={i}
              text={text}
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
