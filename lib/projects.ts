import { promises as fs } from "fs";
import path from "path";

export interface ProjectDocument {
  id: string;
  filename: string;
  content: string;
  type: "pdf" | "text" | "file";
  added_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string; // 発信の方向性・トーン
  documents: ProjectDocument[];
  tags: string[];
  owner_id?: string; // マルチユーザー対応予約
  created_at: string;
  updated_at: string;
}

interface ProjectsData {
  projects: Project[];
}

const PROJECTS_PATH = path.join(process.cwd(), "data", "projects.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(PROJECTS_PATH);
  } catch {
    await fs.mkdir(path.dirname(PROJECTS_PATH), { recursive: true });
    await fs.writeFile(PROJECTS_PATH, JSON.stringify({ projects: [] }, null, 2));
  }
}

async function save(projects: Project[]): Promise<void> {
  await fs.writeFile(PROJECTS_PATH, JSON.stringify({ projects }, null, 2));
}

export async function getProjects(): Promise<Project[]> {
  await ensureFile();
  const data = await fs.readFile(PROJECTS_PATH, "utf-8");
  const parsed: ProjectsData = JSON.parse(data);
  return parsed.projects;
}

export async function getProject(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}

export async function addProject(
  name: string,
  description: string,
  tags: string[]
): Promise<Project> {
  const projects = await getProjects();
  const project: Project = {
    id: crypto.randomUUID(),
    name: name.slice(0, 100),
    description: description.slice(0, 1000),
    documents: [],
    tags: tags.slice(0, 10).map((t) => t.slice(0, 30)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  projects.push(project);
  await save(projects);
  return project;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, "name" | "description" | "tags">>
): Promise<void> {
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (project) {
    if (updates.name !== undefined) project.name = updates.name.slice(0, 100);
    if (updates.description !== undefined) project.description = updates.description.slice(0, 1000);
    if (updates.tags !== undefined)
      project.tags = updates.tags.slice(0, 10).map((t) => t.slice(0, 30));
    project.updated_at = new Date().toISOString();
    await save(projects);
  }
}

export async function removeProject(id: string): Promise<void> {
  let projects = await getProjects();
  projects = projects.filter((p) => p.id !== id);
  await save(projects);
}

export async function addDocument(
  projectId: string,
  filename: string,
  content: string,
  type: "pdf" | "text" | "file"
): Promise<ProjectDocument | undefined> {
  const projects = await getProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return undefined;

  const doc: ProjectDocument = {
    id: crypto.randomUUID(),
    filename: filename.slice(0, 200),
    content: content.slice(0, 10000),
    type,
    added_at: new Date().toISOString(),
  };
  project.documents.push(doc);
  project.updated_at = new Date().toISOString();
  await save(projects);
  return doc;
}

export async function removeDocument(
  projectId: string,
  documentId: string
): Promise<void> {
  const projects = await getProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.documents = project.documents.filter((d) => d.id !== documentId);
    project.updated_at = new Date().toISOString();
    await save(projects);
  }
}

export async function searchProjects(query: string): Promise<Project[]> {
  const projects = await getProjects();
  if (!query.trim()) return projects;
  const lower = query.toLowerCase();
  return projects.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower))
  );
}

/**
 * プロジェクトのコンテキストを構築（AI生成用）
 * projectのdescription + documents + tagsを結合し、keywordsで関連部分を優先
 */
export async function buildProjectContext(
  projectId: string,
  keywords?: string
): Promise<string> {
  const project = await getProject(projectId);
  if (!project) return "";

  let context = "";

  // 方向性
  if (project.description) {
    context += `【発信の方向性】\n${project.description}\n\n`;
  }

  // ドキュメントからコンテキスト構築
  if (project.documents.length > 0) {
    // キーワードがあれば関連度でソート
    let docs = project.documents;
    if (keywords) {
      const words = keywords
        .toLowerCase()
        .split(/[\s,、。．・\-_/]+/)
        .filter((w) => w.length > 1);

      if (words.length > 0) {
        const scored = docs.map((doc) => {
          const text = `${doc.filename} ${doc.content}`.toLowerCase();
          let score = 0;
          for (const word of words) {
            if (text.includes(word)) score++;
          }
          return { doc, score };
        });
        docs = scored.sort((a, b) => b.score - a.score).map((s) => s.doc);
      }
    }

    // 上位3ドキュメントからコンテキスト取得（合計8000文字まで）
    let totalChars = 0;
    const maxChars = 8000;
    const selectedDocs: string[] = [];

    for (const doc of docs.slice(0, 3)) {
      const remaining = maxChars - totalChars;
      if (remaining <= 0) break;
      const text = doc.content.slice(0, remaining);
      selectedDocs.push(`【${doc.filename}】\n${text}`);
      totalChars += text.length;
    }

    if (selectedDocs.length > 0) {
      context += `【参考資料】\n${selectedDocs.join("\n\n")}\n\n`;
    }
  }

  // タグ
  if (project.tags.length > 0) {
    context += `【関連タグ】${project.tags.join(", ")}\n`;
  }

  return context;
}
