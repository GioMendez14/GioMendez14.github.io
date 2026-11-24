import { describe, expect, it } from "vitest";
import { registerSchema } from "@/lib/validations/auth";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";

describe("registerSchema", () => {
  it("normaliza el correo", () => {
    const r = registerSchema.parse({ name: "Gio", email: "  GIO@Mail.com ", password: "12345678" });
    expect(r.email).toBe("gio@mail.com");
  });
  it("rechaza contraseñas cortas", () => {
    expect(registerSchema.safeParse({ name: "Gio", email: "a@b.com", password: "123" }).success).toBe(false);
  });
});

describe("createTaskSchema", () => {
  it("usa prioridad MEDIUM por defecto", () => {
    expect(createTaskSchema.parse({ title: "Algo" }).priority).toBe("MEDIUM");
  });
  it("rechaza título vacío, prioridad inválida y fecha mal formada", () => {
    expect(createTaskSchema.safeParse({ title: "   " }).success).toBe(false);
    expect(createTaskSchema.safeParse({ title: "x", priority: "URGENT" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ title: "x", dueDate: "mañana" }).success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("exige al menos un campo", () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
    expect(updateTaskSchema.safeParse({ completed: true }).success).toBe(true);
  });
  it("ignora userId enviado por el cliente (no se puede reasignar una tarea)", () => {
    const r = updateTaskSchema.parse({ completed: true, userId: "otro" } as never);
    expect("userId" in r).toBe(false);
  });
});
