import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import ProgressBar from "@/components/ProgressBar";

export const dynamic = "force-dynamic";

const EMOJI: Record<string, string> = {
  mail: "✉️",
  "message-circle": "💬",
  "file-text": "📄",
  shield: "🛡️",
};

export default async function InicioPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  const modulos = await db.module.findMany({
    orderBy: { orden: "asc" },
    include: { lecciones: { orderBy: { orden: "asc" } } },
  });

  const completados = await db.lessonProgress.findMany({
    where: { userId, status: "COMPLETED" },
    select: { lessonId: true },
  });
  const hechas = new Set(completados.map((p) => p.lessonId));

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-3xl font-bold">Elige un tema para aprender</h1>
      <p className="mt-2 text-lg text-gray-700">
        Cada lección dura solo unos minutos. Avanza a tu ritmo.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {modulos.map((m) => {
          const completadas = m.lecciones.filter((l) => hechas.has(l.id)).length;
          return (
            <Link
              key={m.id}
              href={`/modulo/${m.slug}`}
              className="block rounded-2xl border-2 p-6 transition hover:border-blue-700 hover:bg-blue-50 focus-visible:border-blue-700"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl" aria-hidden="true">
                  {EMOJI[m.icono] ?? "📘"}
                </span>
                <h2 className="text-2xl font-bold">{m.titulo}</h2>
              </div>
              <p className="mt-2 text-lg text-gray-700">{m.descripcion}</p>
              <div className="mt-4">
                <ProgressBar completadas={completadas} total={m.lecciones.length} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
