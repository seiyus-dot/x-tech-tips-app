import { NextResponse } from "next/server";
import { summarizeUrl } from "@/lib/claude";
import { searchBuzzTweets } from "@/lib/twitter";

export async function POST(request: Request) {
  try {
    const { url, projectId, keywords, useBuzz = true } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Fetch the page content
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TechTipsBot/1.0)" },
    });
    const html = await response.text();

    // Simple HTML to text extraction
    const pageText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const buzzTweets = useBuzz ? await searchBuzzTweets(url.split("/").pop() || "") : [];
    const tweet = await summarizeUrl(url, pageText, projectId, keywords, buzzTweets);
    return NextResponse.json({ tweet, buzzTweets });
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
