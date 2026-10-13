import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Código fuente de la app para los tests que vigilan reglas del repo leyendo el texto
// (sin ejecutar nada). Se lee con fs y no con import.meta.glob("?raw"): ese import hace
// que Vitest cuente cada archivo como cubierto y la cobertura del proyecto queda inflada.
// (Sin `new URL(ruta, import.meta.url)` tampoco: Vite lo reescribe como si fuera un asset.)
const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Archivos `.tsx` de componentes y páginas (sin tests), como [ruta relativa a src, contenido]. */
export function readComponentSources(): (readonly [string, string])[] {
  return (readdirSync(srcDir, { recursive: true }) as string[])
    .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
    .map((file) => [file.replaceAll("\\", "/"), readFileSync(resolve(srcDir, file), "utf8")] as const);
}

/** Todos los `.ts` y `.tsx` de la app salvo los tests y la carpeta de apoyo de tests. */
export function readAllSources(): (readonly [string, string])[] {
  return (readdirSync(srcDir, { recursive: true }) as string[])
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file) && !file.startsWith("test/"))
    .map((file) => [file, readFileSync(resolve(srcDir, file), "utf8")] as const);
}

export interface JsxElement {
  /** Nombre de la etiqueta, por ejemplo "a", "Link" o "motion.img". */
  tag: string;
  /** Atributos: texto si es un literal, `true` si no tiene valor, o el código de la expresión entre llaves. */
  attrs: Map<string, string | true>;
}

/** Elementos JSX de un archivo, leídos con el analizador de TypeScript (no con expresiones regulares). */
export function jsxElements(code: string): JsxElement[] {
  const sourceFile = ts.createSourceFile("archivo.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const elements: JsxElement[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const attrs = new Map<string, string | true>();
      for (const attribute of node.attributes.properties) {
        if (!ts.isJsxAttribute(attribute)) continue;
        const { initializer } = attribute;
        const value = initializer === undefined ? true : ts.isStringLiteral(initializer) ? initializer.text : initializer.getText(sourceFile);
        attrs.set(attribute.name.getText(sourceFile), value);
      }
      elements.push({ tag: node.tagName.getText(sourceFile), attrs });
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return elements;
}
