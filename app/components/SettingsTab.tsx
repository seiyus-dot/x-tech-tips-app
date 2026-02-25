"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  CheckCircle2,
  Zap,
  AlertCircle,
  Plus,
  X,
  Clock,
} from "lucide-react";

interface AppSettings {
  schedule_slots: string[];
  auto_generate_when_empty: boolean;
  projects_enabled: boolean;
}

export default function SettingsTab() {
  const [testingApi, setTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [testMessage, setTestMessage] = useState("");

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [editSlots, setEditSlots] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: AppSettings) => {
        setSettings(data);
        setEditSlots(data.schedule_slots || []);
      })
      .catch(console.error);
  }, []);

  const handleTestApi = async () => {
    setTestingApi(true);
    setTestMessage("");
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "テスト" }),
      });
      if (res.ok) {
        setApiStatus("ok");
        setTestMessage("Claude API接続成功！");
      } else {
        setApiStatus("error");
        setTestMessage("エラーが発生しました");
      }
    } catch {
      setApiStatus("error");
      setTestMessage("接続に失敗しました");
    }
    setTestingApi(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_slots: editSlots.filter((s) => s),
          auto_generate_when_empty: settings?.auto_generate_when_empty ?? true,
          projects_enabled: settings?.projects_enabled ?? true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setEditSlots(data.schedule_slots);
        setSaveMessage("保存しました！");
      } else {
        setSaveMessage("保存に失敗しました");
      }
    } catch {
      setSaveMessage("通信エラーが発生しました");
    }
    setSaving(false);
  };

  const addSlot = () => {
    if (editSlots.length >= 6) return;
    setEditSlots([...editSlots, "12:00"]);
  };

  const removeSlot = (index: number) => {
    setEditSlots(editSlots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, value: string) => {
    const updated = [...editSlots];
    updated[index] = value;
    setEditSlots(updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">連携設定</h1>

      <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 space-y-8">
        {/* Schedule Slots */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <span className="p-1.5 bg-green-500/20 text-green-400 rounded-lg mr-2">
              <Clock size={20} />
            </span>
            投稿タイムスロット
          </h3>
          <div className="p-5 bg-gray-800/50 border border-gray-700 rounded-2xl space-y-4">
            <p className="text-sm text-gray-400">
              投稿を自動で割り当てる時間帯を設定します（最大6つ）
            </p>
            <div className="flex flex-wrap gap-3">
              {editSlots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 bg-black border border-gray-700 rounded-xl px-3 py-2"
                >
                  <input
                    type="time"
                    value={slot}
                    onChange={(e) => updateSlot(i, e.target.value)}
                    className="bg-transparent text-white text-sm font-mono outline-none w-20"
                  />
                  <button
                    onClick={() => removeSlot(i)}
                    className="text-gray-500 hover:text-red-400 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {editSlots.length < 6 && (
                <button
                  onClick={addSlot}
                  className="flex items-center space-x-1 px-3 py-2 border border-dashed border-gray-600 rounded-xl text-gray-500 hover:text-green-400 hover:border-green-500 transition text-sm"
                >
                  <Plus size={14} />
                  <span>追加</span>
                </button>
              )}
            </div>

            {/* Auto-generate toggle */}
            <label className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                checked={settings?.auto_generate_when_empty ?? true}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, auto_generate_when_empty: e.target.checked } : prev
                  )
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-400">
                スロットが空のとき自動でAI生成して投稿する
              </span>
            </label>

            {/* Knowledge toggle */}
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings?.projects_enabled ?? true}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, projects_enabled: e.target.checked } : prev
                  )
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-400">
                プロジェクトの知識をAI生成に反映する
              </span>
            </label>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white text-sm font-bold rounded-xl transition"
              >
                {saving ? "保存中..." : "保存する"}
              </button>
              {saveMessage && (
                <span
                  className={`text-sm ${
                    saveMessage.includes("失敗") || saveMessage.includes("エラー")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* X API */}
        <section className="pt-6 border-t border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg mr-2">
              <Settings size={20} />
            </span>
            X API (v2) 連携
          </h3>
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-2xl">
            <p className="text-sm text-gray-400 mb-2">
              X API の認証情報は <code className="text-blue-400">.env.local</code>{" "}
              で管理されています。
            </p>
            <div className="text-xs text-gray-500 space-y-1 font-mono">
              <p>X_API_KEY=...</p>
              <p>X_API_SECRET=...</p>
              <p>X_ACCESS_TOKEN=...</p>
              <p>X_ACCESS_TOKEN_SECRET=...</p>
            </div>
          </div>
        </section>

        {/* Claude API */}
        <section className="pt-6 border-t border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg mr-2">
              <Zap size={20} />
            </span>
            Claude AI 設定
          </h3>
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-2xl space-y-4">
            <p className="text-sm text-gray-400">
              Anthropic API キーは{" "}
              <code className="text-purple-400">.env.local</code> で管理されています。
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTestApi}
                disabled={testingApi}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white text-sm font-bold rounded-xl transition"
              >
                {testingApi ? "テスト中..." : "接続テスト"}
              </button>
              {apiStatus === "ok" && (
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <CheckCircle2 size={16} />
                  <span>{testMessage}</span>
                </div>
              )}
              {apiStatus === "error" && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{testMessage}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
