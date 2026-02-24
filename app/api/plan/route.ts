import { NextResponse } from "next/server";
import { planTweets } from "@/lib/claude";
import { addManyToQueue } from "@/lib/queue";

export async function POST(request: Request) {
  try {
    const { theme, days = 7 } = await request.json();
    if (!theme) {
      return NextResponse.json({ error: "theme is required" }, { status: 400 });
    }
    const tweets = await planTweets(theme, days);
    const items = await addManyToQueue(tweets);
    return NextResponse.json({ tweets, items });
  } catch (error) {
    console.error("Plan error:", error);
    return NextResponse.json({ error: "Failed to plan" }, { status: 500 });
  }
}
