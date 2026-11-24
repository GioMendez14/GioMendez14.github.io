"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function Navbar({ name }: { name: string }) {
  return (
    <header className="border-b border-line bg-white">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3"
      >
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="text-lg font-bold text-brand">
            Hecho
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
            Resumen
          </Link>
          <Link href="/tasks" className="text-sm text-muted hover:text-ink">
            Mis tareas
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">{name}</span>
          <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
            Cerrar sesión
          </Button>
        </div>
      </nav>
    </header>
  );
}
