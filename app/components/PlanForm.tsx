"use client";

import { useState } from "react";

export default function PlanForm({ onPlanCreated }: { onPlanCreated?: () => void }) {
  const [theme, setTheme] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handlePlan = async () => {
    if (!theme.trim()) return;
    setLoading(true);
    setTweets([]);
    setMessage("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, days }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage(`❌ ${data.error}`);
      } else {
        setTweets(data.tweets || []);
        setMessage(`✅ ${data.tweets?.length || 0}件を予約キューに追加しました`);
        onPlanCreated?.();
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">テーマ → 投稿企画</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          テーマを入力すると複数日分の投稿を一括生成して予約キューに追加します
        </p>
      </div>

      <input
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="例: React hooks, Python tips, Git workflow"
        className="w-full bg-gray-900 text-white rounded-xl p-4 border border-gray-700 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition placeholder:text-gray-600"
      />

      <div className="flex items-center gap-3 mt-3">
        <label className="text-gray-400 text-sm">日数:</label>
        <div className="flex gap-1.5">
          {[3, 5, 7, 10, 14].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                days === d
                  ? "bg-purple-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {d}日
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handlePlan}
        disabled={loading || !theme.trim()}
        className="mt-4 w-full py-3 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            企画中...（{days}日分を生成しています）
          </span>
        ) : (
          `${days}日分を企画する`
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

      {tweets.length > 0 && (
        <div className="mt-5">
          <p className="text-sm text-gray-400 font-medium mb-3">
            企画結果（{tweets.length}日分）
          </p>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {tweets.map((text, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl p-4 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                    Day {i + 1}
                  </span>
                  <span className="text-xs text-gray-500">{text.length}文字</span>
                </div>
                <p className="text-white text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
