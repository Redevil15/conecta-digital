"use client";

import { useEffect, useState } from "react";

const MIN = 16;
const MAX = 26;
const PASO = 2;
const BASE = 18;

export default function AccessibilityBar() {
  const [tamano, setTamano] = useState(BASE);
  const [contraste, setContraste] = useState(false);

  // Al montar, recupera las preferencias guardadas desde localStorage.
  // Es una sincronización de estado externo (preferencia persistida) que solo
  // existe en el cliente, por eso se hace en un effect de montaje.
  useEffect(() => {
    const t = Number(localStorage.getItem("cd-fontsize"));
    const c = localStorage.getItem("cd-contraste") === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (t >= MIN && t <= MAX) setTamano(t);
    if (c) setContraste(true);
  }, []);

  // Aplica y persiste el tamaño de letra (escala toda la interfaz vía rem).
  useEffect(() => {
    document.documentElement.style.fontSize = `${tamano}px`;
    localStorage.setItem("cd-fontsize", String(tamano));
  }, [tamano]);

  // Aplica y persiste el alto contraste.
  useEffect(() => {
    document.documentElement.classList.toggle("hc", contraste);
    localStorage.setItem("cd-contraste", contraste ? "1" : "0");
  }, [contraste]);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-b bg-gray-100 px-4 py-2 text-base">
      <span className="mr-auto font-semibold text-gray-700">
        Accesibilidad:
      </span>

      <button
        type="button"
        onClick={() => setTamano((t) => Math.max(MIN, t - PASO))}
        aria-label="Reducir el tamaño de la letra"
        className="rounded-lg border-2 border-gray-700 bg-white px-3 py-1 font-bold text-gray-800 hover:bg-gray-200"
      >
        A−
      </button>
      <button
        type="button"
        onClick={() => setTamano(BASE)}
        aria-label="Restablecer el tamaño de la letra"
        className="rounded-lg border-2 border-gray-700 bg-white px-3 py-1 text-gray-800 hover:bg-gray-200"
      >
        A
      </button>
      <button
        type="button"
        onClick={() => setTamano((t) => Math.min(MAX, t + PASO))}
        aria-label="Aumentar el tamaño de la letra"
        className="rounded-lg border-2 border-gray-700 bg-white px-3 py-1 text-xl font-bold text-gray-800 hover:bg-gray-200"
      >
        A+
      </button>

      <button
        type="button"
        onClick={() => setContraste((c) => !c)}
        aria-pressed={contraste}
        className="rounded-lg border-2 border-gray-700 bg-gray-900 px-3 py-1 font-semibold text-white hover:bg-black"
      >
        {contraste ? "Contraste normal" : "Alto contraste"}
      </button>
    </div>
  );
}
