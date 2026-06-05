"use client";

import { useEffect } from "react";

export default function Heartbeat() {
  useEffect(() => {
    // Cada 60s envía un latido SOLO si la pestaña está visible.
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetch("/api/heartbeat", { method: "POST" });
      }
    }, 60_000);
    return () => clearInterval(id); // limpiar al desmontar
  }, []);

  return null; // no dibuja nada
}
