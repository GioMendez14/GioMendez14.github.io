export type Priority = "LOW" | "MEDIUM" | "HIGH";

// Forma de una tarea tal como llega por JSON desde la API (las fechas son strings)
export type TaskDTO = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
};
