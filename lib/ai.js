/* ════════════════════════════════════════════════════════════════
   SAHYOG — Groq AI Engine (server-side only)
   - 1. Classify   → Groq (GROQ_MODEL_FAST) with explainable keyword fallback
   - 2. Dedup      → 2-stage hybrid: spatial + token pre-filter, then Groq arbiter
   - 3. Priority   → transparent explainable formula (local & instant)
   - 4. Route      → category-domain matching & least-loaded university
   - 5. Assist     → Groq multilingual auto-description & proposal drafting

   Model ids are configurable via GROQ_MODEL_FAST / GROQ_MODEL_DEEP and are
   reported back to the client (AI_MODELS) rather than hard-coded, so the
   explainability panel can never advertise a model we did not actually call.
   ════════════════════════════════════════════════════════════════ */
import { getAdminClient } from "./admin-client.js";

export const CATS = ["education", "health", "agriculture", "water", "infrastructure", "environment", "other"];
export const CAT_LABEL = {
  education: "Education",
  health: "Health",
  agriculture: "Agriculture",
  water: "Water",
  infrastructure: "Infrastructure",
  environment: "Environment",
  other: "Other",
};

export const DEPARTMENTS = {
  education: "School Education & Literacy Department",
  health: "Health, Medical Education & Family Welfare Department",
  agriculture: "Department of Agriculture, Animal Husbandry & Co-operative",
  water: "Drinking Water & Sanitation Department",
  infrastructure: "Road Construction & Urban Development Department",
  environment: "Department of Forest, Environment & Climate Change",
  other: "Department of Planning & Development",
};

const KEYWORDS = {
  education: ["school", "teacher", "student", "anganwadi", "classroom", "dropout", "iti", "textbook", "toilet", "class 8", "midday", "children", "blackboard", "college", "vidyalaya", "shiksha"],
  health: ["doctor", "phc", "chc", "hospital", "illness", "disease", "health", "medicine", "asha", "patient", "kidney", "pregnan", "ambulance", "meal", "clinic", "swasthya", "dawakhana"],
  agriculture: ["crop", "paddy", "farm", "irrigation", "seed", "acre", "harvest", "soil", "agri", "livestock", "pond desilt", "fertilizer", "kisan", "kheti", "fasal"],
  water: ["hand pump", "handpump", "water", "tube well", "tubewell", "well", "arsenic", "drinking", "pond", "drying", "desilt", "pipeline", "paani", "jal", "chapakal"],
  infrastructure: ["road", "pothole", "culvert", "bridge", "street light", "streetlight", "embankment", "drain", "sewage", "building", "tower", "network", "electricity", "power", "roof", "leak", "hall", "renovation", "light", "sadak", "pull"],
  environment: ["dust", "mine", "mica", "weed", "waste", "dump", "pollution", "tree", "plantation", "elephant", "forest", "hyacinth", "remediation", "paryavaran", "kachra", "pradushan"],
};

const URGENT = [
  "urgent", "immediately", "emergency", "ambulance", "collapsed", "breach", "contaminated",
  "dry", "broken", "washed out", "no doctor", "urgent repair", "children", "pregnan", "danger", "hazard", "casualty"
];

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "has", "have", "had", "no", "for", "to",
  "and", "in", "on", "at", "of", "with", "near", "from", "our", "this", "that", "it",
  "not", "been", "very", "week", "weeks", "month", "months", "request", "need", "needed", "problem"
]);

const GROQ_MODEL_FAST = process.env.GROQ_MODEL_FAST || "groq/compound-mini";
const GROQ_MODEL_DEEP = process.env.GROQ_MODEL_DEEP || "groq/compound-mini";

/**
 * The models actually in use, so API responses and the UI can report the truth
 * instead of a hard-coded (and previously incorrect) "llama-3.3-70b" label.
 */
export const AI_MODELS = { fast: GROQ_MODEL_FAST, deep: GROQ_MODEL_DEEP };

/** Engine tag surfaced to the client for the explainability panel. */
const fastEngineTag = () => `groq:${GROQ_MODEL_FAST}`;

/**
 * Robust wrapper for calling Groq OpenAI-compatible API
 */
