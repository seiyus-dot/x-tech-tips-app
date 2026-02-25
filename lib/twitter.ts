import { TwitterApi } from "twitter-api-v2";
import { env } from "./env";

function getClient(): TwitterApi {
  return new TwitterApi({
    appKey: env.X_API_KEY,
    appSecret: env.X_API_SECRET,
    accessToken: env.X_ACCESS_TOKEN,
    accessSecret: env.X_ACCESS_TOKEN_SECRET,
  });
}

export interface BuzzTweet {
  id: string;
  text: string;
  likes: number;
  retweets: number;
  score: number;
  authorName: string;
  authorUsername: string;
  tweetUrl: string;
}

export interface BuzzSearchOptions {
  maxResults?: number;
  minLikes?: number;
  startTime?: string; // ISO 8601 (例: "2026-02-20T00:00:00Z")
  endTime?: string;
}

/**
 * テーマに関連する投稿を検索
 * X API v2 Recent Search → いいね+RT数でスコアリング → 上位を返す
 *
 * Free プラン制約:
 * - max_results は最大10件/リクエスト
 * - sort_order, min_faves 等の高度なオペレーターは使えない
 * - 直近7日分のみ検索可能
 *
 * そのため複数回リクエスト(ページネーション)で取得件数を増やし、
 * 取得後にスコアでフィルタリングする方式を採用
 */
export async function searchBuzzTweets(
  query: string,
  opts: BuzzSearchOptions = {}
): Promise<BuzzTweet[]> {
  const { maxResults = 10, minLikes = 0, startTime, endTime } = opts;

  try {
    const client = getClient();

    const searchQuery = `${query} lang:ja -is:retweet -is:reply`;

    const params: Record<string, unknown> = {
      max_results: 10,
      "tweet.fields": ["public_metrics", "created_at", "author_id"],
      expansions: ["author_id"],
      "user.fields": ["name", "username"],
    };
    if (startTime) params.start_time = startTime;
    if (endTime) params.end_time = endTime;

    // ページネーションで最大3回(30件)取得してプールを広げる
    const allTweets: BuzzTweet[] = [];
    const users = new Map<string, { name: string; username: string }>();
    let nextToken: string | undefined;
    const maxPages = 3;

    for (let page = 0; page < maxPages; page++) {
      const reqParams = { ...params } as Record<string, unknown>;
      if (nextToken) reqParams.next_token = nextToken;

      const result = await client.v2.search(searchQuery, reqParams);

      if (!result.data?.data) break;

      // ユーザー情報を蓄積
      if (result.data?.includes?.users) {
        for (const user of result.data.includes.users) {
          users.set(user.id, { name: user.name, username: user.username });
        }
      }

      for (const tweet of result.data.data) {
        const metrics = tweet.public_metrics;
        const likes = metrics?.like_count ?? 0;
        const retweets = metrics?.retweet_count ?? 0;
        const author = users.get(tweet.author_id ?? "") ?? { name: "", username: "" };
        allTweets.push({
          id: tweet.id,
          text: tweet.text,
          likes,
          retweets,
          score: likes + retweets * 2,
          authorName: author.name,
          authorUsername: author.username,
          tweetUrl: author.username ? `https://x.com/${author.username}/status/${tweet.id}` : "",
        });
      }

      // 次のページがあるか
      nextToken = result.data.meta?.next_token;
      if (!nextToken) break;
    }

    // 最低いいね数でフィルタリング → スコア順 → 上位を返す
    return allTweets
      .filter((t) => t.likes >= minLikes)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  } catch (error) {
    console.error("Buzz search error:", error);
    return [];
  }
}

/**
 * @username → X API v2 user ID に変換
 */
export async function resolveUserId(username: string): Promise<{ id: string; name: string; username: string } | null> {
  try {
    const client = getClient();
    const cleaned = username.replace(/^@/, "");
    const result = await client.v2.userByUsername(cleaned, {
      "user.fields": ["name", "username", "profile_image_url"],
    });
    if (!result.data) return null;
    return {
      id: result.data.id,
      name: result.data.name,
      username: result.data.username,
    };
  } catch (error) {
    console.error("Resolve user error:", error);
    return null;
  }
}

/**
 * 指定ユーザーの最新ツイートを取得
 * X API v2 User Tweet Timeline
 */
export async function getUserTimeline(
  userId: string,
  maxResults: number = 10
): Promise<BuzzTweet[]> {
  try {
    const client = getClient();
    const result = await client.v2.userTimeline(userId, {
      max_results: Math.min(maxResults, 100),
      "tweet.fields": ["public_metrics", "created_at", "author_id"],
      expansions: ["author_id"],
      "user.fields": ["name", "username"],
      exclude: ["retweets", "replies"],
    });

    if (!result.data?.data) return [];

    // ユーザー情報
    const users = new Map<string, { name: string; username: string }>();
    if (result.data?.includes?.users) {
      for (const user of result.data.includes.users) {
        users.set(user.id, { name: user.name, username: user.username });
      }
    }

    return result.data.data.map((tweet) => {
      const metrics = tweet.public_metrics;
      const likes = metrics?.like_count ?? 0;
      const retweets = metrics?.retweet_count ?? 0;
      const author = users.get(tweet.author_id ?? "") ?? { name: "", username: "" };
      return {
        id: tweet.id,
        text: tweet.text,
        likes,
        retweets,
        score: likes + retweets * 2,
        authorName: author.name,
        authorUsername: author.username,
        tweetUrl: author.username ? `https://x.com/${author.username}/status/${tweet.id}` : "",
      };
    });
  } catch (error) {
    console.error("User timeline error:", error);
    return [];
  }
}

export async function postTweet(text: string): Promise<{ id: string; text: string }> {
  const client = getClient();
  const result = await client.v2.tweet(text);
  return {
    id: result.data.id,
    text: result.data.text,
  };
}

/**
 * 引用リツイート
 * quote_tweet_id で元ツイートを引用しつつコメントを投稿
 */
export async function postQuoteTweet(
  text: string,
  quoteTweetId: string
): Promise<{ id: string; text: string }> {
  const client = getClient();
  const result = await client.v2.tweet({
    text,
    quote_tweet_id: quoteTweetId,
  });
  return {
    id: result.data.id,
    text: result.data.text,
  };
}
