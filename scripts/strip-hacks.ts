/* eslint-disable */
import { Project } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: false,
});

project.addSourceFilesAtPaths("src/**/*.tsx");
project.addSourceFilesAtPaths("src/**/*.ts");

let stripped = 0;

for (const file of project.getSourceFiles()) {
  const text = file.getFullText();
  if (text.includes("/* eslint-disable-line @typescript-eslint/no-explicit-any */")) {
    const newText = text.replace(
      / \/\* eslint-disable-line @typescript-eslint\/no-explicit-any \*\//g,
      ""
    );
    file.replaceWithText(newText);
    file.saveSync();
    stripped++;
  }
}

console.log(`Stripped hacks from ${stripped} files.`);
