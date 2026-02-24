import { NextResponse } from "next/server";
import { optimizeTweet } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const suggestions = await optimizeTweet(text);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Optimize error:", error);
    return NextResponse.json({ error: "Failed to optimize" }, { status: 500 });
  }
}
