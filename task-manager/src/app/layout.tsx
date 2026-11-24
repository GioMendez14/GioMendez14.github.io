import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hecho — tus tareas, en orden",
  description: "Organiza tus tareas con prioridad y fecha de vencimiento.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
