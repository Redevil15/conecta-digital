"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { marcarCompletada } from "@/lib/progress";

export default function BotonCompletar({
  lessonId,
  hecha,
}: {
  lessonId: string;
  hecha: boolean;
}) {
  const router = useRouter();
  const [completada, setCompletada] = useState(hecha);
  const [guardando, setGuardando] = useState(false);

  if (completada) {
    return (
      <p className="rounded-xl bg-green-100 px-6 py-4 text-center text-xl font-bold text-green-800">
        ✓ Lección completada
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={guardando}
      onClick={async () => {
        setGuardando(true);
        await marcarCompletada(lessonId);
        setCompletada(true);
        setGuardando(false);
        router.refresh();
      }}
      className="w-full rounded-xl bg-green-700 px-8 py-5 text-2xl font-bold text-white hover:bg-green-800 disabled:bg-gray-400"
    >
      {guardando ? "Guardando…" : "Marcar como completada"}
    </button>
  );
}
