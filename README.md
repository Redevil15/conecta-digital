# Conecta Digital

Plataforma web **gratuita y accesible** de alfabetización digital para adultos
mayores (60+) y personas de comunidades de bajos recursos. Desarrollada como MVP
del **servicio social CEFODEH** por **Brandon Figueroa Figueroa** (UVM Campus
Online, Ing. en Diseño de Software y Redes).

## ¿Qué hace?

- **4 módulos formativos**: Correo electrónico, WhatsApp, Trámites en línea y
  Seguridad digital, con lecciones cortas (3–5 min) paso a paso.
- **Registro accesible** con código de acceso + PIN de 4 dígitos (sin depender de
  correo, que es justo lo que la persona está aprendiendo).
- **Seguimiento de progreso**: lecciones iniciadas, completadas y tiempo de uso
  (heartbeat cada 60 s con la pestaña visible).
- **Panel de métricas privado** (`/admin`) con exportación a **CSV** semanal.
- **Testimonios** con consentimiento, aprobados desde el panel.
- **Página pública** con **código QR** para difusión.
- **Accesibilidad WCAG 2.1 AA**: texto grande ajustable (A+/A−), alto contraste,
  foco visible, navegación por teclado, etiquetas y estructura semántica.

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, fullstack) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma 7 (con driver adapter `@prisma/adapter-pg`) |
| Autenticación | Auth.js v5 (NextAuth), proveedor Credentials |
| Hashing | bcryptjs |
| Despliegue | Firebase App Hosting (Cloud Run) |

## Puesta en marcha local

```bash
# 1. Instalar dependencias (genera el cliente Prisma por postinstall)
npm install

# 2. Configurar variables: copia .env.example a .env y rellena
cp .env.example .env
#   - DATABASE_URL: connection string de Neon
#   - AUTH_SECRET : genera uno con `npx auth secret`

# 3. Crear las tablas y sembrar contenido (4 módulos + lecciones + admin)
npx prisma migrate dev --name init
npm run db:seed

# 4. Arrancar
npm run dev      # http://localhost:3000
```

## Scripts

| Script | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (salida standalone) |
| `npm run db:seed` | Siembra módulos, lecciones y admin |
| `npm run db:migrate` | Aplica migraciones en producción (`prisma migrate deploy`) |
| `npm run lint` | ESLint |

## Estructura

```
content/modulos/        Contenido de las lecciones en Markdown
prisma/                 schema.prisma + seed.ts
src/app/                Páginas (landing, registro, acceso, inicio, módulo, lección, admin, testimonios)
src/app/(app)/          Zona protegida (requiere sesión)
src/app/api/            Route handlers (auth, registro, heartbeat, export CSV)
src/components/         AccessibilityBar, PinPad, ProgressBar, Heartbeat, BotonCompletar
src/lib/                db, auth, metrics, progress, content, testimonials
```

## Despliegue (Firebase App Hosting)

1. Activa facturación (plan Blaze) en el proyecto de Firebase y crea un
   presupuesto/alerta de gasto.
2. App Hosting → conecta este repo de GitHub, rama `main`.
3. Guarda los secretos `DATABASE_URL` y `AUTH_SECRET` en Secret Manager (ver
   `apphosting.yaml`).
4. Tras el primer deploy, actualiza `NEXT_PUBLIC_SITE_URL` con la URL pública
   (alimenta el código QR de difusión).
5. Aplica el esquema a la BD de producción: `npm run db:migrate && npm run db:seed`.

---

Servicio social CEFODEH · #SOYVOLUNTARIOCEFODEH