async function callGroq({ messages, model = GROQ_MODEL_FAST, temperature = 0.1, max_tokens = 300, response_format = null, timeout = 9000 }) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || !groqKey.trim()) return null;

  try {
    const payload = {
      model,
      messages,
      temperature,
      max_tokens,
    };
    if (response_format) {
      payload.response_format = response_format;
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey.trim()}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeout),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`Groq API responded with status ${res.status}:`, errText.slice(0, 200));
      return null;
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn("Groq API request failed, falling back to local engine:", err.message);
    return null;
  }
}

/* ── 1. CLASSIFY ── */
export async function classify(text) {
  const clean = (text || "").slice(0, 2500);

  // Attempt Groq classification with Llama 3.1 8B Instant
  const groqResult = await callGroq({
    model: GROQ_MODEL_FAST,
    messages: [
      {
        role: "system",
        content: `You are the AI triage coordinator for the Government of Jharkhand civic grievance portal (SAHYOG).
Classify the given problem description into EXACTLY ONE of the following 7 categories:
education, health, agriculture, water, infrastructure, environment, other.

Respond with JSON format:
{
  "category": "education" | "health" | "agriculture" | "water" | "infrastructure" | "environment" | "other",
  "confidence": "high" | "medium" | "low",
  "urgency": "low" | "medium" | "high" | "critical"
}`,
      },
      { role: "user", content: clean },
    ],
    response_format: { type: "json_object" },
    temperature: 0.0,
    max_tokens: 100,
    timeout: 6000,
  });

  if (groqResult) {
    try {
      const parsed = JSON.parse(groqResult);
      const cat = (parsed.category || "").toLowerCase().trim();
      if (CATS.includes(cat)) {
        return {
          category: cat,
          engine: fastEngineTag(),
          confidence: parsed.confidence || "high",
          department: DEPARTMENTS[cat] || DEPARTMENTS.other,
          urgency: parsed.urgency || "medium",
        };
      }
    } catch {
      // Fall through to regex word-boundary fallback
      const raw = groqResult.toLowerCase();
      const matched = CATS.find((c) => new RegExp(`\\b${c}\\b`, "i").test(raw));
      if (matched) {
        return {
          category: matched,
          engine: fastEngineTag(),
          confidence: "high",
          department: DEPARTMENTS[matched] || DEPARTMENTS.other,
          urgency: "medium",
        };
      }
    }
  }

  // Deterministic Keyword Fallback
  const t = clean.toLowerCase();
  const scores = {};
  for (const cat in KEYWORDS) {
    let s = 0;
    for (const k of KEYWORDS[cat]) {
      if (t.includes(k)) s += k.includes(" ") ? 2 : 1;
    }
    scores[cat] = s;
  }
  let best = "other", max = 0;
  for (const c in scores) {
    if (scores[c] > max) {
      max = scores[c];
      best = c;
    }
  }
  return {
    category: best,
    engine: "keyword",
    confidence: max === 0 ? "low" : max >= 4 ? "high" : "medium",
    department: DEPARTMENTS[best] || DEPARTMENTS.other,
    urgency: max >= 3 ? "high" : "medium",
  };
}

/* ── 2. LOCAL TOKEN UTILITIES ── */
export const tokens = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

