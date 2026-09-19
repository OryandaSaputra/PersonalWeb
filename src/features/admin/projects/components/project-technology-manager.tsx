"use client";

import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addProjectTechnologyAction,
  removeProjectTechnologyAction,
  updateProjectTechnologyOrderAction,
} from "@/features/admin/projects/project-actions";

type TechnologyOption = {
  id: string;
  name: string;
};

type ProjectTechnologyLink = {
  projectId: string;
  technologyId: string;
  displayOrder: number;
  name: string;
  slug: string;
};

type ProjectTechnologyManagerProps = {
  projectId: string;
  technologies: TechnologyOption[];
  links: ProjectTechnologyLink[];
};

type Feedback = {
  kind: "success" | "error";
  message: string;
} | null;

export function ProjectTechnologyManager({
  projectId,
  technologies,
  links,
}: ProjectTechnologyManagerProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [selectedTechnologyId, setSelectedTechnologyId] = useState("");

  const [feedback, setFeedback] = useState<Feedback>(null);

  const assignedIds = new Set(links.map((link) => link.technologyId));

  const available = technologies.filter((technology) => !assignedIds.has(technology.id));

  function addTechnology() {
    if (!selectedTechnologyId) {
      setFeedback({
        kind: "error",
        message: "Select a technology first.",
      });

      return;
    }

    startTransition(async () => {
      const result = await addProjectTechnologyAction(projectId, selectedTechnologyId);

      if (!result.ok) {
        setFeedback({
          kind: "error",
          message: result.message,
        });

        return;
      }

      setSelectedTechnologyId("");

      setFeedback({
        kind: "success",
        message: result.message,
      });

      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {feedback ? (
        <Alert variant={feedback.kind === "error" ? "destructive" : "default"}>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <Label htmlFor="technologyToAdd">Add technology</Label>

          <select
            id="technologyToAdd"
            value={selectedTechnologyId}
            onChange={(event) => setSelectedTechnologyId(event.target.value)}
            disabled={isPending || available.length === 0}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {available.length > 0 ? "Select technology" : "All technologies assigned"}
            </option>

            {available.map((technology) => (
              <option key={technology.id} value={technology.id}>
                {technology.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="button" disabled={isPending || !selectedTechnologyId} onClick={addTechnology}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="size-4" aria-hidden="true" />
          )}
          Add
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">No technologies assigned</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add technologies to define the technology stack for this project.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <TechnologyRelationshipRow
              key={link.technologyId}
              projectId={projectId}
              link={link}
              onFeedback={setFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type TechnologyRelationshipRowProps = {
  projectId: string;
  link: ProjectTechnologyLink;
  onFeedback: (feedback: Feedback) => void;
};

function TechnologyRelationshipRow({
  projectId,
  link,
  onFeedback,
}: TechnologyRelationshipRowProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [displayOrder, setDisplayOrder] = useState(link.displayOrder);

  function saveOrder() {
    startTransition(async () => {
      const result = await updateProjectTechnologyOrderAction(
        projectId,
        link.technologyId,
        displayOrder,
      );

      onFeedback({
        kind: result.ok ? "success" : "error",
        message: result.message,
      });

      if (result.ok) {
        router.refresh();
      }
    });
  }

  function removeTechnology() {
    const confirmed = window.confirm(`Remove ${link.name} from this project?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await removeProjectTechnologyAction(projectId, link.technologyId);

      onFeedback({
        kind: result.ok ? "success" : "error",
        message: result.message,
      });

      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">{link.name}</p>

        <p className="mt-1 text-xs break-all text-muted-foreground">{link.slug}</p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor={`technology-order-${link.technologyId}`} className="text-xs">
            Order
          </Label>

          <Input
            id={`technology-order-${link.technologyId}`}
            type="number"
            min={0}
            value={displayOrder}
            onChange={(event) => setDisplayOrder(Number(event.target.value))}
            className="w-24"
          />
        </div>

        <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={saveOrder}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          Save
        </Button>

        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={removeTechnology}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Remove
        </Button>
      </div>
    </div>
  );
}
