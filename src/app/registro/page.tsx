"use client";

import { useState } from "react";
import Link from "next/link";
import PinPad from "@/components/PinPad";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [rangoEdad, setRangoEdad] = useState("");
  const [sitio, setSitio] = useState("");
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function registrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nombre.trim()) return setError("Escribe tu nombre.");
    if (pin.length !== 4) return setError("Elige un PIN de 4 dígitos.");

    setCargando(true);
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, pin, rangoEdad, sitio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar.");
      setCodigo(data.codigo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setCargando(false);
    }
  }

  // Pantalla de éxito: muestra el código EN GRANDE.
  if (codigo) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-green-700">¡Listo, {nombre}!</h1>
        <p className="mt-4 text-xl text-gray-700">
          Este es tu código de acceso. Anótalo y guárdalo con tu PIN:
        </p>
        <p className="my-8 rounded-2xl border-4 border-blue-700 bg-blue-50 px-6 py-8 text-6xl font-extrabold tracking-widest text-blue-800">
          {codigo}
        </p>
        <p className="text-lg text-gray-700">
          Para entrar usarás <strong>este código</strong> y tu{" "}
          <strong>PIN de 4 dígitos</strong>.
        </p>
        <Link
          href="/acceso"
          className="mt-8 inline-block rounded-xl bg-blue-700 px-8 py-4 text-xl font-bold text-white hover:bg-blue-800"
        >
          Entrar ahora
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Link href="/" className="text-blue-700 underline">
        ← Volver al inicio
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Crear mi cuenta</h1>
      <p className="mt-2 text-lg text-gray-700">
        Solo necesitamos tu nombre y un PIN de 4 dígitos.
      </p>

      <form onSubmit={registrar} className="mt-8 space-y-8">
        <div>
          <label htmlFor="nombre" className="block text-xl font-semibold">
            Tu nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            className="mt-2 w-full rounded-xl border-2 border-gray-400 px-4 py-3 text-xl focus:border-blue-700"
            placeholder="Ej. María López"
          />
        </div>

        <fieldset>
          <legend className="text-xl font-semibold">
            Elige tu PIN de 4 dígitos
          </legend>
          <p className="mt-1 text-base text-gray-600">
            Es tu clave secreta para entrar. Memorízala.
          </p>
          <div className="mt-4">
            <PinPad value={pin} onChange={setPin} />
          </div>
        </fieldset>

        <details className="rounded-xl border p-4">
          <summary className="cursor-pointer text-lg font-semibold">
            Datos opcionales (puedes omitirlos)
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="edad" className="block text-lg font-medium">
                Rango de edad
              </label>
              <select
                id="edad"
                value={rangoEdad}
                onChange={(e) => setRangoEdad(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-gray-400 px-4 py-3 text-lg"
              >
                <option value="">Prefiero no decir</option>
                <option value="60-69">60 a 69 años</option>
                <option value="70+">70 años o más</option>
                <option value="menos-60">Menos de 60</option>
              </select>
            </div>
            <div>
              <label htmlFor="sitio" className="block text-lg font-medium">
                ¿Dónde te registras?
              </label>
              <input
                id="sitio"
                type="text"
                value={sitio}
                onChange={(e) => setSitio(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-gray-400 px-4 py-3 text-lg"
                placeholder="Ej. Casa de día, Biblioteca…"
              />
            </div>
          </div>
        </details>

        {error && (
          <p role="alert" className="text-lg font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-xl bg-blue-700 px-8 py-4 text-xl font-bold text-white hover:bg-blue-800 disabled:bg-gray-400"
        >
          {cargando ? "Creando…" : "Crear mi cuenta"}
        </button>
      </form>

      <p className="mt-6 text-center text-lg">
        ¿Ya tienes código?{" "}
        <Link href="/acceso" className="text-blue-700 underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
