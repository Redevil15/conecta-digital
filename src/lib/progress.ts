"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

// Llamar al ABRIR una lección.
export async function marcarIniciada(lessonId: string) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return;

  // upsert: si ya existe progreso, no lo tocamos; si no, lo creamos como STARTED.
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {},
    create: { userId, lessonId, status: "STARTED" },
  });
}

// Llamar al pulsar "Completar".
export async function marcarCompletada(lessonId: string) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return;

  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { status: "COMPLETED", completadaEn: new Date() },
    create: { userId, lessonId, status: "COMPLETED", completadaEn: new Date() },
  });
}
