/* eslint-disable */
import { Project, SyntaxKind, ParameterDeclaration, VariableDeclaration } from "ts-morph";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
project.addSourceFilesAtPaths("src/**/*.ts");
project.addSourceFilesAtPaths("src/**/*.tsx");
project.addSourceFilesAtPaths("scripts/**/*.ts");

let updatedFiles = 0;

for (const sf of project.getSourceFiles()) {
  let changed = false;

  sf.getDescendantsOfKind(SyntaxKind.UnknownKeyword).forEach((node) => {
    const parent = node.getParent();

    if (parent) {
      if (parent.getKind() === SyntaxKind.Parameter) {
        // remove explicit unknown type to let ts infer
        const param = parent as ParameterDeclaration;
        // Don't remove error/err type in catch blocks, they must be unknown or any
        // wait, catch clause parameters don't have explicit type annotations in TS except `any` or `unknown`.
        if (param.getParent()?.getKind() === SyntaxKind.CatchClause) {
          return;
        }

        if (param.getName() === "error" || param.getName() === "err") {
          // We'll leave it unknown and fix the usages if needed, or remove it so it infers?
          // Parameters named error usually are in callbacks or catch.
        }

        param.removeType();
        changed = true;
      } else if (parent.getKind() === SyntaxKind.VariableDeclaration) {
        const varDecl = parent as VariableDeclaration;
        const name = varDecl.getName();

        if (name === "where" || name === "whereClause") {
          // we can't reliably guess the model, let's use Record<string, unknown> NO, that causes prisma errors.
          // Prisma accepts object literal loosely if typed as Prisma.xxxxWhereInput.
          // But Prisma query requires exactly the generated type or similar.
          // Actually, we can remove the explicit type! `const where = {}` works for Prisma!
          varDecl.removeType();

          // Wait, if it removes type, TS infers `const where = {}` and then `where.foo = "bar"` causes TS2339.
          // We can change it to Record<string, any> but ESLint complains.
          // We can change it to `Record<string, unknown>` and fix assignments, but it's hard.
          // Better: parse the filename to guess the model? "transportista/historial/route.ts" -> SolicitudRetiro.
          if (sf.getFilePath().includes("transportista/historial"))
            varDecl.setType('import("@prisma/client").Prisma.SolicitudRetiroWhereInput');
          else if (sf.getFilePath().includes("reportes/exportar/route"))
            varDecl.setType('import("@prisma/client").Prisma.SolicitudRetiroWhereInput');
          else if (sf.getFilePath().includes("gestor/certificados/route"))
            varDecl.setType('import("@prisma/client").Prisma.CertificadoWhereInput');
          else if (sf.getFilePath().includes("solicitudes/[id]/route"))
            varDecl.setType('import("@prisma/client").Prisma.SolicitudRetiroWhereInput');
          else varDecl.setType("Record<string, any>"); // To be fixed properly later
        } else if (name === "updateData" || name === "data") {
          if (sf.getFilePath().includes("user/profile/route.ts"))
            varDecl.setType('import("@prisma/client").Prisma.UserUpdateInput');
          else if (sf.getFilePath().includes("transportista/validacion-legal"))
            varDecl.setType('import("@prisma/client").Prisma.CarrierLegalProfileUpdateInput');
          else if (sf.getFilePath().includes("gestor/validacion-legal"))
            varDecl.setType('import("@prisma/client").Prisma.ManagerLegalProfileUpdateInput');
          else if (sf.getFilePath().includes("solicitudes/[id]/route"))
            varDecl.setType('import("@prisma/client").Prisma.SolicitudRetiroUpdateInput');
          else varDecl.setType("unknown");
        } else if (name === "auth" || name === "payload" || name.includes("Mutation")) {
          varDecl.removeType();
        } else if (name === "orderByClause") {
          if (sf.getFilePath().includes("transportista/historial"))
            varDecl.setType(
              'import("@prisma/client").Prisma.SolicitudRetiroOrderByWithRelationInput'
            );
        } else {
          // Other variables
          if (
            name === "producto" ||
            name === "solicitud" ||
            name === "vehiculo" ||
            name === "doc" ||
            name === "est" ||
            name === "config" ||
            name === "lote" ||
            name === "tratamiento" ||
            name === "recepcion"
          ) {
            varDecl.removeType();
          }
        }
        changed = true;
      }
    }
  });

  if (changed) {
    sf.saveSync();
    updatedFiles++;
  }
}

console.log("Updated files:", updatedFiles);
