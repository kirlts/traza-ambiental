/* eslint-disable */
const code = `
try {
} catch (e: any) {
  console.log(e.message);
}
`;

import * as ts from "typescript";

const result = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
console.log(result.outputText);
