import type { NextAuthConfig } from "next-auth";

// Configuración EDGE-SAFE: sin Prisma ni bcrypt, para poder usarla en el
// middleware (que corre en el edge runtime). El proveedor Credentials, que
// necesita la base de datos, se agrega aparte en `auth.ts`.
export const authConfig = {
  session: { strategy: "jwt" }, // sesión en token, sin tabla extra
  pages: { signIn: "/acceso" }, // nuestra pantalla de login
  providers: [], // se rellenan en auth.ts
  callbacks: {
    // Copiamos id y role al token para poder leerlos en cualquier parte.
    jwt({ token, user }) {
      if (user) {
        token.uid = (user as { id?: string }).id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.uid as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
