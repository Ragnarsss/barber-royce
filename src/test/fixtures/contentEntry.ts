// Entrada mínima para los tests del plugin de contenido (BR-040): importa el módulo virtual y lo
// usa, así Rollup no lo elimina y el contenido queda dentro del bundle que se inspecciona.
import content from "virtual:site-content";

console.log(JSON.stringify(content));
