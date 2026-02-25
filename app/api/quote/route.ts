import { NextResponse } from "next/server";
import { generateQuoteComment } from "@/lib/claude";
import { postQuoteTweet } from "@/lib/twitter";

// 引用コメント生成
export async function POST(request: Request) {
  try {
    const { originalTweet, projectId, action, text, quoteTweetId } = await request.json();

    // action=post の場合: 引用RTを実際に投稿
    if (action === "post") {
      if (!text || !quoteTweetId) {
        return NextResponse.json({ error: "text and quoteTweetId are required" }, { status: 400 });
      }
      const result = await postQuoteTweet(text, quoteTweetId);
      return NextResponse.json({ success: true, tweet: result });
    }

    // デフォルト: 引用コメントを生成
    if (!originalTweet) {
      return NextResponse.json({ error: "originalTweet is required" }, { status: 400 });
    }
    const suggestions = await generateQuoteComment(originalTweet, projectId);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json({ error: "Failed to process quote" }, { status: 500 });
  }
}
