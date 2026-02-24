import { NextResponse } from "next/server";
import { getNextPending, markAsPosted } from "@/lib/queue";
import { generateAutoTweet } from "@/lib/claude";
import { postTweet } from "@/lib/twitter";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let tweetText: string;

    // Check queue first
    const pendingItem = await getNextPending();
    if (pendingItem) {
      tweetText = pendingItem.text;
      await markAsPosted(pendingItem.id);
      console.log(`Posting from queue: ${pendingItem.id}`);
    } else {
      // Generate auto tweet
      tweetText = await generateAutoTweet();
      console.log("Generated auto tweet");
    }

    const result = await postTweet(tweetText);
    return NextResponse.json({
      success: true,
      source: pendingItem ? "queue" : "auto",
      tweet: result,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
