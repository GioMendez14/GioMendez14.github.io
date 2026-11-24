import { Button } from "@/components/ui/Button";
import { PRIORITY_LABEL, formatDate, isOverdue } from "@/lib/format";
import type { TaskDTO } from "@/types/task";

const priorityStyle = {
  HIGH: "border-l-high text-high",
  MEDIUM: "border-l-medium text-medium",
  LOW: "border-l-low text-low",
} as const;

type Props = {
  task: TaskDTO;
  onToggle: (task: TaskDTO) => void;
  onEdit: (task: TaskDTO) => void;
  onDelete: (task: TaskDTO) => void;
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const overdue = isOverdue(task.dueDate, task.completed);
  return (
    <li
      className={`flex gap-3 rounded-lg border border-line border-l-4 bg-white p-4 ${priorityStyle[task.priority].split(" ")[0]}`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Marcar "${task.title}" como ${task.completed ? "pendiente" : "completada"}`}
        className="mt-1 h-5 w-5 shrink-0 accent-brand"
      />
      <div className="min-w-0 flex-1">
        <p className={`font-semibold ${task.completed ? "text-muted line-through" : ""}`}>{task.title}</p>
        {task.description && <p className="mt-1 text-sm text-muted">{task.description}</p>}
        <p className="mt-2 flex flex-wrap gap-x-4 text-sm">
          <span className={`font-medium ${priorityStyle[task.priority].split(" ")[1]}`}>
            Prioridad {PRIORITY_LABEL[task.priority].toLowerCase()}
          </span>
          {task.dueDate && (
            <span className={overdue ? "font-medium text-high" : "text-muted"}>
              {overdue ? "Venció el " : "Vence el "}
              {formatDate(task.dueDate)}
            </span>
          )}
          <span className="text-muted">{task.completed ? "Completada" : "Pendiente"}</span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        <Button variant="ghost" onClick={() => onEdit(task)}>
          Editar
        </Button>
        <Button variant="ghost" onClick={() => onDelete(task)}>
          Eliminar
        </Button>
      </div>
    </li>
  );
}
