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
      if (data.error) {
        setMessage(`❌ ${data.error}`);
      } else {
        setTweet(data.tweet || "");
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
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
      if (res.ok) {
        setMessage("✅ Xに投稿しました！");
        setTweet("");
        setUrl("");
      } else {
        setMessage("❌ 投稿に失敗しました");
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
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
      if (res.ok) {
        setMessage("✅ 予約キューに追加しました");
      } else {
        setMessage("❌ 追加に失敗しました");
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
    }
    setQueuing(false);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">URL → 要約投稿</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          記事やニュースのURLを入力すると要約ツイートを生成します
        </p>
      </div>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/article"
        className="w-full bg-gray-900 text-white rounded-xl p-4 border border-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition placeholder:text-gray-600"
      />

      <button
        onClick={handleSummarize}
        disabled={loading || !url.trim()}
        className="mt-3 w-full py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            要約中...
          </span>
        ) : (
          "要約する"
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

      {tweet && (
        <div className="mt-5">
          <p className="text-sm text-gray-400 font-medium mb-3">生成結果</p>
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
