import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { CreateTaskInput, ListQuery, UpdateTaskInput } from "@/lib/validations/task";

// REGLA DE SEGURIDAD: todas las funciones reciben userId y lo incluyen
// en el WHERE. Así es imposible tocar una tarea ajena aunque se adivine el id.

const toDate = (d: string | null | undefined) =>
  d === undefined ? undefined : d === null ? null : new Date(`${d}T00:00:00.000Z`);

export function listTasks(userId: string, query: ListQuery) {
  const where: Prisma.TaskWhereInput = { userId };
  if (query.status === "pending") where.completed = false;
  if (query.status === "completed") where.completed = true;
  if (query.priority) where.priority = query.priority;
  if (query.q) where.title = { contains: query.q, mode: "insensitive" };

  const orderBy: Prisma.TaskOrderByWithRelationInput[] =
    query.sort === "dueDate"
      ? [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];

  return prisma.task.findMany({ where, orderBy });
}

export function getTask(userId: string, id: string) {
  return prisma.task.findFirst({ where: { id, userId } });
}

export function createTask(userId: string, data: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      dueDate: toDate(data.dueDate) ?? null,
      userId,
    },
  });
}

// Devuelve null si la tarea no existe o no es del usuario
export async function updateTask(userId: string, id: string, data: UpdateTaskInput) {
  const { count } = await prisma.task.updateMany({
    where: { id, userId },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      completed: data.completed,
      dueDate: toDate(data.dueDate),
    },
  });
  return count === 0 ? null : getTask(userId, id);
}

export async function deleteTask(userId: string, id: string) {
  const { count } = await prisma.task.deleteMany({ where: { id, userId } });
  return count > 0;
}

export async function getSummary(userId: string) {
  const soon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const [total, completed, upcoming] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, completed: true } }),
    prisma.task.findMany({
      where: { userId, completed: false, dueDate: { not: null, lte: soon } },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
  ]);
  return { total, completed, pending: total - completed, upcoming };
}
