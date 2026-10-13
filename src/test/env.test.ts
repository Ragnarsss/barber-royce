import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { readAllSources } from "./sourceFiles";

// BR-010 (RNF-SEG-002): ningún secreto en el repo y variables de entorno documentadas.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const gitignore = readFileSync(resolve(root, ".gitignore"), "utf8").split(/\r?\n/);
const envExample = readFileSync(resolve(root, ".env.example"), "utf8");

describe("variables de entorno (BR-010)", () => {
  it(".gitignore excluye los .env y deja pasar solo .env.example", () => {
    expect(gitignore).toContain(".env");
    expect(gitignore).toContain(".env.*");
    expect(gitignore).toContain("!.env.example");
  });

  it(".env.example no trae valores: ninguna línea activa asigna algo", () => {
    const assignments = envExample
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"))
      .filter((line) => /=\s*\S/.test(line));

    expect(assignments).toEqual([]);
  });

  it("toda VITE_* que usa el código está documentada en .env.example", () => {
    const used = new Set(
      readAllSources().flatMap(([, code]) => [...code.matchAll(/import\.meta\.env\.(VITE_[A-Z0-9_]+)/g)].map((m) => m[1])),
    );
    const undocumented = [...used].filter((name) => !envExample.includes(name));

    expect(undocumented).toEqual([]);
  });
});
