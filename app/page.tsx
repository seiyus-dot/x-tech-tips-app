"use client";

import { useState } from "react";
import {
  PlusCircle,
  Calendar,
  Settings,
  TableProperties,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import CreateTab from "./components/CreateTab";
import PlanningTab from "./components/PlanningTab";
import ScheduleTab from "./components/ScheduleTab";
import ProjectsTab from "./components/ProjectsTab";
import SettingsTab from "./components/SettingsTab";

type TabId = "create" | "planning" | "schedule" | "projects" | "settings";

const sidebarItems: { id: TabId; label: string; icon: typeof PlusCircle }[] = [
  { id: "create", label: "AI作成", icon: Sparkles },
  { id: "planning", label: "長期企画表", icon: TableProperties },
  { id: "schedule", label: "予約リスト", icon: Calendar },
  { id: "projects", label: "プロジェクト", icon: FolderOpen },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("create");

  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 flex flex-col p-4 bg-black shrink-0">
        <div className="flex items-center space-x-3 px-4 mb-10 mt-2">
          <div className="bg-white p-1.5 rounded-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter italic">
            AUTO-X
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-800 pt-4">
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "settings"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">連携設定</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="max-w-4xl mx-auto p-8">
          {activeTab === "create" && <CreateTab />}
          {activeTab === "planning" && <PlanningTab />}
          {activeTab === "schedule" && <ScheduleTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}
