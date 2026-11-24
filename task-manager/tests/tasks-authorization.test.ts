import { beforeEach, describe, expect, it, vi } from "vitest";

const task = vi.hoisted(() => ({ findFirst: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { task } }));

import { deleteTask, getTask, updateTask } from "@/lib/tasks";

beforeEach(() => vi.clearAllMocks());

describe("autorización por usuario", () => {
  it("getTask filtra por id Y userId", async () => {
    task.findFirst.mockResolvedValue(null);
    await getTask("userA", "tarea-de-B");
    expect(task.findFirst).toHaveBeenCalledWith({ where: { id: "tarea-de-B", userId: "userA" } });
  });

  it("updateTask devuelve null si la tarea es de otro usuario", async () => {
    task.updateMany.mockResolvedValue({ count: 0 });
    expect(await updateTask("userA", "tarea-de-B", { completed: true })).toBeNull();
    expect(task.updateMany.mock.calls[0][0].where).toEqual({ id: "tarea-de-B", userId: "userA" });
  });

  it("deleteTask devuelve false si la tarea es de otro usuario", async () => {
    task.deleteMany.mockResolvedValue({ count: 0 });
    expect(await deleteTask("userA", "tarea-de-B")).toBe(false);
  });
});
