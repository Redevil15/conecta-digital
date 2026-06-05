"use client";

import { useActionState } from "react";
import Link from "next/link";
import { crearTestimonio } from "@/lib/testimonials";

type Estado = { ok?: boolean; error?: string } | null;

export default function TestimoniosPage() {
  const [estado, accion, pendiente] = useActionState<Estado, FormData>(
    async (_prev, formData) => crearTestimonio(formData),
    null,
  );

  if (estado?.ok) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-green-700">
          ¡Gracias por tu testimonio!
        </h1>
        <p className="mt-4 text-xl text-gray-700">
          Lo revisaremos antes de publicarlo.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-blue-700 px-8 py-4 text-xl font-bold text-white hover:bg-blue-800"
        >
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Link href="/" className="text-blue-700 underline">
        ← Volver al inicio
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Comparte tu experiencia</h1>
      <p className="mt-2 text-lg text-gray-700">
        Cuéntanos cómo te ayudó Conecta Digital.
      </p>

      <form action={accion} className="mt-8 space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-xl font-semibold">
            Tu nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            className="mt-2 w-full rounded-xl border-2 border-gray-400 px-4 py-3 text-xl focus:border-blue-700"
          />
        </div>

        <div>
          <label htmlFor="rol" className="block text-xl font-semibold">
            ¿Quién eres?
          </label>
          <select
            id="rol"
            name="rol"
            className="mt-2 w-full rounded-xl border-2 border-gray-400 px-4 py-3 text-xl"
          >
            <option value="usuario">Usuario(a) de la plataforma</option>
            <option value="aliado">Aliado(a) / facilitador(a)</option>
          </select>
        </div>

        <div>
          <label htmlFor="texto" className="block text-xl font-semibold">
            Tu testimonio
          </label>
          <textarea
            id="texto"
            name="texto"
            required
            rows={5}
            className="mt-2 w-full rounded-xl border-2 border-gray-400 px-4 py-3 text-xl focus:border-blue-700"
            placeholder="Aprendí a…"
          />
        </div>

        <div className="flex items-start gap-3 rounded-xl border p-4">
          <input
            id="consentimiento"
            name="consentimiento"
            type="checkbox"
            required
            className="mt-1 h-6 w-6"
          />
          <label htmlFor="consentimiento" className="text-lg">
            Doy mi consentimiento para que mi testimonio y mi nombre se usen en
            el proyecto Conecta Digital y su difusión.
          </label>
        </div>

        {estado?.error && (
          <p role="alert" className="text-lg font-semibold text-red-700">
            {estado.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pendiente}
          className="w-full rounded-xl bg-blue-700 px-8 py-4 text-xl font-bold text-white hover:bg-blue-800 disabled:bg-gray-400"
        >
          {pendiente ? "Enviando…" : "Enviar testimonio"}
        </button>
      </form>
    </main>
  );
}
