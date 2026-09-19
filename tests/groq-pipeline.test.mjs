/* ════════════════════════════════════════════════════════════════
   SETU — Full Pipeline & Groq Integration Test Suite
   - Tests classification (English & Hindi input)
   - Tests auto-description (English & Hindi input)
   - Tests university proposal synthesis
   - Tests priority formula bounds & urgent words
   - Tests Haversine geospatial proximity
   - Tests token & cosine similarity
   ════════════════════════════════════════════════════════════════ */
import {
  classify,
  suggestDescription,
  generateProposalDraft,
  priorityScore,
  haversine,
  cosine,
  tokens,
  CATS,
} from "../lib/ai.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ FAILED: ${message}`);
    failed++;
  }
}

console.log("─── 1. Testing Classification Across Categories ───");
const testCases = [
  { text: "Primary school roof collapsed during monsoon rains in Bundu", expected: "education" },
  { text: "CHC hospital has no oxygen cylinders and doctors absent", expected: "health" },
  { text: "Drought in Palamu destroyed 40 acres of paddy crops", expected: "agriculture" },
  { text: "Arsenic in drinking water wells across 5 villages", expected: "water" },
  { text: "Main culvert washed out on Ranchi-Ramgarh highway", expected: "infrastructure" },
  { text: "Illegal mica mining dust causing acute asthma in children", expected: "environment" },
];

for (const tc of testCases) {
  const result = await classify(tc.text);
  assert(
    result.category === tc.expected,
    `Classified "${tc.expected}": got=${result.category} (engine=${result.engine})`
  );
}

console.log("\n─── 2. Testing Multilingual Hindi Auto-Description ───");
const hindiTitle = "हैंडपंप खराब है और पानी नहीं आ रहा";
const autoDescHindi = await suggestDescription(hindiTitle);
assert(
  typeof autoDescHindi === "string" && autoDescHindi.length > 30,
  `Generated description for Hindi title "${hindiTitle}": ${autoDescHindi.slice(0, 70)}…`
);

console.log("\n─── 3. Testing Academic Proposal Drafting (University) ───");
const sampleProblem = {
  title: "Solar Fluoride Removal for Fluorosis-affected Villages",
  category: "water",
  district: "Deoghar",
  description: "Groundwater fluoride levels exceed 3.5 mg/L causing skeletal fluorosis in school children.",
};
const proposal = await generateProposalDraft(sampleProblem);
assert(
  proposal && proposal.title && Array.isArray(proposal.methodology) && proposal.recommendedFundingINR > 0,
  `Proposal generated: "${proposal.title}" (Funding: ₹${proposal.recommendedFundingINR.toLocaleString("en-IN")})`
);

console.log("\n─── 4. Testing Priority Scoring ───");
const highPrio = priorityScore("urgent repair emergency collapsed hazard ambulance", 25, 45);
assert(highPrio.score >= 8.0, `Urgent report scored high priority: ${highPrio.score}/10`);

const lowPrio = priorityScore("routine repainting suggested for town hall", 1, 2);
assert(lowPrio.score <= 3.0, `Routine report scored low priority: ${lowPrio.score}/10`);

console.log("\n─── 5. Testing Geospatial Proximity (Haversine) ───");
const ranchiLat = 23.35, ranchiLng = 85.33;
const nearbyLat = 23.37, nearbyLng = 85.34;
const distanceKm = haversine(ranchiLat, ranchiLng, nearbyLat, nearbyLng);
assert(
  distanceKm !== null && distanceKm < 4.0 && distanceKm > 1.0,
  `Distance correctly calculated: ${distanceKm?.toFixed(2)} km (expected ~2.4 km)`
);

console.log("\n─── 6. Testing Token Similarity & Deduplication Pre-filter ───");
const t1 = tokens("Hand pump broken in village square near anganwadi");
const t2 = tokens("Handpump broken near the anganwadi center");
const sim = cosine(t1, t2);
assert(sim > 0.4, `Token similarity detected related problems: ${(sim * 100).toFixed(0)}%`);

console.log(`\n════════════════════════════════════════`);
console.log(`RESULTS: ${passed} passed, ${failed} failed.`);
console.log(`════════════════════════════════════════`);

process.exit(failed > 0 ? 1 : 0);
