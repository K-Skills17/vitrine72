import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export const fieldControl =
  "min-h-12 w-full rounded-xs border border-line bg-porcelain px-4 py-3 text-body text-espresso placeholder:text-umber/70 focus:border-espresso focus:outline-none aria-[invalid=true]:border-error";

/** Label, control, hint and error, wired with aria-describedby by id convention. */
export function Field({ id, label, required, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        {label}
        {required ? <span aria-hidden> *</span> : <span className="font-normal text-umber"> (opcional)</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-caption text-umber">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-caption text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id: string, hint?: string, error?: string) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
