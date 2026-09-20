import * as Phosphor from "@phosphor-icons/react";
import fs from "fs";
import path from "path";

function getAllFiles(dir, exts = [".jsx", ".js"]) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next") {
        results = results.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.includes(path.extname(file))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = [
  ...getAllFiles("a:/projectsih/app"),
  ...getAllFiles("a:/projectsih/components"),
];

let invalidCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const regex = /import\s*\{([^}]+)\}\s*from\s*["']@phosphor-icons\/react["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const imports = match[1].split(",").map((s) => s.trim()).filter(Boolean);
    for (const item of imports) {
      const iconName = item.split(/\s+as\s+/)[0].trim();
      if (Phosphor[iconName] === undefined) {
        console.error(`❌ INVALID ICON in ${file}: "${iconName}"`);
        invalidCount++;
      }
    }
  }
}

if (invalidCount === 0) {
  console.log("✓ All Phosphor icon imports across app/ and components/ are 100% valid!");
} else {
  process.exit(1);
}
