import { TaskCard } from "@/components/TaskCard";
import type { TaskDTO } from "@/types/task";

type Props = {
  tasks: TaskDTO[];
  onToggle: (t: TaskDTO) => void;
  onEdit: (t: TaskDTO) => void;
  onDelete: (t: TaskDTO) => void;
};

export function TaskList({ tasks, ...handlers }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-muted">
        No hay tareas con estos filtros. Crea una con “Nueva tarea”.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} {...handlers} />
      ))}
    </ul>
  );
}
