"use client";

import { useState } from "react";
import { TableProperties, FileText, Edit3 } from "lucide-react";

interface PlanItem {
  day: number;
  content: string;
}

export default function PlanningTab() {
  const [planTheme, setPlanTheme] = useState("");
  const [planTarget, setPlanTarget] = useState("");
  const [planDuration, setPlanDuration] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [message, setMessage] = useState("");

  const handleGeneratePlan = async () => {
    if (!planTheme.trim()) return;
    setIsGenerating(true);
    setPlanItems([]);
    setMessage("");

    try {
      const themeText = planTarget
        ? `${planTheme}（ターゲット: ${planTarget}）`
        : planTheme;

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeText, days: planDuration }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage(`${data.error}`);
      } else {
        const items = (data.tweets || []).map(
          (content: string, i: number) => ({
            day: i + 1,
            content,
          })
        );
        setPlanItems(items);
        setMessage(
          `${data.tweets?.length || 0}件を予約キューに追加しました`
        );
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
    setIsGenerating(false);
  };

  const categories = [
    "専門知識",
    "マインドセット",
    "日常・想い",
    "PR/宣伝",
    "ニュース解説",
  ];
  const angles = [
    "メリット提示",
    "失敗談からの学び",
    "Q&A形式",
    "未来予測",
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold flex items-center">
          <TableProperties className="mr-3 text-purple-400" size={28} />{" "}
          長期企画スケジュール
        </h1>
        <p className="text-gray-500 mt-2">
          テーマを入力するだけで、複数日分の投稿を一括生成して予約キューに追加します。
        </p>
      </header>

      <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              発信テーマ・強み
            </label>
            <input
              type="text"
              className="w-full bg-black border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="例: AI活用術, 組織マネジメント"
              value={planTheme}
              onChange={(e) => setPlanTheme(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              ターゲット層（任意）
            </label>
            <input
              type="text"
              className="w-full bg-black border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="例: 未経験エンジニア, 中小企業経営者"
              value={planTarget}
              onChange={(e) => setPlanTarget(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              期間
            </label>
            <div className="flex bg-black rounded-xl border border-gray-700 p-1">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setPlanDuration(d)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    planDuration === d
                      ? "bg-gray-800 text-purple-400 shadow-inner"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {d}日間
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating || !planTheme.trim()}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all"
            >
              {isGenerating ? (
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
              ) : (
                <>
                  <FileText size={18} />
                  <span>企画表を生成</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-xl text-sm text-center ${
              message.includes("失敗") || message.includes("エラー")
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}
          >
            {message}
          </div>
        )}

        {/* Planning Table */}
        {planItems.length > 0 && (
          <div className="overflow-hidden border border-gray-800 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900/80">
                <tr className="text-gray-500 text-xs uppercase tracking-tighter">
                  <th className="py-4 px-6 font-bold w-16">Day</th>
                  <th className="py-4 px-6 font-bold w-24">カテゴリー</th>
                  <th className="py-4 px-6 font-bold">投稿内容</th>
                  <th className="py-4 px-6 font-bold w-24">角度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {planItems.map((item) => (
                  <tr
                    key={item.day}
                    className="hover:bg-gray-800/20 transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono text-blue-400">
                      D-{item.day}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                          categories[(item.day - 1) % categories.length] ===
                          "PR/宣伝"
                            ? "border-red-900 text-red-400 bg-red-400/5"
                            : categories[(item.day - 1) % categories.length] ===
                                "専門知識"
                              ? "border-blue-900 text-blue-400 bg-blue-400/5"
                              : "border-gray-700 text-gray-400"
                        }`}
                      >
                        {categories[(item.day - 1) % categories.length]}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium max-w-md">
                      <p className="line-clamp-3">{item.content}</p>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {angles[(item.day - 1) % angles.length]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
