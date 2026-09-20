#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════
   Design-token integrity verifier
   ────────────────────────────────────────────────────────────────
   Guards the invariant that broke production styling before:

     A Tailwind colour declared as a raw `var(--x)` silently emits
     NOTHING for opacity modifiers (`bg-surface/95`, `text-paper/70`).
     Tailwind v3 requires the alpha-aware form:
         rgb(var(--x-rgb) / <alpha-value>)
     which in turn requires every hex token to have a matching
     `--x-rgb: r g b` channel triplet, in BOTH `:root` and `.theme-night`.

   Asserts:
     1. Every hex token in :root has a -rgb triplet that matches exactly.
     2. Every .theme-night override of a token also overrides its -rgb mirror.
     3. Every token referenced by tailwind.config.js has an -rgb triplet.
     4. Every tailwind colour uses the `rgb(var(--…-rgb) / <alpha-value>)` form.

   Exits non-zero on any violation. Run via: npm run verify:tokens
   ════════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");
const tw = fs.readFileSync(path.join(root, "tailwind.config.js"), "utf8");

const errors = [];
const notes = [];

/** Extract `--name:value` declarations from the CSS block starting at `startIndex`. */
function readBlock(startIndex) {
  if (startIndex < 0) return null;
  const open = css.indexOf("{", startIndex);
  if (open === -1) return null;
  let depth = 0;
  let end = -1;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return null;
  const vars = {};
  const re = /--([a-z0-9-]+)\s*:\s*([^;}]+)/gi;
  let m;
  while ((m = re.exec(css.slice(open + 1, end))) !== null) {
    vars[m[1].toLowerCase()] = m[2].trim();
  }
  return vars;
}

const hexToTriplet = (hex) => {
  const h = hex.trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)).join(" ");
};

const isColour = (v) => /^#[0-9a-fA-F]{3,8}$/.test(v.trim());
const isTriplet = (v) => /^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/.test(v.trim());

const rootVars = readBlock(css.indexOf(":root"));
const themeVars = readBlock(css.indexOf(".theme-night"));

if (!rootVars) errors.push("globals.css: could not locate the `:root` token block.");

const checkBlock = (vars, label) => {
  if (!vars) return;
  for (const [name, value] of Object.entries(vars)) {
    if (!isColour(value)) continue;
    const triplet = vars[`${name}-rgb`];
    if (!triplet) {
      if (rootVars && rootVars[`${name}-rgb`]) {
        errors.push(`${label}: \`--${name}\` is overridden but \`--${name}-rgb\` is not — opacity variants would keep the light-theme colour.`);
      }
      continue;
    }
    const expected = hexToTriplet(value);
    if (!expected) {
      errors.push(`${label}: \`--${name}: ${value}\` is not a parseable hex colour.`);
      continue;
    }
    if (triplet.replace(/\s+/g, " ") !== expected) {
      errors.push(`${label}: \`--${name}-rgb\` is "${triplet}" but \`--${name}\` (${value}) converts to "${expected}".`);
    }
  }
};

checkBlock(rootVars, ":root");
checkBlock(themeVars, ".theme-night");

/* ── 3. tailwind.config.js ↔ globals.css ── */
const stripComments = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
const twColorBlock = stripComments(
  tw.slice(tw.indexOf("colors:"), tw.indexOf("fontFamily:"))
);
const rgbRefs = [...twColorBlock.matchAll(/var\(--([a-z0-9-]+)\)/gi)].map((m) => m[1].toLowerCase());

for (const ref of new Set(rgbRefs)) {
  if (!ref.endsWith("-rgb")) {
    errors.push(`tailwind.config.js: references \`var(--${ref})\` — colours must use the \`*-rgb\` channel triplet so opacity modifiers work.`);
  } else if (rootVars && rootVars[ref] === undefined) {
    errors.push(`tailwind.config.js: references \`var(--${ref})\`, which is not declared in globals.css :root.`);
  }
}

if (rootVars) {
  const surfaced = new Set(rgbRefs);
  for (const name of Object.keys(rootVars)) {
    if (name.endsWith("-rgb") && !surfaced.has(name)) {
      notes.push(`:root declares \`--${name}\` but tailwind.config.js never consumes it.`);
    }
  }
}

/* ── 4. alpha-aware form ── */
for (const m of twColorBlock.matchAll(/([a-z0-9-]+)\s*:\s*(?:\{\s*DEFAULT:\s*)?"([^"]+)"/gi)) {
  const [, key, value] = m;
  if (!value.includes("var(--")) continue;
  if (!/^rgb\(var\(--[a-z0-9-]+\)\s*\/\s*<alpha-value>\)$/.test(value)) {
    errors.push(`tailwind.config.js: colour "${key}" is "${value}" — expected \`rgb(var(--…-rgb) / <alpha-value>)\`.`);
  }
}

/* ── Report ── */
console.log("── Design token integrity ──");
console.log(`  :root hex tokens       : ${Object.values(rootVars ?? {}).filter(isColour).length}`);
console.log(`  :root -rgb triplets    : ${Object.entries(rootVars ?? {}).filter(([k, v]) => k.endsWith("-rgb") && isTriplet(v)).length}`);
console.log(`  .theme-night overrides : ${Object.values(themeVars ?? {}).filter(isColour).length}`);
console.log(`  tailwind -rgb refs     : ${new Set(rgbRefs).size}`);

if (notes.length) {
  console.log("\n  notes:");
  for (const n of notes) console.log(`   · ${n}`);
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} token problem(s):`);
  for (const e of errors) console.error(`   ✗ ${e}`);
  process.exit(1);
}

console.log("\n✓ All design tokens are alpha-aware and in sync — opacity modifiers will render.");
