/* eslint-disable */
import { Project, SyntaxKind, ParameterDeclaration } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: false,
});

// Incluir también los archivos de prisma y pruebas si es necesario
project.addSourceFilesAtPaths("prisma/**/*.ts");
project.addSourceFilesAtPaths("scripts/**/*.ts");

console.log(`Analyzing ${project.getSourceFiles().length} files...`);

let anyReplaced = 0;
let unusedPrefixed = 0;
let unusedRemoved = 0;

for (const file of project.getSourceFiles()) {
  if (file.getFilePath().includes("node_modules")) continue;
  if (
    !file.getFilePath().includes("src/") &&
    !file.getFilePath().includes("prisma/") &&
    !file.getFilePath().includes("scripts/") &&
    !file.getFilePath().includes("e2e/")
  )
    continue;

  let modified = false;

  // 1. Replace explicit ANY
  const anyKeywords = file.getDescendantsOfKind(SyntaxKind.AnyKeyword);
  for (const anyKw of anyKeywords) {
    // Only replace explicit any keywords
    anyKw.replaceWithText("unknown");
    anyReplaced++;
    modified = true;
  }

  const asExpressions = file.getDescendantsOfKind(SyntaxKind.AsExpression);
  for (const exp of asExpressions) {
    if (exp.getTypeNode()?.getText() === "any") {
      exp.getTypeNode()?.replaceWithText("unknown");
      anyReplaced++;
      modified = true;
    }
  }

  // 2. We can't safely figure out unused vars perfectly just with ts-morph without diagnostic checking.
  // We can use the TypeScript language service to get unused errors.
  const diagnostics = file.getPreEmitDiagnostics();

  for (const diagnostic of diagnostics) {
    // TS6133 is for unused variables
    if (diagnostic.getCode() === 6133) {
      const nodeStart = diagnostic.getStart();
      if (nodeStart == null) continue;

      const node = file.getDescendantAtPos(nodeStart);
      if (!node) continue;

      const parent = node.getParent();

      // If it's a parameter, rename it with an underscore
      if (parent && parent.getKind() === SyntaxKind.Parameter) {
        const param = parent as ParameterDeclaration;
        const nameNode = param.getNameNode();
        if (nameNode.getKind() === SyntaxKind.Identifier) {
          const name = nameNode.getText();
          if (!name.startsWith("_")) {
            param.rename(`_${name}`);
            unusedPrefixed++;
            modified = true;
          }
        }
      }

      // If it's an import specifier, remove it
      if (parent && parent.getKind() === SyntaxKind.ImportSpecifier) {
        try {
          (parent as any).remove();
          unusedRemoved++;
          modified = true;
        } catch {
          // Ignore removal errors
        }
      }

      // If it's a default import, remove the whole import
      if (parent && parent.getKind() === SyntaxKind.ImportClause) {
        try {
          parent.getParentIfKind(SyntaxKind.ImportDeclaration)?.remove();
          unusedRemoved++;
          modified = true;
        } catch {
          // Ignore removal errors
        }
      }

      // If it's a variable declaration, and not exported, maybe remove it? Too risky for side effects.
    }
  }

  if (modified) {
    file.saveSync();
  }
}

console.log(
  `Finished!\nReplaced 'any' with 'unknown': ${anyReplaced}\nParameters prefixed with '_': ${unusedPrefixed}\nUnused imports removed: ${unusedRemoved}`
);
