"use client";

import { Delete } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  longitud?: number;
  etiqueta?: string;
};

export default function PinPad({
  value,
  onChange,
  longitud = 4,
  etiqueta = "PIN de 4 dígitos",
}: Props) {
  function agregar(d: string) {
    if (value.length < longitud) onChange(value + d);
  }
  function borrar() {
    onChange(value.slice(0, -1));
  }

  const teclas = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="space-y-4">
      {/* Indicador visual de cuántos dígitos van. */}
      <div
        className="flex justify-center gap-3"
        role="status"
        aria-label={`${etiqueta}: ${value.length} de ${longitud} dígitos`}
      >
        {Array.from({ length: longitud }).map((_, i) => (
          <span
            key={i}
            className={`h-6 w-6 rounded-full border-2 ${
              i < value.length
                ? "border-blue-700 bg-blue-700"
                : "border-gray-400 bg-transparent"
            }`}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-xs grid-cols-3 gap-3">
        {teclas.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => agregar(t)}
            className="rounded-xl border-2 border-gray-700 bg-white py-4 text-3xl font-bold text-gray-900 hover:bg-blue-50 active:bg-blue-100"
          >
            {t}
          </button>
        ))}
        <button
          type="button"
          onClick={borrar}
          aria-label="Borrar último dígito"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-700 bg-gray-100 py-4 text-xl font-bold text-gray-900 hover:bg-gray-200"
        >
          <Delete className="h-6 w-6" aria-hidden="true" />
          Borrar
        </button>
        <button
          type="button"
          onClick={() => agregar("0")}
          className="rounded-xl border-2 border-gray-700 bg-white py-4 text-3xl font-bold text-gray-900 hover:bg-blue-50 active:bg-blue-100"
        >
          0
        </button>
        <span aria-hidden="true" />
      </div>
    </div>
  );
}
