"use client";

import { upload } from "@vercel/blob/client";
import { FileText, ImageIcon, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getMediaUploadRules, formatFileSize } from "@/features/admin/media/config";
import { buildMediaUploadPath } from "@/features/admin/media/client";
import {
  registerCertificationImageAction,
  registerCvAction,
  registerProfileImageAction,
  removeCertificationImageAction,
  removeCvAction,
  removeProfileImageAction,
} from "@/features/admin/media/actions";
import type { MediaUploadIntent, UploadedBlobInput } from "@/features/admin/media/validation";

type SingleMediaKind = "profile-image" | "cv" | "certification-image";

type CurrentMedia = {
  id: string;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
};

type SingleMediaManagerProps = {
  kind: SingleMediaKind;
  title: string;
  description: string;
  current: CurrentMedia | null;
  targetId?: string;
};

type Feedback = {
  kind: "success" | "error";
  message: string;
} | null;

export function SingleMediaManager({
  kind,
  title,
  description,
  current,
  targetId,
}: SingleMediaManagerProps) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);

  const [feedback, setFeedback] = useState<Feedback>(null);

  const [isPending, startTransition] = useTransition();

  const rules = getMediaUploadRules(kind);

  function buildIntent(): MediaUploadIntent {
    if (kind === "certification-image") {
      if (!targetId) {
        throw new Error("Certification target is missing.");
      }

      return {
        kind,
        targetId,
      };
    }

    return {
      kind,
    };
  }

  async function registerUpload(blob: UploadedBlobInput) {
    if (kind === "profile-image") {
      return registerProfileImageAction(blob);
    }

    if (kind === "cv") {
      return registerCvAction(blob);
    }

    if (!targetId) {
      return {
        ok: false as const,
        message: "Certification target is missing.",
      };
    }

    return registerCertificationImageAction(targetId, blob);
  }

  function submitUpload() {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setFeedback({
        kind: "error",
        message: "Select a file first.",
      });

      return;
    }

    const typeAllowed = rules.allowedContentTypes.some((type) => type === file.type);

    if (!typeAllowed) {
      setFeedback({
        kind: "error",
        message: "The selected file type is not allowed.",
      });

      return;
    }

    if (file.size > rules.maximumSizeInBytes) {
      setFeedback({
        kind: "error",
        message: `The file must be ${formatFileSize(rules.maximumSizeInBytes)} or smaller.`,
      });

      return;
    }

    startTransition(async () => {
      try {
        setFeedback(null);
        setProgress(0);

        const intent = buildIntent();

        const pathname = buildMediaUploadPath(intent, file);

        const blob = await upload(pathname, file, {
          access: "public",

          handleUploadUrl: "/api/admin/media/upload",

          clientPayload: JSON.stringify(intent),

          multipart: file.size > 5 * 1024 * 1024,

          onUploadProgress: ({ percentage }) => {
            setProgress(percentage);
          },
        });

        const result = await registerUpload({
          url: blob.url,
          pathname: blob.pathname,
          originalFilename: file.name,
        });

        if (!result.ok) {
          setFeedback({
            kind: "error",
            message: result.message,
          });

          return;
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setProgress(0);

        setFeedback({
          kind: "success",
          message: result.message,
        });

        router.refresh();
      } catch (error) {
        console.error("Media upload failed.", error);

        setFeedback({
          kind: "error",
          message: "The file could not be uploaded. Verify the Blob configuration and try again.",
        });
      }
    });
  }

  function removeCurrent() {
    if (!current) {
      return;
    }

    const confirmed = window.confirm(`Remove ${title}?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      let result;

      if (kind === "profile-image") {
        result = await removeProfileImageAction();
      } else if (kind === "cv") {
        result = await removeCvAction();
      } else if (targetId) {
        result = await removeCertificationImageAction(targetId);
      } else {
        result = {
          ok: false as const,
          message: "Certification target is missing.",
        };
      }

      setFeedback({
        kind: result.ok ? "success" : "error",
        message: result.message,
      });

      if (result.ok) {
        router.refresh();
      }
    });
  }

  const isImage = current?.mimeType.startsWith("image/") ?? false;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {feedback ? (
        <Alert variant={feedback.kind === "error" ? "destructive" : "default"}>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      {current ? (
        <div className="rounded-xl border border-border p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {isImage ? (
              <div
                role="img"
                aria-label={`Current ${title}`}
                className="aspect-square w-full max-w-36 rounded-lg border border-border bg-muted bg-cover bg-center"
                style={{
                  backgroundImage: `url("${current.storageKey}")`,
                }}
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-lg border border-border bg-muted">
                <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{current.originalFilename}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {current.mimeType} · {formatFileSize(current.sizeBytes)}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={current.storageKey} target="_blank" rel="noreferrer">
                    {isImage ? (
                      <ImageIcon className="size-4" aria-hidden="true" />
                    ) : (
                      <FileText className="size-4" aria-hidden="true" />
                    )}
                    Open file
                  </a>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={removeCurrent}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">No file uploaded</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`media-file-${kind}-${targetId ?? "profile"}`}>
            {current ? "Replace file" : "Upload file"}
          </Label>

          <input
            ref={fileInputRef}
            id={`media-file-${kind}-${targetId ?? "profile"}`}
            type="file"
            accept={rules.allowedContentTypes.join(",")}
            disabled={isPending}
            className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50"
          />

          <p className="text-xs text-muted-foreground">
            Maximum size: {formatFileSize(rules.maximumSizeInBytes)}
          </p>
        </div>

        {isPending && progress > 0 ? (
          <div className="space-y-1">
            <progress className="h-2 w-full" value={progress} max={100} />

            <p className="text-xs text-muted-foreground">Uploading: {Math.round(progress)}%</p>
          </div>
        ) : null}

        <Button type="button" disabled={isPending} onClick={submitUpload}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="size-4" aria-hidden="true" />
          )}

          {isPending ? "Uploading..." : current ? "Replace" : "Upload"}
        </Button>
      </div>
    </div>
  );
}
