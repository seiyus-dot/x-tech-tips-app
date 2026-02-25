import { NextResponse } from "next/server";
import { getItemForSlot, getNextPending, markAsPosted } from "@/lib/queue";
import { generateAutoTweet } from "@/lib/claude";
import { postTweet } from "@/lib/twitter";
import { getSettings } from "@/lib/settings";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSettings();

    // Get current JST time
    const now = new Date();
    const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const currentHH = String(jstNow.getUTCHours()).padStart(2, "0");
    const currentMM = String(jstNow.getUTCMinutes()).padStart(2, "0");
    const currentDate = jstNow.toISOString().split("T")[0];

    // Find matching slot (within ±15 min window)
    const currentMinutes = parseInt(currentHH) * 60 + parseInt(currentMM);
    const matchingSlot = settings.schedule_slots.find((slot) => {
      const [h, m] = slot.split(":").map(Number);
      const slotMinutes = h * 60 + m;
      return Math.abs(slotMinutes - currentMinutes) <= 15;
    });

    if (!matchingSlot) {
      return NextResponse.json({ skipped: true, reason: "No matching slot" });
    }

    // Find queue item for this slot
    let tweetText: string;
    const targetItem = await getItemForSlot(currentDate, matchingSlot);

    if (targetItem) {
      tweetText = targetItem.text;
      await markAsPosted(targetItem.id);
      console.log(`Posting from slot ${matchingSlot}: ${targetItem.id}`);
    } else if (settings.auto_generate_when_empty) {
      // Fallback: try any pending item, then auto-generate
      const anyPending = await getNextPending();
      if (anyPending) {
        tweetText = anyPending.text;
        await markAsPosted(anyPending.id);
        console.log(`Posting fallback pending: ${anyPending.id}`);
      } else {
        tweetText = await generateAutoTweet();
        console.log("Generated auto tweet");
      }
    } else {
      return NextResponse.json({ skipped: true, reason: "No item for slot" });
    }

    const result = await postTweet(tweetText);
    return NextResponse.json({
      success: true,
      slot: matchingSlot,
      tweet: result,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
