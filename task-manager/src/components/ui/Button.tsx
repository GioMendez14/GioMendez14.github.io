import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "border border-line bg-white text-ink hover:bg-page",
  danger: "bg-high text-white hover:opacity-90",
  ghost: "text-muted hover:bg-white hover:text-ink",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
    />
  );
}
