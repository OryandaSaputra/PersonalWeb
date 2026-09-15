import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentProps<"div"> & {
  size?: "content" | "wide";
};

export function Container({ className, size = "wide", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "content" ? "max-w-[var(--container-content)]" : "max-w-[var(--container-wide)]",
        className,
      )}
      {...props}
    />
  );
}
