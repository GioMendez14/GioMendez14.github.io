import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { handleError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const data = registerSchema.parse(await req.json());

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      return NextResponse.json({ error: "Ese correo ya está registrado" }, { status: 409 });
    }

    // 12 rondas de salt: seguro y todavía rápido
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
      select: { id: true, name: true, email: true }, // nunca devolvemos el hash
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
