import Link from "next/link";
import QRCode from "qrcode";
import { listarAprobados } from "@/lib/testimonials.queries";

export const dynamic = "force-dynamic";

const MODULOS = [
  {
    emoji: "✉️",
    titulo: "Correo electrónico",
    desc: "Crear tu cuenta, enviar correos y adjuntar fotos sin miedo.",
  },
  {
    emoji: "💬",
    titulo: "WhatsApp",
    desc: "Escribir mensajes, mandar fotos y notas de voz, hacer videollamadas.",
  },
  {
    emoji: "📄",
    titulo: "Trámites en línea",
    desc: "Consultar tu CURP, sacar citas y descargar documentos oficiales.",
  },
  {
    emoji: "🛡️",
    titulo: "Seguridad digital",
    desc: "Contraseñas seguras, reconocer fraudes y proteger tus datos.",
  },
];

export default async function LandingPage() {
  const sitio = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const qr = await QRCode.toDataURL(sitio, { width: 320, margin: 1 });
  const testimonios = await listarAprobados();

  return (
    <main>
      {/* Encabezado */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
        <span className="text-2xl font-bold text-blue-800">Conecta Digital</span>
        <nav className="flex gap-3">
          <Link
            href="/acceso"
            className="rounded-lg border-2 border-blue-700 px-5 py-2 text-lg font-semibold text-blue-700 hover:bg-blue-50"
          >
            Entrar
          </Link>
          <Link
            href="/registro"
            className="rounded-lg bg-blue-700 px-5 py-2 text-lg font-semibold text-white hover:bg-blue-800"
          >
            Registrarme
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          Aprende a usar tu teléfono y la computadora, paso a paso
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl text-gray-700">
          Lecciones cortas, sencillas y gratuitas para mandar correos, usar
          WhatsApp, hacer trámites en línea y cuidarte de fraudes. Pensado para
          adultos mayores y para quien empieza desde cero.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/registro"
            className="rounded-xl bg-blue-700 px-8 py-4 text-xl font-bold text-white hover:bg-blue-800"
          >
            Empezar gratis
          </Link>
          <Link
            href="/acceso"
            className="rounded-xl border-2 border-blue-700 px-8 py-4 text-xl font-bold text-blue-700 hover:bg-blue-50"
          >
            Ya tengo código
          </Link>
        </div>
      </section>

      {/* Módulos */}
      <section aria-labelledby="modulos" className="mx-auto max-w-5xl px-6 py-10">
        <h2 id="modulos" className="text-center text-3xl font-bold">
          Cuatro temas para empezar
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {MODULOS.map((m) => (
            <article key={m.titulo} className="flex gap-4 rounded-2xl border p-6">
              <span className="text-5xl" aria-hidden="true">
                {m.emoji}
              </span>
              <div>
                <h3 className="text-2xl font-bold">{m.titulo}</h3>
                <p className="mt-1 text-lg text-gray-700">{m.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* QR de difusión */}
      <section aria-labelledby="qr" className="mx-auto max-w-3xl px-6 py-10 text-center">
        <h2 id="qr" className="text-3xl font-bold">
          Comparte Conecta Digital
        </h2>
        <p className="mt-2 text-lg text-gray-700">
          Apunta la cámara de tu teléfono a este código para abrir la página.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt={`Código QR que abre ${sitio}`}
          className="mx-auto mt-6 h-64 w-64 rounded-xl border"
          width={320}
          height={320}
        />
        <p className="mt-2 break-all text-base text-gray-500">{sitio}</p>
      </section>

      {/* Testimonios */}
      {testimonios.length > 0 && (
        <section aria-labelledby="testimonios" className="mx-auto max-w-5xl px-6 py-10">
          <h2 id="testimonios" className="text-center text-3xl font-bold">
            Lo que dicen las personas
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {testimonios.map((t) => (
              <blockquote key={t.id} className="rounded-2xl border p-6">
                <p className="text-lg">&ldquo;{t.texto}&rdquo;</p>
                <footer className="mt-3 font-semibold text-gray-700">
                  — {t.nombre}, {t.rol}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Pie */}
      <footer className="mt-10 border-t px-6 py-8 text-center text-base text-gray-600">
        <p>
          Conecta Digital · Servicio social CEFODEH · Brandon Figueroa Figueroa,
          UVM.
        </p>
        <p className="mt-1">
          <Link href="/testimonios" className="text-blue-700 underline">
            Dejar un testimonio
          </Link>
        </p>
      </footer>
    </main>
  );
}
