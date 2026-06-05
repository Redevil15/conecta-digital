import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ ok: false }, { status: 401 });

  // Fecha de hoy sin hora (para una fila por día).
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Suma 60 segundos al uso de hoy (crea la fila si no existe).
  await db.dailyUsage.upsert({
    where: { userId_fecha: { userId, fecha: hoy } },
    update: { segundos: { increment: 60 } },
    create: { userId, fecha: hoy, segundos: 60 },
  });

  return Response.json({ ok: true });
}
