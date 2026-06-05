import { auth } from "@/auth";
import { db } from "@/lib/db";

// Escapa un campo para CSV (comillas y comas).
function csv(valor: string | number | null | undefined) {
  const s = String(valor ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN")
    return new Response("No autorizado", { status: 403 });

  const usuarios = await db.user.findMany({
    where: { role: "USER" },
    include: { progresos: true, usosDiarios: true },
  });

  // Construimos el CSV línea por línea.
  const filas = [
    "nombre,codigo,rangoEdad,sitio,lecciones_iniciadas,lecciones_completadas,minutos_uso,fecha_registro",
  ];
  for (const u of usuarios) {
    const iniciadas = u.progresos.length;
    const completadas = u.progresos.filter((p) => p.status === "COMPLETED").length;
    const minutos = Math.round(
      u.usosDiarios.reduce((s, d) => s + d.segundos, 0) / 60,
    );
    filas.push(
      [
        csv(u.nombre),
        csv(u.codigo),
        csv(u.rangoEdad),
        csv(u.sitio),
        iniciadas,
        completadas,
        minutos,
        u.createdAt.toISOString().slice(0, 10),
      ].join(","),
    );
  }

  return new Response("﻿" + filas.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="conecta-digital-metricas.csv"`,
    },
  });
}
