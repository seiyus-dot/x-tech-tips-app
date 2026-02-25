import { NextResponse } from "next/server";
import {
  getProjects,
  addProject,
  updateProject,
  removeProject,
  searchProjects,
} from "@/lib/projects";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search") || "";
    const projects = query ? await searchProjects(query) : await getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Failed to get projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, tags } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const project = await addProject(name, description || "", tags || []);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description, tags } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await updateProject(id, { name, description, tags });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Projects PUT error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await removeProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
