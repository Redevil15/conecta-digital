import { obtenerMetricas, obtenerUsuariosResumen } from "@/lib/metrics";
import { aprobarTestimonio } from "@/lib/testimonials";
import { listarTestimonios } from "@/lib/testimonials.queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const m = await obtenerMetricas();
  const usuarios = await obtenerUsuariosResumen();
  const testimonios = await listarTestimonios();

  return (
    <main className="mx-auto max-w-5xl space-y-10 p-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Panel de métricas</h1>
        <p className="text-lg text-gray-600">
          Datos en tiempo real del piloto de Conecta Digital.
        </p>
      </header>

      <section aria-labelledby="resumen">
        <h2 id="resumen" className="sr-only">
          Resumen de métricas
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Tarjeta label="Usuarios" valor={m.totalUsuarios} />
          <Tarjeta label="Lecciones iniciadas" valor={m.iniciadas} />
          <Tarjeta label="Lecciones completadas" valor={m.completadas} />
          <Tarjeta label="Horas de uso" valor={m.horas} />
          <Tarjeta label="% usuarios activos" valor={`${m.pctActivos}%`} />
        </div>
      </section>

      <a
        href="/api/admin/export"
        className="inline-block rounded-lg bg-blue-700 px-5 py-3 text-lg font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Exportar CSV (reporte semanal)
      </a>

      <section aria-labelledby="usuarios" className="space-y-3">
        <h2 id="usuarios" className="text-2xl font-bold">
          Usuarios ({usuarios.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-base">
            <thead className="bg-gray-100 text-sm uppercase text-gray-600">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Código</th>
                <th className="p-3">Edad</th>
                <th className="p-3">Sitio</th>
                <th className="p-3">Iniciadas</th>
                <th className="p-3">Completadas</th>
                <th className="p-3">Minutos</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={7}>
                    Aún no hay usuarios registrados.
                  </td>
                </tr>
              )}
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium">{u.nombre}</td>
                  <td className="p-3 font-mono">{u.codigo}</td>
                  <td className="p-3">{u.rangoEdad ?? "—"}</td>
                  <td className="p-3">{u.sitio ?? "—"}</td>
                  <td className="p-3">{u.iniciadas}</td>
                  <td className="p-3">{u.completadas}</td>
                  <td className="p-3">{u.minutos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="testimonios" className="space-y-3">
        <h2 id="testimonios" className="text-2xl font-bold">
          Testimonios ({testimonios.length})
        </h2>
        <div className="space-y-3">
          {testimonios.length === 0 && (
            <p className="text-gray-500">Aún no hay testimonios.</p>
          )}
          {testimonios.map((t) => (
            <article
              key={t.id}
              className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-lg">&ldquo;{t.texto}&rdquo;</p>
                <p className="mt-1 text-sm text-gray-600">
                  — {t.nombre} ({t.rol}){" "}
                  {t.consentimiento ? "· con consentimiento" : "· SIN consentimiento"}
                </p>
              </div>
              <div className="shrink-0">
                {t.aprobado ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                    Aprobado
                  </span>
                ) : (
                  <form action={aprobarTestimonio}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      disabled={!t.consentimiento}
                      className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Aprobar
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Tarjeta({ label, valor }: { label: string; valor: number | string }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-4xl font-bold">{valor}</p>
    </div>
  );
}