export function cosine(a, b) {
  const fa = {}, fb = {};
  a.forEach((w) => (fa[w] = (fa[w] || 0) + 1));
  b.forEach((w) => (fb[w] = (fb[w] || 0) + 1));
  let dot = 0, na = 0, nb = 0;
  for (const w in fa) {
    na += fa[w] * fa[w];
    if (fb[w]) dot += fa[w] * fb[w];
  }
  for (const w in fb) nb += fb[w] * fb[w];
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

/**
 * Calculates great-circle distance between two points in km.
 * Returns null if any coordinate is missing or invalid.
 */
export function haversine(lat1, lng1, lat2, lng2) {
  if (
    typeof lat1 !== "number" || isNaN(lat1) ||
    typeof lng1 !== "number" || isNaN(lat1) ||
    typeof lat2 !== "number" || isNaN(lat2) ||
    typeof lng2 !== "number" || isNaN(lng2)
  ) {
    return null;
  }
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* ── 3. GROQ DUPLICATE ARBITER ── */
export async function evaluateDuplicateWithGroq(newProb, candidateProb) {
  const prompt = `Compare these two civic problem reports submitted in the same district in Jharkhand:
REPORT A (New):
Title: ${newProb.title}
Description: ${newProb.description}
Address: ${newProb.address || "N/A"}

REPORT B (Existing):
Title: ${candidateProb.title}
Description: ${candidateProb.description}
Address: ${candidateProb.address || "N/A"}

Determine if both reports describe the SAME underlying physical issue, failure, or location (duplicate report).
Respond strictly in JSON:
{
  "isDuplicate": boolean,
  "confidenceScore": number between 0.0 and 1.0,
  "reason": "short explanation in 1 sentence"
}`;

  const result = await callGroq({
    model: GROQ_MODEL_DEEP,
    messages: [
      { role: "system", content: "You are an expert municipal data deduplication engine. Return valid JSON." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 150,
    timeout: 7000,
  });

  if (result) {
    try {
      const parsed = JSON.parse(result);
      return {
        isDuplicate: Boolean(parsed.isDuplicate),
        score: typeof parsed.confidenceScore === "number" ? parsed.confidenceScore : 0.8,
        reason: parsed.reason || "",
      };
    } catch {}
  }
  return null;
}

/* ── 4. PRIORITY SCORING (Explainable & Formulaic) ── */
export function priorityScore(text, votes = 0, daysUnresolved = 0) {
  const t = (text || "").toLowerCase();
  let hits = 0;
  const hitWords = [];
  for (const k of URGENT) {
    if (t.includes(k)) {
      hits++;
      hitWords.push(k);
    }
  }
  const score = Math.min(
    10,
    +(1.0 + hits * 1.2 + Math.min(votes, 80) * 0.06 + Math.min(daysUnresolved, 60) * 0.05).toFixed(1)
  );
  return { score, hits, hitWords };
}

/* ── 5. FULL INGEST PIPELINE ── */
export async function runPipeline({ title, description, district, address, latitude, longitude, submitted_by }) {
  const admin = getAdminClient();
  const full = `${title}. ${description}`;

  /* Step 1: Classify with Groq Llama 3.1 8B (or Keyword fallback) */
  const cls = await classify(full);

  /* Step 2: 2-Stage Hybrid Deduplication */
  let dup = null;
  let dupScore = 0;
  let dupEngine = "none";
  let dupReason = "";

  const { data: nearby } = await admin
    .from("problems_with_votes")
    .select("id,title,description,votes,latitude,longitude,category,status")
    .ilike("district", district)
    .limit(300);

  const candidates = nearby || [];
  const toks = tokens(full);

  // Score candidate similarities
  const scoredCandidates = [];
  for (const p of candidates) {
    const km = haversine(latitude, longitude, p.latitude, p.longitude);
    const isNearby = km !== null ? km <= 5 : true;
    const sim = cosine(toks, tokens(`${p.title} ${p.description}`));

    if (isNearby && sim >= 0.3) {
      scoredCandidates.push({ problem: p, sim, km });
    }
  }

  // Sort descending by lexical similarity
  scoredCandidates.sort((a, b) => b.sim - a.sim);

  if (scoredCandidates.length > 0) {
    const top = scoredCandidates[0];

    // Try Stage 2: Deep Groq LLM Adjudication
    if (process.env.GROQ_API_KEY && top.sim >= 0.35) {
      const groqEval = await evaluateDuplicateWithGroq(
        { title, description, address },
        top.problem
      );
      if (groqEval && groqEval.isDuplicate && groqEval.score >= 0.55) {
        dup = top.problem;
        dupScore = groqEval.score;
        dupEngine = "groq-hybrid";
        dupReason = groqEval.reason;
      }
    }

    // Stage 3 Fallback: Spatial + Lexical Cosine
    if (!dup) {
      const threshold = top.km !== null ? 0.55 : 0.65;
      if (top.sim >= threshold) {
        dup = top.problem;
        dupScore = top.sim;
        dupEngine = "token-cosine";
        dupReason = `High lexical overlap (${(top.sim * 100).toFixed(0)}%) within ${top.km !== null ? top.km.toFixed(1) + "km" : "same district"}`;
      }
    }
  }

  const isDup = dup !== null;

  /* Step 3: Priority Scoring */
  const pr = priorityScore(full, isDup ? (dup.votes || 0) : 0, 0);

  /* Step 4: Routing — University matching category with least open load */
  let routedTo = null;
  if (!isDup) {
    const { data: unis } = await admin
      .from("users")
      .select("id,name,domain_expertise")
      .eq("role", "university")
      .limit(50);

    const { data: openCounts } = await admin
      .from("problems")
      .select("routed_to")
      .neq("status", "resolved")
      .not("routed_to", "is", null);

    const load = {};
    (openCounts || []).forEach((r) => (load[r.routed_to] = (load[r.routed_to] || 0) + 1));
    const matches = (unis || []).filter((u) => Array.isArray(u.domain_expertise) && u.domain_expertise.includes(cls.category));
    if (matches.length) {
      routedTo = matches.sort((a, b) => (load[a.id] || 0) - (load[b.id] || 0))[0].id;
    }
  }

  return {
    cls,
    isDup,
    dup,
    dupScore,
    dupEngine,
    dupReason,
    pr,
    routedTo,
  };
}

/* ── 6. MULTILINGUAL AUTO-DESCRIPTION (Groq deep model) ── */
export async function suggestDescription(title, language = "auto") {
  if (!title || !title.trim()) return null;

  const result = await callGroq({
    model: GROQ_MODEL_DEEP,
    messages: [
      {
        role: "system",
        content: `You are an assistant for SAHYOG, the civic grievance portal of Jharkhand, India.
Given a short problem title (which might be in English, Hindi, or Hinglish), write a clear, respectful, and actionable 2-3 sentence description explaining:
1. Exactly what infrastructure or civic service is broken or failing.
2. The specific impact on local citizens and daily life.
3. The immediate technical intervention required.

If the user typed in Hindi or Hinglish, write the description in formal English suitable for government records.
Output ONLY the clean 2-3 sentence description text, with no conversational filler.`,
      },
      { role: "user", content: `Title: ${title.trim()}` },
    ],
    temperature: 0.3,
    max_tokens: 200,
    timeout: 8000,
  });

  if (result) {
    return result.trim();
  }

  // Clean offline template fallback
  return `Civic issue reported regarding "${title.trim()}". The local community faces ongoing difficulties due to this condition. Urgent inspection and repair by municipal authorities is requested to restore normal public access and safety.`;
}

/* ── 7. AI UNIVERSITY PROPOSAL GENERATOR (Groq deep model) ── */
export async function generateProposalDraft(problem) {
  const result = await callGroq({
    model: GROQ_MODEL_DEEP,
    messages: [
      {
        role: "system",
        content: `You are an academic project director at a premier technical institution in Jharkhand (e.g. BIT Mesra, BAU, NIT Jamshedpur) preparing a technical solution proposal for a verified state civic problem.
Synthesize a structured research and deployment proposal in JSON format:
{
  "title": "Academic / Solution Project Title",
  "hypothesis": "1-2 sentence core technological / scientific approach",
  "methodology": ["Phase 1: Field Assessment", "Phase 2: Prototype / Low-cost intervention", "Phase 3: Community handover"],
  "teamStructure": ["Lead Faculty / PI", "Postgraduate Researcher", "Field Engineers"],
  "proposalText": "A comprehensive 150-word proposal summary suitable for government sanction and corporate CSR sponsorship.",
  "recommendedFundingINR": integer amount in Indian Rupees (e.g. 250000)
}`,
      },
      {
        role: "user",
        content: `Problem: ${problem.title}
Category: ${problem.category}
District: ${problem.district}
Description: ${problem.description}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 600,
    timeout: 10000,
  });

  if (result) {
    try {
      return JSON.parse(result);
    } catch {}
  }

  // Deterministic fallback proposal template
  return {
    title: `Sustainable Community Solution for ${problem.title.slice(0, 40)}`,
    hypothesis: `Deploying localized engineering interventions and community-led monitoring to remediate the ${problem.category} challenge in ${problem.district}.`,
    methodology: [
      "Phase 1: Baseline field testing and site survey",
      "Phase 2: Low-cost modular engineering deployment",
      "Phase 3: Validation and municipal training",
    ],
    teamStructure: ["Faculty Project Lead", "2 Research Scholars", "Field Coordinator"],
    proposalText: `This university proposal outlines a structured, data-driven intervention to resolve the ${problem.category} issue reported in ${problem.district}. Our team will conduct rapid on-site assessment, deploy appropriate low-cost technology, and provide technical oversight until full municipal integration is achieved.`,
    recommendedFundingINR: 350000,
  };
}
