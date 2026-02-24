import { NextResponse } from "next/server";
import { getQueue, removeFromQueue, addToQueue, updateQueueItem } from "@/lib/queue";

export async function GET() {
  try {
    const queue = await getQueue();
    return NextResponse.json({ queue });
  } catch (error) {
    console.error("Queue GET error:", error);
    return NextResponse.json({ error: "Failed to get queue" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const item = await addToQueue(text);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Queue POST error:", error);
    return NextResponse.json({ error: "Failed to add to queue" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, text } = await request.json();
    if (!id || !text) {
      return NextResponse.json({ error: "id and text are required" }, { status: 400 });
    }
    await updateQueueItem(id, text);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Queue PUT error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await removeFromQueue(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Queue DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
