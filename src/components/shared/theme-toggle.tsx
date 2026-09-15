"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: LucideIcon;
};

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
];

function subscribe() {
  return () => undefined;
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function useMounted() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div
        className="h-9 w-[116px] rounded-lg border border-border bg-muted/50"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="inline-flex items-center rounded-lg border border-border bg-card p-1 shadow-sm"
      role="group"
      aria-label="Color theme"
    >
      {themeOptions.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;

        return (
          <Button
            key={value}
            variant={isActive ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setTheme(value)}
            aria-label={`Use ${label.toLowerCase()} theme`}
            aria-pressed={isActive}
            title={`${label} theme`}
          >
            <Icon className="size-4" aria-hidden="true" />
          </Button>
        );
      })}
    </div>
  );
}
