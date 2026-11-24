"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { TaskForm, type TaskFormValues } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import type { TaskDTO } from "@/types/task";

const DEFAULT_FILTERS: Filters = { status: "all", priority: "", sort: "created", q: "" };

async function readError(res: Response) {
  const body = await res.json().catch(() => ({}));
  return (body.details?.[0] ?? body.error ?? "Ocurrió un error") as string;
}

export function TasksClient() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<TaskDTO | "new" | null>(null);
  const [deleting, setDeleting] = useState<TaskDTO | null>(null);

  const load = useCallback(async () => {
    setError("");
    const params = new URLSearchParams({ status: filters.status, sort: filters.sort });
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.q.trim()) params.set("q", filters.q.trim());

    const res = await fetch(`/api/tasks?${params}`);
    if (res.ok) setTasks(await res.json());
    else setError(await readError(res));
    setLoading(false);
  }, [filters]);

  // Pequeña espera (debounce) para no llamar a la API en cada tecla de la búsqueda
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  async function save(values: TaskFormValues): Promise<string | null> {
    const isNew = editing === "new";
    const url = isNew ? "/api/tasks" : `/api/tasks/${(editing as TaskDTO).id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) return readError(res);
    setEditing(null);
    await load();
    return null;
  }

  async function toggle(task: TaskDTO) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (res.ok) await load();
    else setError(await readError(res));
  }

  async function confirmDelete() {
    if (!deleting) return;
    const res = await fetch(`/api/tasks/${deleting.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleting(null);
      await load();
    } else {
      setError(await readError(res));
      setDeleting(null);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mis tareas</h1>
        <Button onClick={() => setEditing("new")}>Nueva tarea</Button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && (
        <p role="alert" className="rounded-lg bg-high/10 p-3 text-sm text-high">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-muted" aria-live="polite">
          Cargando tareas…
        </p>
      ) : (
        <TaskList tasks={tasks} onToggle={toggle} onEdit={setEditing} onDelete={setDeleting} />
      )}

      {editing && (
        <Modal title={editing === "new" ? "Nueva tarea" : "Editar tarea"} onClose={() => setEditing(null)}>
          <TaskForm task={editing === "new" ? undefined : editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {deleting && (
        <Modal title="Eliminar tarea" onClose={() => setDeleting(null)}>
          <p className="mb-5 text-sm">
            Vas a eliminar “{deleting.title}”. Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Eliminar tarea
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
