import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/* ─── Sliding-Window In-Memory Rate Limiter ─── */
const rateLimitMap = new Map();
const CLEANUP_INTERVAL_MS = 60000;
let lastCleanup = Date.now();

function getClientIp(req) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

function checkRateLimit(ip, endpoint, limit = 30, windowMs = 60000) {
  const now = Date.now();

  // Periodic cleanup of stale entries
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [key, record] of rateLimitMap.entries()) {
      if (now - record.startTime > windowMs) {
        rateLimitMap.delete(key);
      }
    }
    lastCleanup = now;
  }

  const key = `${ip}:${endpoint}`;
  const record = rateLimitMap.get(key);

  if (!record || now - record.startTime > windowMs) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    const resetTime = Math.ceil((record.startTime + windowMs - now) / 1000);
    return { allowed: false, resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const ip = getClientIp(request);

  /* ── 1. API Rate Limiting for Spam Prevention ── */
  if (path.startsWith("/api/")) {
    let limit = 60;
    if (path.startsWith("/api/submit")) limit = 30; // Max 30 problem submissions per minute
    if (path.startsWith("/api/vote")) limit = 90; // Max 90 votes per minute
    if (path.startsWith("/api/demo-login")) limit = 45;

    const { allowed, resetTime } = checkRateLimit(ip, path, limit);
    if (!allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many requests. Please wait a moment before trying again.",
          retryAfterSeconds: resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(resetTime || 30),
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  let response = NextResponse.next({ request });

  /* ── 2. Cloudflare & Edge Headers ── */
  response.headers.set("X-Edge-Origin", "Cloudflare-Verified");
  response.headers.set("X-Content-Type-Options", "nosniff");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey || !url.startsWith("https://")) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refreshes the auth token and retrieves the authenticated user in a single request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guard the portal: must be logged in
  if (!user && path.startsWith("/portal")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|.*\\.(?:svg|png|jpg|webp)$).*)",
  ],
};
