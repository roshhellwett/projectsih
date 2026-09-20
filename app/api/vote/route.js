import { NextResponse } from "next/server";
import { getAuthenticatedUser, getAdminClient } from "@/lib/server-auth";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* citizen toggles "me too" support on a problem */
export async function POST(req) {
  const { profile, error: authError, status: authStatus } = await getAuthenticatedUser(req);
  if (authError || !profile) {
    return NextResponse.json({ ok: false, error: authError || "Authentication required to vote" }, { status: authStatus || 401 });
  }

  const body = await req.json().catch(() => null);
  const { problem_id } = body || {};
  if (!problem_id) {
    return NextResponse.json({ ok: false, error: "problem_id is required" }, { status: 400 });
  }
  if (!UUID_RE.test(String(problem_id))) {
    return NextResponse.json({ ok: false, error: "problem_id must be a valid UUID" }, { status: 400 });
  }

  const user_id = profile.id;
  const admin = getAdminClient();

  /*
   * Toggle implemented as delete-then-insert rather than select-then-write.
   * The previous read-then-decide sequence raced: two concurrent requests could
   * both observe "no existing vote" and both insert, failing on the composite
   * primary key. A single DELETE is atomic, and a duplicate insert is treated as
   * "someone already voted" instead of an error.
   */
  const { data: removed, error: deleteError } = await admin
    .from("problem_votes")
    .delete()
    .eq("problem_id", problem_id)
    .eq("user_id", user_id)
    .select("problem_id");

  if (deleteError) {
    return NextResponse.json({ ok: false, error: deleteError.message }, { status: 500 });
  }

  let voted = false;

  if (!removed || removed.length === 0) {
    const { error: insertError } = await admin
      .from("problem_votes")
      .insert({ problem_id, user_id });

    if (insertError) {
      // 23505 = unique violation: a concurrent request already recorded the vote
      if (insertError.code === "23505") {
        voted = true;
      } else if (insertError.code === "23503") {
        return NextResponse.json({ ok: false, error: "Problem not found" }, { status: 404 });
      } else {
        return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
      }
    } else {
      voted = true;
    }
  }

  /*
   * Return the authoritative count from the view (real votes + demo traction)
   * so the client never has to guess the new total from an optimistic delta.
   */
  const { data: row } = await admin
    .from("problems_with_votes")
    .select("votes")
    .eq("id", problem_id)
    .maybeSingle();

  return NextResponse.json({ ok: true, voted, votes: row?.votes ?? null });
}

