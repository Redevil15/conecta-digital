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

  // Crear el usuario administrador (cambia el PIN por uno privado).
  await db.user.upsert({
    where: { codigo: "ADMIN-BFF" },
    update: {},
    create: {
      nombre: "Brandon (Admin)",
      codigo: "ADMIN-BFF",
      pinHash: await bcrypt.hash("1234", 10), // CÁMBIALO por un PIN privado
      role: Role.ADMIN,
    },
  });

  console.log("✔ Seed completado: 4 módulos, lecciones y admin (ADMIN-BFF).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
