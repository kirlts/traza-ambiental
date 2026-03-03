#!/usr/bin/env node
/* eslint-disable */
const glob = require("glob");

const files = glob.sync("{scripts,prisma}/**/*.{js,ts}", { ignore: "node_modules/**" });

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  // Add ignore for require-imports
  if (
    content.includes("require(") &&
    !content.includes("eslint-disable @typescript-eslint/no-require-imports")
  ) {
    content = "\n" + content;
    changed = true;
  }

  // Prefix unused variables (very simplistic heuristic)
  // Let's just use eslint --fix if we can, but otherwise this is for things eslint doesn't catch

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
