import "dotenv/config";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Definición de los 4 módulos y sus lecciones. El contenido largo vive en /content,
// aquí solo registramos la estructura para poder rastrear el progreso por lección.
const modulos = [
  {
    slug: "correo",
    titulo: "Correo electrónico",
    icono: "mail",
    lecciones: [
      "¿Qué es un correo?",
      "Crear una cuenta",
      "Enviar un correo",
      "Adjuntar una foto",
      "Evitar correos falsos",
    ],
  },
  {
    slug: "whatsapp",
    titulo: "WhatsApp",
    icono: "message-circle",
    lecciones: [
      "Abrir WhatsApp",
      "Escribir un mensaje",
      "Enviar foto y voz",
      "Videollamada",
      "Bloquear desconocidos",
    ],
  },
  {
    slug: "tramites",
    titulo: "Trámites en línea",
    icono: "file-text",
    lecciones: [
      "Qué es un trámite digital",
      "Consultar tu CURP",
      "Cita en el IMSS",
      "Descargar un documento",
    ],
  },
  {
    slug: "seguridad",
    titulo: "Seguridad digital",
    icono: "shield",
    lecciones: [
      "Contraseñas seguras",
      "Reconocer fraudes",
      "No compartir códigos",
      "Qué hacer si te roban datos",
    ],
  },
];

async function main() {
  // Sembrar módulos y lecciones (upsert = crea o actualiza, idempotente).
  for (let m = 0; m < modulos.length; m++) {
    const mod = modulos[m];
    const modulo = await db.module.upsert({
      where: { slug: mod.slug },
      update: { titulo: mod.titulo, icono: mod.icono, orden: m },
      create: {
        slug: mod.slug,
        titulo: mod.titulo,
        descripcion: mod.titulo,
        icono: mod.icono,
        orden: m,
      },
    });

    for (let l = 0; l < mod.lecciones.length; l++) {
      const slug = `${mod.slug}-${l + 1}`;
      await db.lesson.upsert({
        where: { moduleId_slug: { moduleId: modulo.id, slug } },
        update: { titulo: mod.lecciones[l], orden: l },
        create: { moduleId: modulo.id, slug, titulo: mod.lecciones[l], orden: l },
      });
    }
  }

  // Crear/actualizar el usuario administrador.
  // El PIN NUNCA se escribe en el código (el repo es público). Se toma de la
  // variable de entorno ADMIN_PIN (definida en .env, que no se sube a git).
  // - Si ADMIN_PIN está definido, se usa y se ACTUALIZA el PIN del admin al sembrar.
  // - Si no, se usa "1234" solo para el primer arranque y NO se sobrescribe en reseeds.
  const adminPin = process.env.ADMIN_PIN || "1234";
  if (adminPin.length !== 4 || !/^\d{4}$/.test(adminPin)) {
    throw new Error("ADMIN_PIN debe ser exactamente 4 dígitos numéricos.");
  }
  const adminHash = await bcrypt.hash(adminPin, 10);

  await db.user.upsert({
    where: { codigo: "ADMIN-BFF" },
    // Solo sobrescribe el PIN si ADMIN_PIN fue definido explícitamente.
    update: process.env.ADMIN_PIN ? { pinHash: adminHash } : {},
    create: {
      nombre: "Brandon (Admin)",
      codigo: "ADMIN-BFF",
      pinHash: adminHash,
      role: Role.ADMIN,
    },
  });

  if (!process.env.ADMIN_PIN) {
    console.warn(
      "⚠ ADMIN_PIN no definido: se usó 1234 por defecto. Define ADMIN_PIN en .env y vuelve a sembrar para cambiarlo.",
    );
  }

  console.log("✔ Seed completado: 4 módulos, lecciones y admin (ADMIN-BFF).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
