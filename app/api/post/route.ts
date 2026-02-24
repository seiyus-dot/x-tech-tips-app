import { NextResponse } from "next/server";
import { postTweet } from "@/lib/twitter";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const result = await postTweet(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Post error:", error);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}
