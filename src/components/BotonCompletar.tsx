"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleCheckBig } from "lucide-react";
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
      <p className="flex items-center justify-center gap-2 rounded-xl bg-green-100 px-6 py-4 text-center text-xl font-bold text-green-800">
        <CircleCheckBig className="h-6 w-6" aria-hidden="true" />
        Lección completada
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
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-8 py-5 text-2xl font-bold text-white hover:bg-green-800 disabled:bg-gray-400"
    >
      <Check className="h-7 w-7" aria-hidden="true" />
      {guardando ? "Guardando…" : "Marcar como completada"}
    </button>
  );
}
