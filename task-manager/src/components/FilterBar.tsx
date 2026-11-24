"use client";

export type Filters = {
  status: "all" | "pending" | "completed";
  priority: "" | "LOW" | "MEDIUM" | "HIGH";
  sort: "created" | "dueDate";
  q: string;
};

const selectClass = "rounded-lg border border-line bg-white px-3 py-2 text-sm";

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-3 sm:grid-cols-4">
      <div className="sm:col-span-4">
        <label htmlFor="q" className="sr-only">
          Buscar por título
        </label>
        <input
          id="q"
          type="search"
          placeholder="Buscar por título…"
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          className={`${selectClass} w-full`}
        />
      </div>
      <label className="text-sm">
        <span className="mb-1 block font-medium">Estado</span>
        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value as Filters["status"])}
          className={`${selectClass} w-full`}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Completadas</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">Prioridad</span>
        <select
          value={filters.priority}
          onChange={(e) => set("priority", e.target.value as Filters["priority"])}
          className={`${selectClass} w-full`}
        >
          <option value="">Todas</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="mb-1 block font-medium">Ordenar por</span>
        <select
          value={filters.sort}
          onChange={(e) => set("sort", e.target.value as Filters["sort"])}
          className={`${selectClass} w-full`}
        >
          <option value="created">Más recientes</option>
          <option value="dueDate">Fecha de vencimiento</option>
        </select>
      </label>
    </form>
  );
}
