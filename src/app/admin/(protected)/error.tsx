"use client";

import { RotateCcw } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";

type ProtectedAdminErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ProtectedAdminError({ reset }: ProtectedAdminErrorProps) {
  return (
    <ErrorState
      title="Unable to load Admin content"
      description="The Admin workspace could not load the requested data. Try the request again. Internal database or server details are not exposed here."
      action={
        <Button type="button" variant="outline" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      }
    />
  );
}
