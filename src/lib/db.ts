import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requiere un driver adapter. Usamos `pg` (TCP) que funciona tanto en
// local como en Cloud Run apuntando a Neon Postgres.
function crearCliente() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

// En desarrollo, Next.js recarga módulos en caliente y crearía muchos
// PrismaClient (agotando conexiones). Guardamos uno en globalThis para reusarlo.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? crearCliente();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
