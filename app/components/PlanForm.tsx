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
      setTweets(data.tweets || []);
      setMessage(`✅ ${data.tweets?.length || 0}件の投稿を予約キューに追加しました！`);
      onPlanCreated?.();
    } catch {
      setMessage("エラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-1">📅 テーマ → 投稿企画</h2>
      <p className="text-gray-400 text-sm mb-4">テーマを入力すると複数日分の投稿を一括企画</p>

      <input
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="例: React hooks, Python tips, Git workflow"
        className="w-full bg-gray-900 text-white text-sm rounded-lg p-3 border border-gray-600 outline-none focus:border-blue-500 transition"
      />

      <div className="flex items-center gap-3 mt-3">
        <label className="text-gray-400 text-sm">日数:</label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-gray-900 text-white text-sm rounded-lg p-2 border border-gray-600 outline-none"
        >
          {[3, 5, 7, 10, 14].map((d) => (
            <option key={d} value={d}>
              {d}日分
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePlan}
        disabled={loading || !theme.trim()}
        className="mt-3 w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg disabled:opacity-50 transition"
      >
        {loading ? "企画中..." : "企画する"}
      </button>

      {message && <p className="mt-3 text-sm text-center">{message}</p>}

      {tweets.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {tweets.map((text, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
              <span className="text-xs text-purple-400 font-medium">Day {i + 1}</span>
              <p className="text-white text-sm mt-1">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
