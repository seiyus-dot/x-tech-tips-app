import { TwitterApi } from "twitter-api-v2";

function getClient(): TwitterApi {
  return new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });
}

export async function postTweet(text: string): Promise<{ id: string; text: string }> {
  const client = getClient();
  const result = await client.v2.tweet(text);
  return {
    id: result.data.id,
    text: result.data.text,
  };
}
