import type { ComponentProps } from "react";

export function Card({ className = "", ...rest }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-5 ${className}`}
      {...rest}
    />
  );
}

export function Badge({ className = "", ...rest }: ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent ${className}`}
      {...rest}
    />
  );
}
