import Anthropic from "@anthropic-ai/sdk";
import { env } from "./env";
import { buildProjectContext } from "./projects";
import { getSettings } from "./settings";
import type { BuzzTweet } from "./twitter";

function getClient() {
  return new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });
}

async function getProjectPrompt(
  projectId?: string,
  keywords?: string
): Promise<string> {
  try {
    const settings = await getSettings();
    if (!settings.projects_enabled) return "";
    if (!projectId) return "";

    const context = await buildProjectContext(projectId, keywords);
    if (!context) return "";

    return `\n\n以下のプロジェクト情報を参考にして、この方向性に沿った投稿を作ってください：\n${context}\n`;
  } catch {
    return "";
  }
}

function buildBuzzContext(buzzTweets?: BuzzTweet[]): string {
  if (!buzzTweets || buzzTweets.length === 0) return "";

  const lines = buzzTweets.map(
    (t, i) => `${i + 1}. [${t.likes.toLocaleString()}♡ ${t.retweets.toLocaleString()}RT] ${t.text}`
  );

  return `\n\n以下はこのテーマで実際にバズっているX投稿です。構成・文体・フック（冒頭の引き）を参考にしてください。ただし内容はコピーせず、あくまで「なぜバズっているか」の構造を学んで活かしてください：\n${lines.join("\n")}\n`;
}

export async function optimizeTweet(
  text: string,
  projectId?: string,
  keywords?: string,
  buzzTweets?: BuzzTweet[]
): Promise<string[]> {
  const projectCtx = await getProjectPrompt(projectId, keywords || text);
  const buzzCtx = buildBuzzContext(buzzTweets);

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    temperature: 0.9,
    system: "あなたはX（Twitter）のバズ投稿を作るプロのコピーライターです。毎回全く異なるアプローチ・切り口・文体で投稿を生成してください。同じような構成・フレーズの繰り返しは厳禁です。",
    messages: [
      {
        role: "user",
        content: `以下のメモ・アイデアから、バズりやすいツイートを3パターン作ってください。
3つは全く異なるアプローチにしてください:
- パターン1: 共感・問いかけ型（読者に語りかける）
- パターン2: 具体的なデータ・事実型（数字やファクトで惹きつける）
- パターン3: ストーリー・体験談型（自分の体験として語る）

メモ: ${text}
${projectCtx}${buzzCtx}
ルール:
- 各ツイートは最大270文字
- 1-2個のハッシュタグを含める
- 具体的でアクション可能な内容にする
- マークダウンは使わない
- 絵文字は控えめに（0-2個まで）
- 定型的な導入（「〇〇が話題」「〇〇してみた」等）を毎回使わない

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

export async function summarizeUrl(
  url: string,
  pageText: string,
  projectId?: string,
  keywords?: string,
  buzzTweets?: BuzzTweet[]
): Promise<string> {
  const projectCtx = await getProjectPrompt(
    projectId,
    keywords || pageText.slice(0, 200)
  );
  const buzzCtx = buildBuzzContext(buzzTweets);

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    temperature: 0.8,
    system: "あなたはX（Twitter）のバズ投稿を作るプロのコピーライターです。記事の核心を鋭く切り取り、読者が思わずクリックしたくなる投稿を作ります。",
    messages: [
      {
        role: "user",
        content: `以下のWebページの内容をもとに、X（Twitter）の投稿を1つ作ってください。

URL: ${url}
ページ内容:
${pageText.slice(0, 3000)}
${projectCtx}${buzzCtx}
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

export async function planTweets(
  theme: string,
  days: number,
  projectId?: string,
  keywords?: string,
  buzzTweets?: BuzzTweet[]
): Promise<string[]> {
  const projectCtx = await getProjectPrompt(projectId, keywords || theme);
  const buzzCtx = buildBuzzContext(buzzTweets);

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0.9,
    system: "あなたはX（Twitter）のコンテンツプランナーです。日ごとに全く異なる切り口・文体・トーンで投稿を企画します。シリーズ感を出しつつ、マンネリにならない構成を心がけてください。",
    messages: [
      {
        role: "user",
        content: `「${theme}」というテーマで、${days}日分のX（Twitter）投稿を企画してください。
${projectCtx}${buzzCtx}
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

export async function generateFromDocument(
  text: string,
  projectId?: string,
  keywords?: string,
  buzzTweets?: BuzzTweet[]
): Promise<string[]> {
  const projectCtx = await getProjectPrompt(
    projectId,
    keywords || text.slice(0, 200)
  );
  const buzzCtx = buildBuzzContext(buzzTweets);

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    temperature: 0.9,
    system: "あなたはX（Twitter）のバズ投稿を作るプロのコピーライターです。資料から最も価値のあるインサイトを抽出し、全く異なる3つのアプローチで投稿を作ります。",
    messages: [
      {
        role: "user",
        content: `以下の資料・テキストを読み込んで、X（Twitter）に投稿できるコンテンツを3パターン作ってください。

資料内容:
${text.slice(0, 5000)}
${projectCtx}${buzzCtx}
ルール:
- 各ツイートは最大270文字
- 資料の要点・インサイトを抽出して投稿に変換する
- 1パターン目: 要点まとめ形式
- 2パターン目: 深掘り・考察形式
- 3パターン目: 学び・引用形式
- 1-2個のハッシュタグを含める
- マークダウンは使わない

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

/**
 * バズ投稿に対する引用RTコメントを3パターン生成
 */
export async function generateQuoteComment(
  originalTweet: string,
  projectId?: string
): Promise<string[]> {
  const projectCtx = await getProjectPrompt(projectId, originalTweet.slice(0, 100));

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    temperature: 0.9,
    system: "あなたはXで影響力のある発信者です。引用RTでは自分の視点・体験を加えて付加価値を出します。テンプレ的な反応ではなく、その人ならではの意見を述べます。",
    messages: [
      {
        role: "user",
        content: `以下のX投稿に対する引用リツイートのコメントを3パターン作ってください。

元投稿:
「${originalTweet}」
${projectCtx}
ルール:
- 各コメントは最大200文字（引用RT分のURL余白を確保）
- 自分の視点・知見を加えて付加価値を出す
- パターン: ①共感+補足 ②別角度の意見 ③実体験ベース
- 自然で人間味のある口調
- マークダウンは使わない
- 1個のハッシュタグを含めてもOK

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

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    temperature: 1.0,
    system: "あなたはXで影響力のある日本語の技術発信者です。毎回異なる切り口・文体で投稿を作ります。",
    messages: [
      {
        role: "user",
        content: `${topic}について、${style}のスタイルでX投稿を1つ作ってください。最大270文字。1-2個のハッシュタグ。マークダウンは使わない。日本語で。`,
      },
    ],
  });

  return (message.content[0] as { type: "text"; text: string }).text.trim();
}
