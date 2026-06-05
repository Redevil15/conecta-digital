"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Crear un testimonio desde el formulario público.
export async function crearTestimonio(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const rol = String(formData.get("rol") ?? "usuario");
  const texto = String(formData.get("texto") ?? "").trim();
  const consentimiento = formData.get("consentimiento") === "on";

  if (!nombre || !texto || !consentimiento) {
    return { error: "Faltan datos o el consentimiento." };
  }

  await db.testimonial.create({
    data: { nombre, rol, texto, consentimiento },
  });

  return { ok: true };
}

// Aprobar un testimonio (solo admin).
export async function aprobarTestimonio(formData: FormData) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.testimonial.update({
    where: { id },
    data: { aprobado: true },
  });

  revalidatePath("/admin");
}
