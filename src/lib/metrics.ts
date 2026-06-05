import { db } from "@/lib/db";

export async function obtenerMetricas() {
  const totalUsuarios = await db.user.count({ where: { role: "USER" } });
  const iniciadas = await db.lessonProgress.count();
  const completadas = await db.lessonProgress.count({
    where: { status: "COMPLETED" },
  });

  // Tiempo total: suma de todos los segundos registrados.
  const tiempo = await db.dailyUsage.aggregate({ _sum: { segundos: true } });
  const horas = Math.round(((tiempo._sum.segundos ?? 0) / 3600) * 10) / 10;

  // Usuarios con al menos 1 lección completada.
  const conProgreso = await db.lessonProgress.findMany({
    where: { status: "COMPLETED" },
    distinct: ["userId"],
    select: { userId: true },
  });
  const pctActivos = totalUsuarios
    ? Math.round((conProgreso.length / totalUsuarios) * 100)
    : 0;

  return { totalUsuarios, iniciadas, completadas, horas, pctActivos };
}

// Tabla por usuario para el panel admin.
export async function obtenerUsuariosResumen() {
  const usuarios = await db.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    include: { progresos: true, usosDiarios: true },
  });

  return usuarios.map((u) => {
    const completadas = u.progresos.filter((p) => p.status === "COMPLETED").length;
    const iniciadas = u.progresos.length;
    const minutos = Math.round(
      u.usosDiarios.reduce((s, d) => s + d.segundos, 0) / 60,
    );
    return {
      id: u.id,
      nombre: u.nombre,
      codigo: u.codigo,
      rangoEdad: u.rangoEdad,
      sitio: u.sitio,
      iniciadas,
      completadas,
      minutos,
      createdAt: u.createdAt,
    };
  });
}
