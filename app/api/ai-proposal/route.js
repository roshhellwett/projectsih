import { NextResponse } from "next/server";
import { getAuthenticatedUser, getAdminClient } from "@/lib/server-auth.js";
import { generateProposalDraft } from "@/lib/ai.js";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { authUser, profile, error: authError } = await getAuthenticatedUser(req);
    if (authError || !profile) {
      return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
    }

    if (profile.role !== "university" && profile.role !== "admin") {
      return NextResponse.json(
        { ok: false, error: "Forbidden: AI proposal drafting is available for university partners and admins." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const { problem_id, problem } = body || {};

    let targetProblem = problem;
    if (!targetProblem && problem_id) {
      const admin = getAdminClient();
      const { data, error } = await admin
        .from("problems")
        .select("id,title,description,category,district")
        .eq("id", problem_id)
        .maybeSingle();

      if (error || !data) {
        return NextResponse.json({ ok: false, error: "Problem not found" }, { status: 404 });
      }
      targetProblem = data;
    }

    if (!targetProblem?.title || !targetProblem?.description) {
      return NextResponse.json({ ok: false, error: "Problem title and description are required" }, { status: 400 });
    }

    const draft = await generateProposalDraft(targetProblem);

    return NextResponse.json({
      ok: true,
      draft,
      source: "groq-llama-3.3-70b",
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
