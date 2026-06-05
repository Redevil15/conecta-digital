import { promises as fs } from "fs";
import path from "path";

// Lee el markdown de una lección desde content/modulos/<modulo>/<n>.md.
// Devuelve null si aún no existe el archivo (la lección sigue siendo navegable).
export async function leerContenidoLeccion(
  moduloSlug: string,
  leccionSlug: string,
): Promise<string | null> {
  const n = leccionSlug.split("-").pop();
  const archivo = path.join(
    process.cwd(),
    "content",
    "modulos",
    moduloSlug,
    `${n}.md`,
  );
  try {
    return await fs.readFile(archivo, "utf8");
  } catch {
    return null;
  }
}
