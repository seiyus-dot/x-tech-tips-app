import { NextResponse } from "next/server";
import { searchBuzzTweets } from "@/lib/twitter";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    if (!query) {
      return NextResponse.json({ error: "q is required" }, { status: 400 });
    }
    const maxResults = Math.min(parseInt(searchParams.get("count") || "10"), 30);
    const minLikes = parseInt(searchParams.get("minLikes") || "0");
    const startTime = searchParams.get("startTime") || undefined;
    const endTime = searchParams.get("endTime") || undefined;

    const tweets = await searchBuzzTweets(query, {
      maxResults,
      minLikes,
      startTime,
      endTime,
    });
    return NextResponse.json({ tweets });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Buzz API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
