import { NextResponse } from "next/server";
import { getWatchAccounts } from "@/lib/watch-accounts";
import { getUserTimeline } from "@/lib/twitter";
import type { BuzzTweet } from "@/lib/twitter";

// GET: ウォッチアカウント全員 or 特定アカウントのタイムラインを取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId"); // 特定アカウントのみ
    const count = Math.min(parseInt(searchParams.get("count") || "10"), 30);

    const accounts = getWatchAccounts();
    if (accounts.length === 0) {
      return NextResponse.json({ tweets: [], message: "ウォッチアカウントが登録されていません" });
    }

    const targetAccounts = accountId
      ? accounts.filter((a) => a.id === accountId)
      : accounts;

    if (targetAccounts.length === 0) {
      return NextResponse.json({ tweets: [] });
    }

    // 各アカウントのタイムラインを並列取得
    const perAccount = Math.max(Math.floor(count / targetAccounts.length), 5);
    const results = await Promise.all(
      targetAccounts.map((a) => getUserTimeline(a.id, perAccount))
    );

    // 全アカウントのツイートをまとめてスコア順
    const allTweets: BuzzTweet[] = results.flat();
    allTweets.sort((a, b) => b.score - a.score);

    return NextResponse.json({ tweets: allTweets.slice(0, count) });
  } catch (error) {
    console.error("Timeline API error:", error);
    return NextResponse.json(
      { error: "タイムラインの取得に失敗しました" },
      { status: 500 }
    );
  }
}
