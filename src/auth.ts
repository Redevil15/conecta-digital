import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { codigo: {}, pin: {} },
      async authorize(creds) {
        const codigo = String(creds?.codigo ?? "").trim();
        const pin = String(creds?.pin ?? "");
        if (!codigo || pin.length !== 4) return null; // validación mínima

        const user = await db.user.findUnique({ where: { codigo } });
        if (!user) return null; // código inexistente

        const ok = await bcrypt.compare(pin, user.pinHash);
        if (!ok) return null; // PIN incorrecto

        // Lo que regrese aquí se guarda en el token de sesión.
        return { id: user.id, name: user.nombre, role: user.role };
      },
    }),
  ],
});
