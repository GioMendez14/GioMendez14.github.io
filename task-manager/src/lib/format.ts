// Las fechas se guardan a medianoche UTC; se muestran en UTC para que no "salten" de día
export const formatDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const toInputDate = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

export const isOverdue = (iso: string | null, completed: boolean) =>
  !!iso && !completed && new Date(iso).getTime() < new Date().setUTCHours(0, 0, 0, 0);

export const PRIORITY_LABEL = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta" } as const;
