"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import PinPad from "@/components/PinPad";

export default function AccesoPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!codigo.trim() || pin.length !== 4) {
      return setError("Escribe tu código y tu PIN de 4 dígitos.");
    }

    setCargando(true);
    const res = await signIn("credentials", {
      codigo: codigo.trim(),
      pin,
      redirect: false,
    });
    setCargando(false);

    if (res?.error) {
      setError("Código o PIN incorrecto. Vuelve a intentarlo.");
      setPin("");
    } else {
      router.push("/inicio");
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Link href="/" className="text-blue-700 underline">
        ← Volver al inicio
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Entrar</h1>
      <p className="mt-2 text-lg text-gray-700">
        Usa el código que te dieron y tu PIN.
      </p>

      <form onSubmit={entrar} className="mt-8 space-y-8">
        <div>
          <label htmlFor="codigo" className="block text-xl font-semibold">
            Tu código
          </label>
          <input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            autoCapitalize="characters"
            className="mt-2 w-full rounded-xl border-2 border-gray-400 px-4 py-3 text-2xl font-mono tracking-widest focus:border-blue-700"
            placeholder="CD-1234"
          />
        </div>

        <fieldset>
          <legend className="text-xl font-semibold">Tu PIN</legend>
          <div className="mt-4">
            <PinPad value={pin} onChange={setPin} />
          </div>
        </fieldset>

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
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-lg">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-blue-700 underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
