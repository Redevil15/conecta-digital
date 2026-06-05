import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import Heartbeat from "@/components/Heartbeat";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/acceso");

  const esAdmin = (session.user as { role?: string })?.role === "ADMIN";

  async function salir() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Cuenta el tiempo de uso mientras la persona está en la zona logueada. */}
      <Heartbeat />

      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
        <Link href="/inicio" className="text-2xl font-bold text-blue-800">
          Conecta Digital
        </Link>
        <nav className="flex items-center gap-4">
          <span className="text-lg text-gray-700">
            Hola, {session.user?.name ?? "amigo"}
          </span>
          {esAdmin && (
            <Link
              href="/admin"
              className="rounded-lg border-2 border-blue-700 px-4 py-2 text-lg font-semibold text-blue-700 hover:bg-blue-50"
            >
              Panel
            </Link>
          )}
          <form action={salir}>
            <button
              type="submit"
              className="rounded-lg bg-gray-200 px-4 py-2 text-lg font-semibold text-gray-800 hover:bg-gray-300"
            >
              Salir
            </button>
          </form>
        </nav>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
