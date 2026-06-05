import { db } from "@/lib/db";

// Lista TODOS los testimonios (para el panel admin). NO es una Server Action,
// así que no se expone como endpoint público.
export async function listarTestimonios() {
  return db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

// Solo los aprobados con consentimiento (para la página pública).
export async function listarAprobados() {
  return db.testimonial.findMany({
    where: { aprobado: true, consentimiento: true },
    orderBy: { createdAt: "desc" },
  });
}
