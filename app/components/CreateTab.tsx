"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Zap,
  Link as LinkIcon,
  FileText,
  UploadCloud,
  Send,
  Trash2,
  CheckCircle2,
  FolderOpen,
  TrendingUp,
  Quote,
  Heart,
  Repeat2,
  RefreshCw,
  X,
  ExternalLink,
  UserPlus,
  Search,
  Users,
} from "lucide-react";

interface GeneratedPost {
  id: number;
  content: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

interface BuzzTweet {
  id: string;
  text: string;
  likes: number;
  retweets: number;
  score: number;
  authorName: string;
  authorUsername: string;
  tweetUrl: string;
}

interface WatchAccount {
  id: string;
  username: string;
  name: string;
  added_at: string;
}

export default function CreateTab() {
  const [mode, setMode] = useState<
    "buzz" | "manual" | "theme" | "url" | "document"
  >("buzz");
  const [manualContent, setManualContent] = useState("");
  const [themeInput, setThemeInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [message, setMessage] = useState("");
  const [queuingId, setQueuingId] = useState<number | null>(null);

  // Project
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Buzz / Feed
  const [buzzSubMode, setBuzzSubMode] = useState<"accounts" | "search">(
    "accounts"
  );
  const [buzzTweets, setBuzzTweets] = useState<BuzzTweet[]>([]);
  const [buzzLoading, setBuzzLoading] = useState(false);
  const [buzzQuery, setBuzzQuery] = useState("");
  const [buzzMinLikes, setBuzzMinLikes] = useState(5);
  const [buzzDays, setBuzzDays] = useState(7);

  // Watch Accounts
  const [watchAccounts, setWatchAccounts] = useState<WatchAccount[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [addingAccount, setAddingAccount] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  // Quote RT
  const [quotingTweet, setQuotingTweet] = useState<BuzzTweet | null>(null);
  const [quoteOptions, setQuoteOptions] = useState<GeneratedPost[]>([]);
  const [generatingQuote, setGeneratingQuote] = useState(false);
  const [postingQuote, setPostingQuote] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => {});
    fetch("/api/watch-accounts")
      .then((res) => res.json())
      .then((data) => setWatchAccounts(data.accounts || []))
      .catch(() => {});
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // ウォッチアカウントのタイムライン取得
  const fetchTimeline = useCallback(
    async (accountId?: string) => {
      setBuzzLoading(true);
      setBuzzTweets([]);
      setMessage("");
      try {
        const params = new URLSearchParams({ count: "20" });
        const target = accountId || selectedAccountId;
        if (target !== "all") params.set("accountId", target);
        const res = await fetch(`/api/watch-accounts/timeline?${params}`);
        const data = await res.json();
        setBuzzTweets(data.tweets || []);
        if ((data.tweets || []).length === 0) {
          setMessage(
            data.message || "投稿が見つかりませんでした"
          );
        }
      } catch {
        setMessage("タイムラインの取得に失敗しました");
      }
      setBuzzLoading(false);
    },
    [selectedAccountId]
  );

  // キーワード検索
  const fetchBuzz = async (query?: string) => {
    const q = query || buzzQuery;
    if (!q.trim()) return;
    setBuzzLoading(true);
    setBuzzTweets([]);
    setMessage("");
    try {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - buzzDays);
      const params = new URLSearchParams({
        q,
        count: "20",
        minLikes: String(buzzMinLikes),
        startTime: startTime.toISOString(),
      });
      const res = await fetch(`/api/buzz?${params}`);
      const data = await res.json();
      setBuzzTweets(data.tweets || []);
      if ((data.tweets || []).length === 0) {
        setMessage(
          "条件に合う投稿が見つかりませんでした。フィルターを緩めてみてください。"
        );
      }
    } catch {
      setMessage("投稿の取得に失敗しました");
    }
    setBuzzLoading(false);
  };

  // ウォッチアカウント追加
  const handleAddAccount = async () => {
    if (!newUsername.trim()) return;
    setAddingAccount(true);
    setMessage("");
    try {
      const res = await fetch("/api/watch-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });
      const data = await res.json();
      if (res.ok && data.account) {
        setWatchAccounts((prev) => {
          if (prev.some((a) => a.id === data.account.id)) return prev;
          return [...prev, data.account];
        });
        setNewUsername("");
        setMessage(`@${data.account.username} を追加しました`);
      } else {
        setMessage(data.error || "追加に失敗しました");
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
    setAddingAccount(false);
  };

  // ウォッチアカウント削除
  const handleRemoveAccount = async (accountId: string) => {
    try {
      await fetch("/api/watch-accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: accountId }),
      });
      setWatchAccounts((prev) => prev.filter((a) => a.id !== accountId));
      if (selectedAccountId === accountId) setSelectedAccountId("all");
    } catch {
      setMessage("削除に失敗しました");
    }
  };

  // 引用RTコメント生成
  const handleGenerateQuote = async (tweet: BuzzTweet) => {
    setQuotingTweet(tweet);
    setQuoteOptions([]);
    setGeneratingQuote(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalTweet: tweet.text,
          projectId: selectedProjectId || undefined,
        }),
      });
      const data = await res.json();
      if (data.suggestions) {
        setQuoteOptions(
          data.suggestions.map((s: string, i: number) => ({
            id: Date.now() + i,
            content: s,
          }))
        );
      }
    } catch {
      setMessage("引用コメント生成に失敗しました");
    }
    setGeneratingQuote(false);
  };

  // 引用RTを投稿
  const handlePostQuote = async (text: string) => {
    if (!quotingTweet) return;
    setPostingQuote(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "post",
          text,
          quoteTweetId: quotingTweet.id,
        }),
      });
      if (res.ok) {
        setMessage("引用リツイートを投稿しました！");
        setQuotingTweet(null);
        setQuoteOptions([]);
      } else {
        setMessage("投稿に失敗しました");
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
    setPostingQuote(false);
  };

  // 引用RTを予約
  const handleQueueQuote = async (text: string) => {
    if (!quotingTweet) return;
    const fullText = `${text}\nhttps://x.com/i/status/${quotingTweet.id}`;
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText }),
      });
      if (res.ok) {
        setMessage("予約リストに追加しました");
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
  };

  const handleGenerate = async () => {
    if (mode === "theme" && !themeInput.trim()) return;
    if (mode === "url" && !urlInput.trim()) return;
    if (mode === "document" && !documentText.trim() && !fileName) return;

    setIsGenerating(true);
    setGeneratedPosts([]);
    setMessage("");

    const projectPayload = selectedProjectId
      ? { projectId: selectedProjectId }
      : {};

    try {
      if (mode === "theme") {
        const res = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: themeInput, ...projectPayload }),
        });
        const data = await res.json();
        if (data.error) {
          setMessage(`${data.error}`);
        } else {
          setGeneratedPosts(
            (data.suggestions || []).map((content: string, i: number) => ({
              id: Date.now() + i,
              content,
            }))
          );
        }
      } else if (mode === "url") {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlInput, ...projectPayload }),
        });
        const data = await res.json();
        if (data.error) {
          setMessage(`${data.error}`);
        } else {
          setGeneratedPosts([{ id: Date.now(), content: data.tweet || "" }]);
        }
      } else if (mode === "document") {
        const res = await fetch("/api/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: documentText, ...projectPayload }),
        });
        const data = await res.json();
        if (data.error) {
          setMessage(`${data.error}`);
        } else {
          setGeneratedPosts(
            (data.suggestions || []).map((content: string, i: number) => ({
              id: Date.now() + i,
              content,
            }))
          );
        }
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
    setIsGenerating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) =>
      setDocumentText(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleAddToQueue = async (post: GeneratedPost) => {
    setQueuingId(post.id);
    setMessage("");
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: post.content }),
      });
      if (res.ok) {
        setMessage("予約リストに追加しました");
        setGeneratedPosts((prev) => prev.filter((p) => p.id !== post.id));
      } else {
        setMessage("追加に失敗しました");
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
    setQueuingId(null);
  };

  const handleManualAdd = async () => {
    if (!manualContent.trim() || manualContent.length > 280) return;
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: manualContent }),
      });
      if (res.ok) {
        setMessage("予約リストに追加しました");
        setManualContent("");
      } else {
        setMessage("追加に失敗しました");
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
  };

  const modes = [
    { id: "buzz" as const, label: "投稿検索" },
    { id: "theme" as const, label: "テーマ生成" },
    { id: "url" as const, label: "URL生成" },
    { id: "document" as const, label: "資料生成" },
    { id: "manual" as const, label: "手動" },
  ];

  // ツイートカード共通コンポーネント
  const TweetCard = ({ tweet }: { tweet: BuzzTweet }) => (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 hover:border-orange-500/30 transition-all group">
      {/* Author info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-gray-200">
            {tweet.authorName}
          </span>
          {tweet.authorUsername && (
            <span className="text-xs text-gray-500">
              @{tweet.authorUsername}
            </span>
          )}
        </div>
        {tweet.tweetUrl && (
          <a
            href={tweet.tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-orange-400 transition"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      <p className="text-gray-200 text-sm leading-relaxed mb-3">
        {tweet.text}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <Heart size={12} className="text-red-400" />
            <span>{tweet.likes.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Repeat2 size={12} className="text-green-400" />
            <span>{tweet.retweets.toLocaleString()}</span>
          </span>
        </div>
        <button
          onClick={() => handleGenerateQuote(tweet)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-full transition-all opacity-70 group-hover:opacity-100"
        >
          <Quote size={14} />
          <span>引用RT生成</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="mr-3 text-blue-400" size={28} /> AI コンテンツ作成
        </h1>
        <p className="text-gray-500 mt-2">
          X投稿の検索・引用RT、テーマ生成、URL要約、資料変換。
        </p>
      </header>

      {/* Project Selector */}
      {mode !== "manual" && (
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400">
            <FolderOpen size={16} className="text-violet-400" />
            <span>プロジェクト連携</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500">プロジェクト</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 transition appearance-none cursor-pointer"
            >
              <option value="">なし（フリー生成）</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {selectedProject?.description && (
            <div className="text-xs text-gray-500 bg-violet-500/5 border border-violet-900/30 rounded-lg p-3">
              <span className="text-violet-400 font-bold">方向性:</span>{" "}
              {selectedProject.description}
            </div>
          )}
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex p-1.5 bg-gray-900/50 rounded-2xl border border-gray-800 w-fit">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              mode === m.id
                ? m.id === "buzz"
                  ? "bg-orange-600/20 text-orange-400 shadow-sm"
                  : "bg-gray-800 text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-xl text-sm text-center ${
            message.includes("失敗") || message.includes("エラー") || message.includes("見つかりません")
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}
        >
          {message}
        </div>
      )}

      {/* ==================== BUZZ MODE ==================== */}
      {mode === "buzz" && (
        <div className="space-y-6">
          {/* Sub-mode Toggle: Accounts / Search */}
          <div className="flex p-1 bg-gray-900/50 rounded-xl border border-gray-800 w-fit">
            <button
              onClick={() => setBuzzSubMode("accounts")}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${
                buzzSubMode === "accounts"
                  ? "bg-orange-600/20 text-orange-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Users size={14} />
              <span>アカウント</span>
            </button>
            <button
              onClick={() => setBuzzSubMode("search")}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${
                buzzSubMode === "search"
                  ? "bg-orange-600/20 text-orange-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Search size={14} />
              <span>キーワード検索</span>
            </button>
          </div>

          {/* ===== ACCOUNTS SUB-MODE ===== */}
          {buzzSubMode === "accounts" && (
            <div className="space-y-4">
              {/* Add Account */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-5 space-y-4">
                <label className="text-sm font-bold text-gray-400 flex items-center">
                  <UserPlus size={16} className="mr-2 text-orange-400" />
                  ウォッチアカウント
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="@username を入力"
                    className="flex-1 bg-black border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500/50 outline-none text-sm placeholder:text-gray-600 transition-all"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddAccount()}
                  />
                  <button
                    onClick={handleAddAccount}
                    disabled={addingAccount || !newUsername.trim()}
                    className="px-4 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 shrink-0"
                  >
                    {addingAccount ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>追加</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Account List */}
                {watchAccounts.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedAccountId("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          selectedAccountId === "all"
                            ? "bg-orange-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        全員
                      </button>
                      {watchAccounts.map((a) => (
                        <div key={a.id} className="flex items-center group/chip">
                          <button
                            onClick={() => setSelectedAccountId(a.id)}
                            className={`px-3 py-1.5 rounded-l-full text-xs font-bold transition-all ${
                              selectedAccountId === a.id
                                ? "bg-orange-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            }`}
                          >
                            @{a.username}
                          </button>
                          <button
                            onClick={() => handleRemoveAccount(a.id)}
                            className="px-1.5 py-1.5 bg-gray-800 hover:bg-red-600 text-gray-500 hover:text-white rounded-r-full transition-all text-xs"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Load Timeline Button */}
              {watchAccounts.length > 0 && (
                <button
                  onClick={() => fetchTimeline()}
                  disabled={buzzLoading}
                  className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-500 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all"
                >
                  {buzzLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      <span>
                        {selectedAccountId === "all"
                          ? "全員の最新投稿を取得"
                          : `@${watchAccounts.find((a) => a.id === selectedAccountId)?.username} の最新投稿を取得`}
                      </span>
                    </>
                  )}
                </button>
              )}

              {watchAccounts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    ウォッチしたいXアカウントの@usernameを追加してください
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== SEARCH SUB-MODE ===== */}
          {buzzSubMode === "search" && (
            <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6 space-y-4">
              <label className="text-sm font-bold text-gray-400 flex items-center">
                <Search size={16} className="mr-2 text-orange-400" />{" "}
                キーワードで検索
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="キーワード（例: TypeScript, 転職, ダイエット）"
                  className="flex-1 bg-black border border-gray-700 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500/50 outline-none text-lg placeholder:text-gray-600 transition-all"
                  value={buzzQuery}
                  onChange={(e) => setBuzzQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchBuzz()}
                />
                <button
                  onClick={() => fetchBuzz()}
                  disabled={buzzLoading || !buzzQuery.trim()}
                  className="px-6 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-2xl font-bold transition-all flex items-center space-x-2 shrink-0"
                >
                  {buzzLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Search size={18} />
                      <span>検索</span>
                    </>
                  )}
                </button>
              </div>
              {/* Filters */}
              <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-500">最低いいね数</label>
                  <select
                    value={buzzMinLikes}
                    onChange={(e) => setBuzzMinLikes(Number(e.target.value))}
                    className="bg-black border border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-300 outline-none"
                  >
                    <option value={0}>なし</option>
                    <option value={5}>5+</option>
                    <option value={10}>10+</option>
                    <option value={50}>50+</option>
                    <option value={100}>100+</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-500">期間</label>
                  <select
                    value={buzzDays}
                    onChange={(e) => setBuzzDays(Number(e.target.value))}
                    className="bg-black border border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-300 outline-none"
                  >
                    <option value={1}>24時間</option>
                    <option value={3}>3日間</option>
                    <option value={7}>7日間</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tweet Results (shared) */}
          {buzzTweets.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center">
                  <TrendingUp size={18} className="mr-2 text-orange-400" />
                  検索結果 ({buzzTweets.length}件)
                </h3>
                <button
                  onClick={() =>
                    buzzSubMode === "accounts"
                      ? fetchTimeline()
                      : fetchBuzz()
                  }
                  className="text-gray-500 hover:text-orange-400 transition p-1"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
              {buzzTweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </div>
          )}

          {/* Quote RT Modal */}
          {quotingTweet && (
            <div className="bg-gray-900/60 border border-orange-500/30 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-orange-400 flex items-center">
                  <Quote size={18} className="mr-2" /> 引用RTコメント生成
                </h3>
                <button
                  onClick={() => {
                    setQuotingTweet(null);
                    setQuoteOptions([]);
                  }}
                  className="text-gray-500 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Original tweet preview */}
              <div className="bg-black/50 border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-1">元投稿:</p>
                <p className="text-gray-300 text-sm">{quotingTweet.text}</p>
              </div>

              {generatingQuote ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400" />
                  <span className="ml-3 text-gray-400 text-sm">
                    引用コメントを生成中...
                  </span>
                </div>
              ) : quoteOptions.length > 0 ? (
                <div className="space-y-3">
                  {quoteOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="bg-black/40 border border-gray-700 rounded-xl p-4 space-y-3"
                    >
                      <textarea
                        className="w-full bg-transparent resize-y text-gray-200 text-sm leading-relaxed outline-none min-h-[60px]"
                        rows={Math.max(3, Math.ceil(opt.content.length / 40))}
                        value={opt.content}
                        onChange={(e) =>
                          setQuoteOptions((prev) =>
                            prev.map((o) =>
                              o.id === opt.id
                                ? { ...o, content: e.target.value }
                                : o
                            )
                          )
                        }
                      />
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs font-mono ${opt.content.length > 280 ? "text-red-400" : "text-gray-500"}`}
                        >
                          {opt.content.length}/280
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQueueQuote(opt.content)}
                            className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-full transition"
                          >
                            予約
                          </button>
                          <button
                            onClick={() => handlePostQuote(opt.content)}
                            disabled={
                              postingQuote || opt.content.length > 280
                            }
                            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 text-white text-xs font-bold rounded-full transition flex items-center space-x-1"
                          >
                            {postingQuote ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                            ) : (
                              <>
                                <Send size={12} />
                                <span>今すぐ引用RT</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* ==================== OTHER MODES ==================== */}
      {mode !== "buzz" && (
        <>
          {/* Input Card */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 space-y-6">
            {mode === "manual" ? (
              <div className="space-y-4">
                <textarea
                  placeholder="いまどうしてる？"
                  className="w-full bg-transparent border-none focus:ring-0 resize-y text-xl text-gray-100 placeholder:text-gray-600 outline-none min-h-[120px]"
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                />
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <div />
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-sm font-bold ${manualContent.length > 280 ? "text-red-500" : "text-gray-500"}`}
                    >
                      {manualContent.length} / 280
                    </span>
                    <button
                      onClick={handleManualAdd}
                      disabled={
                        !manualContent.trim() || manualContent.length > 280
                      }
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 px-6 py-2 rounded-full font-bold transition-all flex items-center space-x-2"
                    >
                      <Send size={16} />
                      <span>予約リストへ追加</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : mode === "theme" ? (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400 flex items-center">
                  <Zap size={16} className="mr-2 text-yellow-500" />{" "}
                  生成するテーマ
                </label>
                <input
                  type="text"
                  placeholder="例: 未経験からのエンジニア転職, 最新のTypeScriptトレンド"
                  className="w-full bg-black border border-gray-700 rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 outline-none text-lg placeholder:text-gray-600 transition-all"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
            ) : mode === "url" ? (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400 flex items-center">
                  <LinkIcon size={16} className="mr-2 text-blue-400" /> 参照URL
                </label>
                <input
                  type="text"
                  placeholder="https://news.yahoo.co.jp/articles/..."
                  className="w-full bg-black border border-gray-700 rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 outline-none text-lg placeholder:text-gray-600 transition-all"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
            ) : (
              <div className="space-y-5">
                <label className="text-sm font-bold text-gray-400 flex items-center">
                  <FileText size={16} className="mr-2 text-green-400" />{" "}
                  資料からコンテンツ化
                </label>
                <label className="block border-2 border-dashed border-gray-700 hover:border-blue-500 bg-black/50 rounded-2xl p-8 text-center transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept=".txt,.md,.csv,.json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <UploadCloud
                    size={36}
                    className="mx-auto text-gray-600 group-hover:text-blue-400 mb-3 transition-colors"
                  />
                  {fileName ? (
                    <div>
                      <p className="text-blue-400 font-bold">{fileName}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        クリックで別のファイルを選択
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300 font-bold">
                        テキストファイルをクリックして選択
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        TXT, MD, CSV, JSON
                      </p>
                    </div>
                  )}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-px bg-gray-800 flex-1" />
                  <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">
                    OR
                  </span>
                  <div className="h-px bg-gray-800 flex-1" />
                </div>
                <textarea
                  placeholder="ここにテキストを直接貼り付けてください..."
                  className="w-full bg-black border border-gray-700 rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 outline-none text-lg placeholder:text-gray-600 transition-all min-h-[160px] resize-y"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                />
              </div>
            )}

            {mode !== "manual" && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all active:scale-[0.98]"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <>
                    <Sparkles size={22} />
                    <span>投稿案を生成する</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Generated Results */}
          {generatedPosts.length > 0 && (
            <div className="space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center">
                  <CheckCircle2 size={22} className="mr-2 text-green-500" />{" "}
                  生成されたポスト案
                </h3>
                <span className="text-sm text-gray-500">
                  {generatedPosts.length}件
                </span>
              </div>
              <div className="grid gap-4">
                {generatedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 group hover:border-blue-500/50 transition-all"
                  >
                    <textarea
                      className="w-full bg-transparent border-none focus:ring-0 resize-y text-gray-200 leading-relaxed mb-4 p-0 text-lg outline-none min-h-[100px]"
                      rows={Math.max(4, Math.ceil(post.content.length / 35))}
                      value={post.content}
                      onChange={(e) =>
                        setGeneratedPosts((prev) =>
                          prev.map((p) =>
                            p.id === post.id
                              ? { ...p, content: e.target.value }
                              : p
                          )
                        )
                      }
                    />
                    <div className="flex justify-between items-center pt-5 border-t border-gray-800/50">
                      <span
                        className={`text-sm font-mono ${post.content.length > 280 ? "text-red-400 font-bold" : post.content.length > 250 ? "text-yellow-400" : "text-gray-500"}`}
                      >
                        {post.content.length}/280
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setGeneratedPosts((prev) =>
                              prev.filter((p) => p.id !== post.id)
                            )
                          }
                          className="p-2.5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button
                          onClick={() => handleAddToQueue(post)}
                          disabled={
                            queuingId === post.id || post.content.length > 280
                          }
                          className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-gray-200 disabled:opacity-40 transition-all flex items-center"
                        >
                          {queuingId === post.id ? (
                            <span className="flex items-center space-x-2">
                              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                              <span>追加中...</span>
                            </span>
                          ) : (
                            "予約する"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
