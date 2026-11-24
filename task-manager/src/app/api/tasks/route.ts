import { NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/tasks";
import { createTaskSchema, listQuerySchema } from "@/lib/validations/task";
import { getSessionUserId, handleError, unauthorized } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const params = Object.fromEntries(new URL(req.url).searchParams);
    const query = listQuerySchema.parse(params);
    return NextResponse.json(await listTasks(userId, query));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const data = createTaskSchema.parse(await req.json());
    return NextResponse.json(await createTask(userId, data), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
