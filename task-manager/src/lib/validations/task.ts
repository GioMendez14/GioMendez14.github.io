import { z } from "zod";

export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Fecha opcional: acepta "YYYY-MM-DD" o null (para quitarla)
const dueDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")
  .nullable()
  .optional();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  priority: priorityEnum.default("MEDIUM"),
  dueDate,
});

// PATCH: todo es opcional, pero debe venir al menos un campo
export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(1000).nullable(),
    priority: priorityEnum,
    completed: z.boolean(),
    dueDate,
  })
  .partial()
  .refine((d) => Object.keys(d).length > 0, "Envía al menos un campo");

export const listQuerySchema = z.object({
  status: z.enum(["all", "pending", "completed"]).default("all"),
  priority: priorityEnum.optional(),
  q: z.string().trim().max(120).optional(),
  sort: z.enum(["created", "dueDate"]).default("created"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
