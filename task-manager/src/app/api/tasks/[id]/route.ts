import { NextResponse } from "next/server";
import { deleteTask, getTask, updateTask } from "@/lib/tasks";
import { updateTaskSchema } from "@/lib/validations/task";
import { getSessionUserId, handleError, notFound, unauthorized } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> }; // en Next 15+, params es una Promise

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const task = await getTask(userId, id);
    return task ? NextResponse.json(task) : notFound();
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const data = updateTaskSchema.parse(await req.json());
    const task = await updateTask(userId, id, data);
    return task ? NextResponse.json(task) : notFound();
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    return (await deleteTask(userId, id)) ? new NextResponse(null, { status: 204 }) : notFound();
  } catch (error) {
    return handleError(error);
  }
}
