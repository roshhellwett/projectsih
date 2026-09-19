import { NextResponse } from "next/server";
import { getAuthenticatedUser, getAdminClient } from "@/lib/server-auth.js";

const VALID_STATUSES = ["submitted", "routed", "proposal_submitted", "in_progress", "resolved"];

export async function POST(req) {
  try {
    const { authUser, profile, error: authError } = await getAuthenticatedUser(req);
    if (authError || !profile) {
      return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
    }

    if (profile.role !== "admin" && profile.role !== "university") {
      return NextResponse.json({ ok: false, error: "Forbidden: Only administrators and universities can update problem status." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const { problem_id, status, routed_to, resolution_notes } = body || {};

    if (!problem_id || !status) {
      return NextResponse.json({ ok: false, error: "problem_id and status are required" }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ ok: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    const admin = getAdminClient();

    // Fetch existing problem
    const { data: existing, error: fetchErr } = await admin
      .from("problems")
      .select("id, title, status, submitted_by, routed_to, district")
      .eq("id", problem_id)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ ok: false, error: "Problem not found" }, { status: 404 });
    }

    // If caller is university, verify they are the routed party
    if (profile.role === "university" && existing.routed_to !== profile.id) {
      return NextResponse.json({ ok: false, error: "Forbidden: You are not assigned to this problem." }, { status: 403 });
    }

    const updatePayload = {
      status,
    };

    if (routed_to && profile.role === "admin") {
      updatePayload.routed_to = routed_to;
    }

    const { error: updateErr } = await admin
      .from("problems")
      .update(updatePayload)
      .eq("id", problem_id);

    if (updateErr) {
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    // Insert audit notification
    const notifications = [];
    const shortTitle = (existing.title || "").slice(0, 40);

    if (status === "resolved") {
      notifications.push({
        send_to: "citizen",
        channel: "SMS",
        text: `Resolution Confirmed: Ticket "${shortTitle}…" has been marked Resolved. Thank you for reporting on SETU.`,
      });
      notifications.push({
        send_to: "admin",
        channel: "In-app",
        text: `Problem "${shortTitle}…" in ${existing.district} was officially marked RESOLVED by ${profile.name}.`,
      });
    } else if (status === "in_progress") {
      notifications.push({
        send_to: "citizen",
        channel: "SMS",
        text: `Work in Progress: Project deployment is underway for "${shortTitle}…".`,
      });
    } else if (status === "routed" && routed_to) {
      notifications.push({
        send_to: "university",
        channel: "In-app",
        text: `New problem assigned: "${shortTitle}…" routed to your institution for technical appraisal.`,
      });
    }

    if (notifications.length > 0) {
      await admin.from("notifications").insert(notifications);
    }

    return NextResponse.json({
      ok: true,
      problem_id,
      previous_status: existing.status,
      new_status: status,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
