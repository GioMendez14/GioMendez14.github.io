import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth";

// Devuelve el userId de la sesión o null. NUNCA se toma el userId del cliente.
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export const unauthorized = () =>
  NextResponse.json({ error: "No autenticado" }, { status: 401 });

export const notFound = () =>
  NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Datos inválidos", details: error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  // El detalle real solo va al log del servidor, nunca al cliente
  console.error(error);
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
}
