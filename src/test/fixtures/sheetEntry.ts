// Entrada mínima para probar qué sabe el navegador de la hoja (BR-047): importa el módulo virtual y lo usa,
// así Rollup no lo elimina y su contenido queda dentro del bundle que se inspecciona.
import source from "virtual:site-sheet";

console.log(JSON.stringify(source));
