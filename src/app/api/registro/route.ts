import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

function generarCodigo() {
  // CD- + 4 dígitos aleatorios, fácil de dictar a un adulto mayor.
  return "CD-" + Math.floor(1000 + Math.random() * 9000);
}

export async function POST(req: Request) {
  const { nombre, pin, rangoEdad, sitio } = await req.json();

  if (!nombre || String(pin).length !== 4) {
    return Response.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Reintenta si el código aleatorio ya existe (muy poco probable).
  let codigo = generarCodigo();
  while (await db.user.findUnique({ where: { codigo } })) codigo = generarCodigo();

  await db.user.create({
    data: {
      nombre: String(nombre).trim(),
      codigo,
      pinHash: await bcrypt.hash(String(pin), 10),
      rangoEdad: rangoEdad || null,
      sitio: sitio || null,
    },
  });

  // Devolvemos el código para mostrarlo EN GRANDE en pantalla.
  return Response.json({ codigo });
}
