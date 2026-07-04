import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { marcarIniciada, marcarCompletada } from "@/lib/progress";
import { leerContenidoLeccion } from "@/lib/content";
import BotonCompletar from "@/components/BotonCompletar";

export const dynamic = "force-dynamic";

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  const leccion = await db.lesson.findFirst({
    where: { slug },
    include: { module: { include: { lecciones: { orderBy: { orden: "asc" } } } } },
  });
  if (!leccion) notFound();

  // Registrar que la lección fue ABIERTA (idempotente).
  await marcarIniciada(leccion.id);

  // ¿Ya está completada por este usuario?
  const progreso = await db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: leccion.id } },
  });
  const hecha = progreso?.status === "COMPLETED";

  // Lección anterior / siguiente dentro del módulo.
  const lecciones = leccion.module.lecciones;
  const idx = lecciones.findIndex((l) => l.id === leccion.id);
  const anterior = idx > 0 ? lecciones[idx - 1] : null;
  const siguiente = idx < lecciones.length - 1 ? lecciones[idx + 1] : null;

  const contenido = await leerContenidoLeccion(leccion.module.slug, leccion.slug);

  // "Terminar tema": marca completada esta última lección y regresa al tema.
  const lessonId = leccion.id;
  const moduleSlug = leccion.module.slug;
  async function terminarTema() {
    "use server";
    await marcarCompletada(lessonId);
    redirect(`/modulo/${moduleSlug}`);
  }

  return (
    <article className="mx-auto max-w-2xl px-6 py-8">
      <Link href={`/modulo/${leccion.module.slug}`} className="text-blue-700 underline">
        ← {leccion.module.titulo}
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold">{leccion.titulo}</h1>
        <p className="mt-1 text-base text-gray-600">
          Lección {idx + 1} de {lecciones.length} · {leccion.minutosEstim} min
          aprox.
        </p>
      </header>

      <div className="contenido-leccion mt-6">
        {contenido ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Cada imagen del Markdown se muestra con su descripción como pie de
              // foto. Si el archivo aún no existe, el pie sigue explicando el paso.
              img: ({ src, alt }) => (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />
                  {alt ? (
                    <figcaption className="text-center text-base text-gray-600">
                      {alt}
                    </figcaption>
                  ) : null}
                </figure>
              ),
            }}
          >
            {contenido}
          </ReactMarkdown>
        ) : (
          <p className="rounded-xl bg-amber-50 p-4 text-lg text-amber-800">
            El contenido de esta lección se está preparando. Aun así puedes
            marcarla y avanzar.
          </p>
        )}
      </div>

      <div className="mt-10">
        <BotonCompletar lessonId={leccion.id} hecha={hecha} />
      </div>

      <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Navegación entre lecciones">
        {anterior ? (
          <Link
            href={`/leccion/${anterior.slug}`}
            className="rounded-xl border-2 border-blue-700 px-6 py-3 text-lg font-semibold text-blue-700 hover:bg-blue-50"
          >
            ← Anterior
          </Link>
        ) : (
          <span />
        )}
        {siguiente ? (
          <Link
            href={`/leccion/${siguiente.slug}`}
            className="rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800"
          >
            Siguiente →
          </Link>
        ) : (
          <form action={terminarTema}>
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800"
            >
              Terminar tema →
            </button>
          </form>
        )}
      </nav>
    </article>
  );
}
