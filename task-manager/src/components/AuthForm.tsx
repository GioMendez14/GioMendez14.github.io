"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    if (isRegister) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.details?.[0] ?? body.error ?? "No se pudo crear la cuenta");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Correo o contraseña incorrectos");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {isRegister && <Input label="Nombre" name="name" autoComplete="name" required minLength={2} />}
      <Input label="Correo" name="email" type="email" autoComplete="email" required />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        autoComplete={isRegister ? "new-password" : "current-password"}
        required
        minLength={8}
      />
      {error && (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Un momento…" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </Button>
      <p className="text-center text-sm text-muted">
        {isRegister ? "¿Ya tienes cuenta? " : "¿Aún no tienes cuenta? "}
        <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-brand underline">
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </Link>
      </p>
    </form>
  );
}
