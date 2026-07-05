import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// -----------------------------------------------------------------------------
// Usuarios de PRUEBA para poblar el panel de métricas y tomar capturas.
// NO son personas reales. Bórralos antes de recolectar los datos reales del
// piloto con:  npm run db:demo:clean
// -----------------------------------------------------------------------------

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const clean = process.argv.includes("--clean");

type Demo = {
  codigo: string;
  nombre: string;
  rangoEdad: string | null;
  sitio: string | null;
  completed: string[]; // slugs de lecciones completadas
  started: string[]; // slugs de lecciones solo iniciadas
  minutos: number; // tiempo total de uso
};

const demo: Demo[] = [
  { codigo: "CD-4821", nombre: "María López", rangoEdad: "70+", sitio: "Casa de día Reforma", completed: ["correo-1", "correo-2", "correo-3"], started: ["correo-4"], minutos: 26 },
  { codigo: "CD-3907", nombre: "José Ramírez", rangoEdad: "60-69", sitio: "Biblioteca Central", completed: ["whatsapp-1", "whatsapp-2"], started: ["whatsapp-3"], minutos: 14 },
  { codigo: "CD-5162", nombre: "Guadalupe Hernández", rangoEdad: "70+", sitio: "Casa de día Reforma", completed: ["correo-1", "correo-2", "correo-3", "correo-4", "correo-5", "whatsapp-1", "whatsapp-2", "whatsapp-3"], started: [], minutos: 52 },
  { codigo: "CD-2748", nombre: "Francisco Torres", rangoEdad: "60-69", sitio: null, completed: [], started: ["seguridad-1"], minutos: 4 },
  { codigo: "CD-6033", nombre: "Rosa Martínez", rangoEdad: "70+", sitio: "Casa de día San Juan", completed: ["tramites-1", "tramites-2", "whatsapp-1"], started: ["tramites-3"], minutos: 21 },
  { codigo: "CD-3519", nombre: "Antonio Gómez", rangoEdad: "60-69", sitio: "Biblioteca Central", completed: ["seguridad-1", "seguridad-2", "seguridad-3", "seguridad-4"], started: [], minutos: 33 },
  { codigo: "CD-4406", nombre: "Carmen Díaz", rangoEdad: "70+", sitio: "Casa de día San Juan", completed: ["correo-1", "correo-2"], started: ["correo-3"], minutos: 11 },
  { codigo: "CD-5877", nombre: "Miguel Sánchez", rangoEdad: "menos-60", sitio: null, completed: ["whatsapp-1", "whatsapp-2", "whatsapp-3", "whatsapp-4", "whatsapp-5", "correo-1"], started: [], minutos: 41 },
  { codigo: "CD-2291", nombre: "Juana Flores", rangoEdad: "70+", sitio: "Casa de día Reforma", completed: [], started: ["correo-1"], minutos: 3 },
  { codigo: "CD-6714", nombre: "Pedro Vargas", rangoEdad: "60-69", sitio: "Biblioteca Norte", completed: ["correo-1", "correo-2", "correo-3", "correo-4", "tramites-1"], started: ["correo-5"], minutos: 29 },
  { codigo: "CD-3348", nombre: "Alicia Mendoza", rangoEdad: "70+", sitio: "Casa de día San Juan", completed: ["correo-1", "whatsapp-1", "seguridad-1"], started: ["tramites-1"], minutos: 18 },
  { codigo: "CD-5095", nombre: "Ricardo Castillo", rangoEdad: "60-69", sitio: "Biblioteca Central", completed: ["seguridad-1", "seguridad-2", "correo-1", "correo-2"], started: [], minutos: 24 },
];

const codigos = demo.map((d) => d.codigo);

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function dateOnly(n: number): Date {
  const d = daysAgo(n);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function borrar() {
  const users = await db.user.findMany({ where: { codigo: { in: codigos } } });
  for (const u of users) {
    await db.dailyUsage.deleteMany({ where: { userId: u.id } });
    await db.lessonProgress.deleteMany({ where: { userId: u.id } });
    await db.user.delete({ where: { id: u.id } });
  }
  console.log(`🧹 Eliminados ${users.length} usuarios de prueba.`);
}

async function main() {
  if (clean) return borrar();

  const lessons = await db.lesson.findMany({ select: { id: true, slug: true } });
  const slugToId = new Map(lessons.map((l) => [l.slug, l.id]));
  const pinHash = await bcrypt.hash("1111", 10);

  for (let i = 0; i < demo.length; i++) {
    const u = demo[i];
    const user = await db.user.upsert({
      where: { codigo: u.codigo },
      update: { nombre: u.nombre, rangoEdad: u.rangoEdad, sitio: u.sitio, pinHash },
      create: {
        codigo: u.codigo,
        nombre: u.nombre,
        rangoEdad: u.rangoEdad,
        sitio: u.sitio,
        pinHash,
        role: "USER",
      },
    });

    // Reiniciar progreso/uso para que el script sea idempotente.
    await db.lessonProgress.deleteMany({ where: { userId: user.id } });
    await db.dailyUsage.deleteMany({ where: { userId: user.id } });

    const baseDay = 3 + (i % 6); // variar fechas de actividad

    for (const slug of u.completed) {
      const lessonId = slugToId.get(slug);
      if (!lessonId) continue;
      await db.lessonProgress.create({
        data: {
          userId: user.id,
          lessonId,
          status: "COMPLETED",
          iniciadaEn: daysAgo(baseDay),
          completadaEn: daysAgo(Math.max(0, baseDay - 1)),
        },
      });
    }
    for (const slug of u.started) {
      const lessonId = slugToId.get(slug);
      if (!lessonId) continue;
      await db.lessonProgress.create({
        data: { userId: user.id, lessonId, status: "STARTED", iniciadaEn: daysAgo(1) },
      });
    }

    // Tiempo de uso repartido en dos días.
    const seg = u.minutos * 60;
    if (seg > 0) {
      const s1 = Math.round(seg * 0.6);
      const s2 = seg - s1;
      await db.dailyUsage.create({ data: { userId: user.id, fecha: dateOnly(baseDay), segundos: s1 } });
      if (s2 > 0)
        await db.dailyUsage.create({ data: { userId: user.id, fecha: dateOnly(Math.max(1, baseDay - 2)), segundos: s2 } });
    }

    console.log(`✔ ${u.codigo}  ${u.nombre} — ${u.completed.length} completadas, ${u.started.length} iniciadas, ${u.minutos} min`);
  }

  const total = await db.user.count({ where: { role: "USER" } });
  console.log(`\n✅ Sembrados ${demo.length} usuarios de prueba. Usuarios USER totales: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
