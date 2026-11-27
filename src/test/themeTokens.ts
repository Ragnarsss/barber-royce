import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "vitest";

// Lector de tokens CSS para los tests del tema de La Serena (BR-113). Lee los tokens reales de `src/styles/tokens/`,
// así que cambiar un valor sin revisar su par o su regla falla en los tests.
const tokensDir = resolve(dirname(fileURLToPath(import.meta.url)), "../styles/tokens");
const TOKEN_FILES = ["colors.css", "typography.css", "radius.css"] as const;

function readTokens(file: string): string {
  return readFileSync(resolve(tokensDir, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Las declaraciones `--nombre: valor;` de un selector, juntando los tres archivos de tokens. */
function block(selector: string): Map<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const entries: Array<[string, string]> = [];
  for (const file of TOKEN_FILES) {
    const body = readTokens(file).match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) entries.push([name, value.trim().replace(/\s+/g, " ")]);
  }
  return new Map(entries);
}

export const ROOT = block(":root");
export const LA_SERENA = block('[data-branch="la-serena"]');

/** Resuelve un token siguiendo sus `var(--otro)`; `scope` pisa a `:root`, como hace el navegador. */
export function resolveToken(name: string, scope: Map<string, string>, depth = 0): string | undefined {
  const raw = scope.get(name) ?? ROOT.get(name);
  const reference = raw?.match(/^var\(\s*(--[\w-]+)\s*\)$/)?.[1];
  if (raw === undefined || depth > 8) return undefined;
  return reference ? resolveToken(reference, scope, depth + 1) : raw;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export function colorOf(name: string, scope: Map<string, string>): string {
  const value = resolveToken(name, scope);
  expect(value, `${name} no está definido o no es un color #rrggbb`).toMatch(/^#[0-9a-fA-F]{6}$/);
  return value!;
}
