import { NextResponse } from "next/server";
import { generateFromDocument } from "@/lib/claude";
import { searchBuzzTweets } from "@/lib/twitter";

export async function POST(request: Request) {
  try {
    const { text, projectId, keywords, useBuzz = true } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const buzzTweets = useBuzz ? await searchBuzzTweets(text.slice(0, 50)) : [];
    const suggestions = await generateFromDocument(text, projectId, keywords, buzzTweets);
    return NextResponse.json({ suggestions, buzzTweets });
  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json({ error: "Failed to generate from document" }, { status: 500 });
  }
}
