import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function optimizeTweet(text: string): Promise<string[]> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `あなたはXの投稿を最適化するプロです。以下のメモ・アイデアから、バズりやすいツイートを3パターン作ってください。

メモ: ${text}

ルール:
- 各ツイートは最大270文字
- 1-2個のハッシュタグを含める
- 具体的でアクション可能な内容にする
- マークダウンは使わない
- 各案は改行で区切る

以下のJSON形式で回答してください:
["案1", "案2", "案3"]`,
      },
    ],
  });

  const content = (message.content[0] as { type: "text"; text: string }).text;
  try {
    return JSON.parse(content);
  } catch {
    return content.split("\n").filter((line) => line.trim().length > 0).slice(0, 3);
  }
}

export async function summarizeUrl(url: string, pageText: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `以下のWebページの内容をもとに、X（Twitter）の投稿を1つ作ってください。

URL: ${url}
ページ内容:
${pageText.slice(0, 3000)}

ルール:
- 最大240文字（URLを末尾に付けるため余裕を持たせる）
- ページの核心を短く伝える
- 1-2個のハッシュタグを含める
- マークダウンは使わない
- URLは含めないで（後で自動付与します）`,
      },
    ],
  });

  const tweet = (message.content[0] as { type: "text"; text: string }).text.trim();
  return `${tweet}\n${url}`;
}

export async function planTweets(theme: string, days: number): Promise<string[]> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `「${theme}」というテーマで、${days}日分のX（Twitter）投稿を企画してください。

ルール:
- 各ツイートは最大270文字
- 日ごとに異なる切り口（基礎→応用→Tips→よくある間違い→ベストプラクティス等）
- 1-2個のハッシュタグを含める
- マークダウンは使わない
- 連続性があり、シリーズとして魅力的な構成にする

以下のJSON配列で回答してください（${days}個の要素）:
["Day1の投稿", "Day2の投稿", ...]`,
      },
    ],
  });

  const content = (message.content[0] as { type: "text"; text: string }).text;
  try {
    return JSON.parse(content);
  } catch {
    return content.split("\n").filter((line) => line.trim().length > 0).slice(0, days);
  }
}

export async function generateAutoTweet(): Promise<string> {
  const topics = [
    "Python", "JavaScript", "TypeScript", "React", "Git",
    "Docker", "SQL", "API design", "Testing", "Security",
  ];
  const styles = [
    "a practical tip with a code example",
    "a common mistake and the correct approach",
    "a lesser-known feature that saves time",
  ];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const style = styles[Math.floor(Math.random() * styles.length)];

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Write a single tweet (max 270 characters) about ${topic}. The tweet should be ${style}. Include 1-2 relevant hashtags. Do not use markdown formatting.`,
      },
    ],
  });

  return (message.content[0] as { type: "text"; text: string }).text.trim();
}
