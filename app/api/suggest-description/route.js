import { NextResponse } from "next/server";
import { suggestDescription } from "@/lib/ai.js";
import { getAuthenticatedUser } from "@/lib/server-auth.js";

/*
 * AI auto-description drafting.
 *
 * This route calls a paid/quota-limited LLM, so it MUST be authenticated —
 * otherwise the public anon surface can be used to drain the Groq quota.
 */
export async function POST(req) {
  try {
    const { profile, error: authError, status: authStatus } = await getAuthenticatedUser(req);
    if (authError || !profile) {
      return NextResponse.json(
        { ok: false, error: authError || "Authentication required" },
        { status: authStatus || 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const title = body?.title;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
    }

    if (title.length > 200) {
      return NextResponse.json({ ok: false, error: "Title must be 200 characters or fewer" }, { status: 400 });
    }

    const description = await suggestDescription(title.trim());
    if (!description) {
      return NextResponse.json({ ok: false, error: "Failed to generate description" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, description });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

