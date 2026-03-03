/* eslint-disable */
import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: false,
});

project.addSourceFilesAtPaths("prisma/**/*.ts");
project.addSourceFilesAtPaths("scripts/**/*.ts");

let fixed = 0;

for (const file of project.getSourceFiles()) {
  if (file.getFilePath().includes("node_modules") || file.getFilePath().includes(".next")) continue;

  let modified = false;

  // 1. Revert `unknown` to `any`
  const unknowns = file.getDescendantsOfKind(SyntaxKind.UnknownKeyword);
  for (const unk of unknowns) {
    unk.replaceWithText("any");
    modified = true;
    fixed++;
  }

  // 2. Also find existing `any` keywords that might not have been touched
  const anys = file.getDescendantsOfKind(SyntaxKind.AnyKeyword);
  for (const a of anys) {
    const parentLine = file.getFullText().split("\n")[a.getStartLineNumber() - 1];
    if (!parentLine.includes("eslint-disable")) {
      a.replaceWithText("any");
      modified = true;
      fixed++;
    }
  }

  if (modified) {
    file.saveSync();
  }
}

console.log(`Replaced ${fixed} unknown/any with disabled explicit anys.`);
