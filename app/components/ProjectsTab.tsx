"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FolderOpen,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Hash,
  FileText,
  UploadCloud,
  ArrowLeft,
  File,
} from "lucide-react";

interface ProjectDocument {
  id: string;
  filename: string;
  content: string;
  type: "pdf" | "text" | "file";
  added_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  documents: ProjectDocument[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Project form
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTags, setFormTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Document upload
  const [docText, setDocText] = useState("");
  const [docFileName, setDocFileName] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const url = searchQuery
        ? `/api/projects?search=${encodeURIComponent(searchQuery)}`
        : "/api/projects";
      const res = await fetch(url);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      console.error("Failed to fetch projects");
    }
    setLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormTags("");
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setFormName(project.name);
    setFormDescription(project.description);
    setFormTags(project.tags.join(", "));
    setIsAdding(false);
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    setMessage("");
    const tags = formTags
      .split(/[,、]/)
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        const res = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: formName,
            description: formDescription,
            tags,
          }),
        });
        if (res.ok) {
          setMessage("更新しました");
          resetForm();
          fetchProjects();
          if (selectedProject?.id === editingId) {
            setSelectedProject((prev) =>
              prev
                ? { ...prev, name: formName, description: formDescription, tags }
                : null
            );
          }
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            description: formDescription,
            tags,
          }),
        });
        if (res.ok) {
          setMessage("プロジェクトを作成しました");
          resetForm();
          fetchProjects();
        }
      }
    } catch {
      setMessage("保存に失敗しました");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
    try {
      await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      fetchProjects();
    }
  };

  const openProject = (project: Project) => {
    setSelectedProject(project);
    resetForm();
  };

  // --- Document handling ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFileName(file.name);

    if (file.name.endsWith(".pdf")) {
      // PDF: base64エンコードして送信 → サーバーで抽出
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setDocText(`__PDF_BASE64__${base64}`);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleAddDocument = async () => {
    if (!selectedProject || !docText.trim()) return;
    setUploadingDoc(true);
    setMessage("");

    try {
      let content = docText;
      let type: "pdf" | "text" | "file" = "text";
      const filename = docFileName || "テキスト入力";

      if (docText.startsWith("__PDF_BASE64__")) {
        // PDFの場合、base64をサーバーに送ってテキスト抽出
        type = "pdf";
        content = docText; // サーバー側で抽出
      } else if (docFileName) {
        type = "file";
      }

      const res = await fetch(
        `/api/projects/${selectedProject.id}/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename, content, type }),
        }
      );

      if (res.ok) {
        const doc = await res.json();
        setSelectedProject((prev) =>
          prev
            ? { ...prev, documents: [...prev.documents, doc] }
            : null
        );
        setDocText("");
        setDocFileName(null);
        setMessage("ドキュメントを追加しました");
      } else {
        setMessage("追加に失敗しました");
      }
    } catch {
      setMessage("通信エラーが発生しました");
    }
    setUploadingDoc(false);
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!selectedProject) return;
    setSelectedProject((prev) =>
      prev
        ? { ...prev, documents: prev.documents.filter((d) => d.id !== docId) }
        : null
    );
    try {
      await fetch(`/api/projects/${selectedProject.id}/documents`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });
    } catch {
      // rollback on error
    }
  };

  // --- Detail View ---
  if (selectedProject) {
    return (
      <div className="space-y-8 animate-fade-in">
        <header>
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">プロジェクト一覧</span>
          </button>
          <h1 className="text-3xl font-bold flex items-center">
            <FolderOpen className="mr-3 text-violet-400" size={28} />
            {selectedProject.name}
          </h1>
          {selectedProject.description && (
            <p className="text-gray-400 mt-2 bg-gray-900/40 border border-gray-800 rounded-xl p-4 text-sm leading-relaxed">
              {selectedProject.description}
            </p>
          )}
          {selectedProject.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {selectedProject.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-900/50 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => startEdit(selectedProject)}
              className="text-xs text-gray-500 hover:text-violet-400 transition flex items-center space-x-1"
            >
              <Edit3 size={12} />
              <span>編集</span>
            </button>
          </div>
        </header>

        {/* Edit form inline */}
        {editingId === selectedProject.id && (
          <div className="bg-gray-900/40 border border-violet-500/30 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-violet-400">プロジェクトを編集</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-white transition">
                <X size={18} />
              </button>
            </div>
            <input
              type="text"
              placeholder="プロジェクト名"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50"
            />
            <textarea
              placeholder="発信の方向性・トーン（例: 初心者向け、実務Tips中心、カジュアルな口調）"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={4}
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
            />
            <div className="flex items-center space-x-2">
              <Hash size={14} className="text-gray-500" />
              <input
                type="text"
                placeholder="ハッシュタグ（カンマ区切り）"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="flex-1 bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="flex items-center space-x-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 text-white font-bold text-sm rounded-xl transition"
              >
                <Save size={14} />
                <span>{saving ? "保存中..." : "保存"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-xl text-sm text-center ${
              message.includes("失敗") || message.includes("エラー")
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}
          >
            {message}
          </div>
        )}

        {/* Documents Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center">
            <FileText className="mr-2 text-violet-400" size={20} />
            ドキュメント
            <span className="text-sm text-gray-500 ml-2 font-normal">
              ({selectedProject.documents.length}件)
            </span>
          </h2>

          {/* Upload Area */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6 space-y-4">
            <label className="block border-2 border-dashed border-gray-700 hover:border-violet-500 bg-black/50 rounded-2xl p-6 text-center transition-all cursor-pointer group">
              <input
                type="file"
                accept=".pdf,.txt,.md,.csv,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <UploadCloud
                size={32}
                className="mx-auto text-gray-600 group-hover:text-violet-400 mb-2 transition-colors"
              />
              {docFileName ? (
                <div>
                  <p className="text-violet-400 font-bold text-sm">{docFileName}</p>
                  <p className="text-gray-500 text-xs mt-1">クリックで別のファイルを選択</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 font-bold text-sm">ファイルをクリックして選択</p>
                  <p className="text-gray-600 text-xs mt-1">PDF, TXT, MD, CSV, JSON</p>
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
              placeholder="テキストを直接入力..."
              value={docText.startsWith("__PDF_BASE64__") ? "(PDF読み込み済み)" : docText}
              onChange={(e) => {
                setDocText(e.target.value);
                setDocFileName(null);
              }}
              rows={4}
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
              readOnly={docText.startsWith("__PDF_BASE64__")}
            />

            <button
              onClick={handleAddDocument}
              disabled={uploadingDoc || (!docText.trim())}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-500 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              {uploadingDoc ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Plus size={16} />
                  <span>ドキュメントを追加</span>
                </>
              )}
            </button>
          </div>

          {/* Document List */}
          {selectedProject.documents.length === 0 ? (
            <div className="py-10 text-center bg-gray-900/20 border border-dashed border-gray-800 rounded-2xl">
              <File size={32} className="mx-auto text-gray-700 mb-2" />
              <p className="text-gray-500 text-sm">ドキュメントがまだありません</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedProject.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex items-start justify-between group hover:border-violet-500/30 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <FileText size={14} className="text-violet-400 shrink-0" />
                      <span className="font-medium text-sm truncate">{doc.filename}</span>
                      <span className="text-xs text-gray-600 shrink-0">
                        {doc.type === "pdf" ? "PDF" : doc.type === "file" ? "FILE" : "TEXT"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {doc.content.slice(0, 200)}...
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(doc.added_at).toLocaleDateString("ja-JP")} ・{" "}
                      {doc.content.length.toLocaleString()}文字
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 ml-2 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold flex items-center">
          <FolderOpen className="mr-3 text-violet-400" size={28} /> プロジェクト
        </h1>
        <p className="text-gray-500 mt-2">
          発信の軸を定義して、知識・方向性をプロジェクトごとに管理します。
        </p>
      </header>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-xl text-sm text-center ${
            message.includes("失敗") || message.includes("エラー")
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}
        >
          {message}
        </div>
      )}

      {/* Search + Add */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="プロジェクトを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 transition"
          />
        </div>
        <button
          onClick={startAdd}
          className="flex items-center space-x-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm rounded-xl transition shrink-0"
        >
          <Plus size={16} />
          <span>新規作成</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-gray-900/40 border border-violet-500/30 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-violet-400">新規プロジェクト</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white transition">
              <X size={18} />
            </button>
          </div>
          <input
            type="text"
            placeholder="プロジェクト名（例: TypeScript布教）"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50"
          />
          <textarea
            placeholder="発信の方向性・トーン（例: 初心者向け、実務Tips中心、カジュアルな口調で200字程度）"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={4}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
          />
          <div className="flex items-center space-x-2">
            <Hash size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="ハッシュタグ（カンマ区切り）例: #TypeScript, #React, #初心者向け"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="flex-1 bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {formDescription.length}/1000文字
            </span>
            <button
              onClick={handleSave}
              disabled={saving || !formName.trim()}
              className="flex items-center space-x-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 text-white font-bold text-sm rounded-xl transition"
            >
              <Save size={14} />
              <span>{saving ? "作成中..." : "作成"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Project List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl">
          <div className="mb-4 inline-flex p-4 bg-gray-800/50 rounded-full text-gray-600">
            <FolderOpen size={40} />
          </div>
          <p className="text-gray-500 font-medium">
            {searchQuery ? "該当するプロジェクトがありません" : "プロジェクトがまだありません"}
          </p>
          {!searchQuery && (
            <button
              onClick={startAdd}
              className="mt-4 text-violet-400 font-bold hover:underline"
            >
              最初のプロジェクトを作成する
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => openProject(project)}
              className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 hover:border-violet-500/30 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <FolderOpen size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{project.name}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {project.documents.length}件のドキュメント
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(project);
                    }}
                    className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-violet-400 transition"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {project.description && (
                <p className="text-gray-400 text-sm mt-3 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              )}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-900/50 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-600 mt-3">
                更新: {new Date(project.updated_at).toLocaleDateString("ja-JP")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form (list view) */}
      {editingId && !selectedProject && (
        <div className="bg-gray-900/40 border border-violet-500/30 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-violet-400">プロジェクトを編集</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white transition">
              <X size={18} />
            </button>
          </div>
          <input
            type="text"
            placeholder="プロジェクト名"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50"
          />
          <textarea
            placeholder="発信の方向性・トーン"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={4}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
          />
          <div className="flex items-center space-x-2">
            <Hash size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="ハッシュタグ（カンマ区切り）"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="flex-1 bg-black border border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !formName.trim()}
              className="flex items-center space-x-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 text-white font-bold text-sm rounded-xl transition"
            >
              <Save size={14} />
              <span>{saving ? "保存中..." : "保存"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
