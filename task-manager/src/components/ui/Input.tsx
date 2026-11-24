import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function Input({ label, error, id, className = "", ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
        className={`w-full rounded-lg border border-line bg-white px-3 py-2 text-sm ${className}`}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-high">
          {error}
        </p>
      )}
    </div>
  );
}
