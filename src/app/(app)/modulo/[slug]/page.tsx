import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import ProgressBar from "@/components/ProgressBar";

export const dynamic = "force-dynamic";

export default async function ModuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  const modulo = await db.module.findUnique({
    where: { slug },
    include: { lecciones: { orderBy: { orden: "asc" } } },
  });
  if (!modulo) notFound();

  const completados = await db.lessonProgress.findMany({
    where: { userId, status: "COMPLETED" },
    select: { lessonId: true },
  });
  const hechas = new Set(completados.map((p) => p.lessonId));
  const completadas = modulo.lecciones.filter((l) => hechas.has(l.id)).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link href="/inicio" className="text-blue-700 underline">
        ← Todos los temas
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{modulo.titulo}</h1>
      <div className="mt-4 max-w-md">
        <ProgressBar completadas={completadas} total={modulo.lecciones.length} />
      </div>

      <ol className="mt-8 space-y-3">
        {modulo.lecciones.map((l, i) => {
          const hecha = hechas.has(l.id);
          return (
            <li key={l.id}>
              <Link
                href={`/leccion/${l.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border-2 p-5 transition hover:border-blue-700 hover:bg-blue-50"
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                      hecha
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    aria-hidden="true"
                  >
                    {hecha ? "✓" : i + 1}
                  </span>
                  <span className="text-xl font-semibold">{l.titulo}</span>
                </span>
                <span className="shrink-0 text-base text-gray-600">
                  {l.minutosEstim} min{hecha ? " · hecha" : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
