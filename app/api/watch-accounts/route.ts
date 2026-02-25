import { NextResponse } from "next/server";
import {
  getWatchAccounts,
  addWatchAccount,
  removeWatchAccount,
} from "@/lib/watch-accounts";
import { resolveUserId } from "@/lib/twitter";

// GET: ウォッチアカウント一覧
export async function GET() {
  const accounts = getWatchAccounts();
  return NextResponse.json({ accounts });
}

// POST: アカウント追加 (username → resolve → save)
export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      );
    }

    const user = await resolveUserId(username);
    if (!user) {
      return NextResponse.json(
        { error: `@${username.replace(/^@/, "")} が見つかりませんでした` },
        { status: 404 }
      );
    }

    const account = addWatchAccount({
      id: user.id,
      username: user.username,
      name: user.name,
      added_at: new Date().toISOString(),
    });

    return NextResponse.json({ account });
  } catch (error) {
    console.error("Watch account add error:", error);
    return NextResponse.json(
      { error: "アカウントの追加に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE: アカウント削除
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const removed = removeWatchAccount(id);
    return NextResponse.json({ success: removed });
  } catch {
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 }
    );
  }
}
