import { NextResponse } from "next/server";
import { addDocument, removeDocument, getProject } from "@/lib/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ documents: project.documents });
  } catch (error) {
    console.error("Documents GET error:", error);
    return NextResponse.json({ error: "Failed to get documents" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let { filename, content, type } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    // PDF base64 → テキスト抽出
    if (typeof content === "string" && content.startsWith("__PDF_BASE64__")) {
      try {
        const base64 = content.slice("__PDF_BASE64__".length);
        const buffer = Buffer.from(base64, "base64");
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const result = await pdfParse(buffer);
        content = result.text;
        type = "pdf";
      } catch (pdfError) {
        console.error("PDF parse error:", pdfError);
        return NextResponse.json({ error: "PDFの読み取りに失敗しました" }, { status: 400 });
      }
    }

    const doc = await addDocument(
      id,
      filename || "テキスト入力",
      content,
      type || "text"
    );
    if (!doc) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Documents POST error:", error);
    return NextResponse.json({ error: "Failed to add document" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { documentId } = await request.json();
    if (!documentId) {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }
    await removeDocument(id, documentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Documents DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
