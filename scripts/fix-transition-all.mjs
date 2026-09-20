/* One-shot: replace `transition:all` with an explicit, compositor-safe
   property list. Run: node scripts/fix-transition-all.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "app", "globals.css");
let css = fs.readFileSync(file, "utf8");
const before = css;

/*
 * `transition: all` forces the browser to watch every animatable property,
 * including layout-affecting ones (width/height/padding/margin/top/left),
 * which is what makes it a performance hazard. These rules only ever animate
 * colour, border, shadow, transform and opacity — so enumerate exactly that,
 * keeping each rule's own duration and easing function.
 */
css = css.replace(
  /transition:all\s+([\d.]+m?s)\s+(var\(--ease\)|[a-z-]+)/g,
  (_m, dur, ease) =>
    `transition:color ${dur} ${ease},background-color ${dur} ${ease},` +
    `border-color ${dur} ${ease},box-shadow ${dur} ${ease},` +
    `transform ${dur} ${ease},opacity ${dur} ${ease}`
);

/* Same for the bare-duration variant with no easing function. */
css = css.replace(
  /transition:all\s+([\d.]+m?s)(?![\w-])/g,
  (_m, dur) =>
    `transition:color ${dur},background-color ${dur},border-color ${dur},` +
    `box-shadow ${dur},transform ${dur},opacity ${dur}`
);

if (css === before) {
  console.log("no transition:all found — nothing to do");
} else {
  fs.writeFileSync(file, css, "utf8");
  const n = (before.match(/transition:all/g) || []).length;
  console.log(`replaced ${n} transition:all declaration(s) in app/globals.css`);
}
