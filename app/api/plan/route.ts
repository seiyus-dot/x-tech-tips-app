import { NextResponse } from "next/server";
import { planTweets } from "@/lib/claude";
import { addManyToQueue } from "@/lib/queue";
import { searchBuzzTweets } from "@/lib/twitter";

export async function POST(request: Request) {
  try {
    const { theme, days = 7, projectId, keywords, useBuzz = true } = await request.json();
    if (!theme) {
      return NextResponse.json({ error: "theme is required" }, { status: 400 });
    }
    const buzzTweets = useBuzz ? await searchBuzzTweets(theme) : [];
    const tweets = await planTweets(theme, days, projectId, keywords, buzzTweets);
    const items = await addManyToQueue(tweets);
    return NextResponse.json({ tweets, items, buzzTweets });
  } catch (error) {
    console.error("Plan error:", error);
    return NextResponse.json({ error: "Failed to plan" }, { status: 500 });
  }
}
