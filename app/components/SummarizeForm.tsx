"use client";

import { useState } from "react";
import TweetPreview from "./TweetPreview";

export default function SummarizeForm() {
  const [url, setUrl] = useState("");
  const [tweet, setTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [queuing, setQueuing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSummarize = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setTweet("");
    setMessage("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setTweet(data.tweet || "");
    } catch {
      setMessage("エラーが発生しました");
    }
    setLoading(false);
  };

  const handlePost = async () => {
    setPosting(true);
    setMessage("");
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tweet }),
      });
      if (res.ok) setMessage("✅ 投稿しました！");
      else setMessage("❌ 投稿に失敗しました");
    } catch {
      setMessage("❌ 投稿に失敗しました");
    }
    setPosting(false);
  };

  const handleQueue = async () => {
    setQueuing(true);
    setMessage("");
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tweet }),
      });
      if (res.ok) setMessage("✅ 予約に追加しました！");
      else setMessage("❌ 追加に失敗しました");
    } catch {
      setMessage("❌ 追加に失敗しました");
    }
    setQueuing(false);
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-1">🔗 URL → 要約投稿</h2>
      <p className="text-gray-400 text-sm mb-4">記事やニュースのURLから要約ツイートを生成</p>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/article"
        className="w-full bg-gray-900 text-white text-sm rounded-lg p-3 border border-gray-600 outline-none focus:border-blue-500 transition"
      />

      <button
        onClick={handleSummarize}
        disabled={loading || !url.trim()}
        className="mt-3 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg disabled:opacity-50 transition"
      >
        {loading ? "要約中..." : "要約する"}
      </button>

      {message && <p className="mt-3 text-sm text-center">{message}</p>}

      {tweet && (
        <div className="mt-4">
          <TweetPreview
            text={tweet}
            onPost={handlePost}
            onQueue={handleQueue}
            posting={posting}
            queuing={queuing}
            editable
            onEdit={setTweet}
          />
        </div>
      )}
    </div>
  );
}
