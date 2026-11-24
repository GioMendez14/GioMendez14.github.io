"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PRIORITY_LABEL, toInputDate } from "@/lib/format";
import type { Priority, TaskDTO } from "@/types/task";

export type TaskFormValues = {
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
};

type Props = {
  task?: TaskDTO;
  onSubmit: (values: TaskFormValues) => Promise<string | null>; // devuelve mensaje de error o null
  onCancel: () => void;
};

export function TaskForm({ task, onSubmit, onCancel }: Props) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title")).trim();
    if (!title) return setError("El título es obligatorio");

    setSaving(true);
    const msg = await onSubmit({
      title,
      description: String(f.get("description")).trim() || null,
      priority: f.get("priority") as Priority,
      dueDate: String(f.get("dueDate")) || null,
    });
    setSaving(false);
    if (msg) setError(msg);
  }

  return (
    <form onSubmit={handle} className="space-y-4" noValidate>
      <Input label="Título" name="title" defaultValue={task?.title} maxLength={120} required />
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={1000}
          defaultValue={task?.description ?? ""}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="priority" className="block text-sm font-medium">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={task?.priority ?? "MEDIUM"}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
          >
            {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </select>
        </div>
        <Input label="Vence" name="dueDate" type="date" defaultValue={toInputDate(task?.dueDate ?? null)} />
      </div>
      {error && (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar tarea"}
        </Button>
      </div>
    </form>
  );
}
