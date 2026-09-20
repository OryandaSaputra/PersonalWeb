"use client";

import { upload } from "@vercel/blob/client";
import { ImagePlus, LoaderCircle, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteProjectImageAction,
  registerProjectImageAction,
  updateProjectImageAction,
} from "@/features/admin/media/actions";
import { buildMediaUploadPath } from "@/features/admin/media/client";
import {
  PROJECT_IMAGE_TYPES,
  formatFileSize,
  getMediaUploadRules,
  type ProjectImageType,
} from "@/features/admin/media/config";
import type { MediaUploadIntent } from "@/features/admin/media/validation";

type ProjectImageRecord = {
  id: string;
  imageType: ProjectImageType;
  caption: string | null;
  altText: string;
  displayOrder: number;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
};

type ProjectImageManagerProps = {
  projectId: string;
  images: ProjectImageRecord[];
};

type Feedback = {
  kind: "success" | "error";
  message: string;
} | null;

export function ProjectImageManager({ projectId, images }: ProjectImageManagerProps) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageType, setImageType] = useState<ProjectImageType>("screenshot");

  const [altText, setAltText] = useState("");

  const [caption, setCaption] = useState("");

  const [displayOrder, setDisplayOrder] = useState(images.length);

  const [progress, setProgress] = useState(0);

  const [feedback, setFeedback] = useState<Feedback>(null);

  const [isPending, startTransition] = useTransition();

  const rules = getMediaUploadRules("project-image");

  function uploadImage() {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setFeedback({
        kind: "error",
        message: "Select an image first.",
      });

      return;
    }

    if (!rules.allowedContentTypes.some((type) => type === file.type)) {
      setFeedback({
        kind: "error",
        message: "The selected image type is not allowed.",
      });

      return;
    }

    if (file.size > rules.maximumSizeInBytes) {
      setFeedback({
        kind: "error",
        message: `The image must be ${formatFileSize(rules.maximumSizeInBytes)} or smaller.`,
      });

      return;
    }

    if (altText.trim().length < 3) {
      setFeedback({
        kind: "error",
        message: "Alt text is required and must contain at least 3 characters.",
      });

      return;
    }

    startTransition(async () => {
      try {
        setFeedback(null);
        setProgress(0);

        const intent: MediaUploadIntent = {
          kind: "project-image",
          targetId: projectId,
        };

        const blob = await upload(buildMediaUploadPath(intent, file), file, {
          access: "public",

          handleUploadUrl: "/api/admin/media/upload",

          clientPayload: JSON.stringify(intent),

          multipart: file.size > 5 * 1024 * 1024,

          onUploadProgress: ({ percentage }) => {
            setProgress(percentage);
          },
        });

        const result = await registerProjectImageAction({
          projectId,
          imageType,
          altText,
          caption,
          displayOrder,

          upload: {
            url: blob.url,
            pathname: blob.pathname,
            originalFilename: file.name,
          },
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

        setImageType("screenshot");
        setAltText("");
        setCaption("");
        setDisplayOrder(images.length + 1);
        setProgress(0);

        setFeedback({
          kind: "success",
          message: result.message,
        });

        router.refresh();
      } catch (error) {
        console.error("Project image upload failed.", error);

        setFeedback({
          kind: "error",
          message: "Project image upload failed. Verify Blob configuration and try again.",
        });
      }
    });
  }

  return (
    <div className="space-y-8">
      {feedback ? (
        <Alert variant={feedback.kind === "error" ? "destructive" : "default"}>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      <section
        aria-labelledby="project-image-upload-heading"
        className="space-y-5 rounded-xl border border-border p-5"
      >
        <div>
          <h2 id="project-image-upload-heading" className="font-display font-semibold">
            Upload project image
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload one cover or multiple screenshots. Setting a new cover automatically demotes the
            previous cover to screenshot.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="projectImageFile">Image</Label>

            <input
              ref={fileInputRef}
              id="projectImageFile"
              type="file"
              accept={rules.allowedContentTypes.join(",")}
              disabled={isPending}
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="text-xs text-muted-foreground">
              Maximum size: {formatFileSize(rules.maximumSizeInBytes)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectImageType">Image type</Label>

            <select
              id="projectImageType"
              value={imageType}
              onChange={(event) => setImageType(event.target.value as ProjectImageType)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {PROJECT_IMAGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "cover" ? "Cover" : "Screenshot"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectImageOrder">Display order</Label>

            <Input
              id="projectImageOrder"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(event) => setDisplayOrder(Number(event.target.value))}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="projectImageAlt">Alt text</Label>

            <Input
              id="projectImageAlt"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Describe what is visible in the screenshot."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="projectImageCaption">Caption</Label>

            <Textarea
              id="projectImageCaption"
              rows={3}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
          </div>
        </div>

        {isPending && progress > 0 ? (
          <div className="space-y-1">
            <progress className="h-2 w-full" value={progress} max={100} />

            <p className="text-xs text-muted-foreground">Uploading: {Math.round(progress)}%</p>
          </div>
        ) : null}

        <Button type="button" disabled={isPending} onClick={uploadImage}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-4" aria-hidden="true" />
          )}

          {isPending ? "Uploading..." : "Upload image"}
        </Button>
      </section>

      <section aria-labelledby="project-gallery-heading" className="space-y-4">
        <div>
          <h2 id="project-gallery-heading" className="font-display text-lg font-semibold">
            Project gallery
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Edit metadata, set the cover, control order, or remove images.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-medium">No project images yet</p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {images.map((image) => (
              <ProjectImageCard key={image.id} image={image} onFeedback={setFeedback} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

type ProjectImageCardProps = {
  image: ProjectImageRecord;
  onFeedback: (feedback: Feedback) => void;
};

function ProjectImageCard({ image, onFeedback }: ProjectImageCardProps) {
  const router = useRouter();

  const [imageType, setImageType] = useState<ProjectImageType>(image.imageType);

  const [altText, setAltText] = useState(image.altText);

  const [caption, setCaption] = useState(image.caption ?? "");

  const [displayOrder, setDisplayOrder] = useState(image.displayOrder);

  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateProjectImageAction(image.id, {
        imageType,
        altText,
        caption,
        displayOrder,
      });

      onFeedback({
        kind: result.ok ? "success" : "error",
        message: result.message,
      });

      if (result.ok) {
        router.refresh();
      }
    });
  }

  function remove() {
    const confirmed = window.confirm(`Delete image "${image.altText}"?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProjectImageAction(image.id);

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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        role="img"
        aria-label={image.altText}
        className="aspect-video w-full bg-muted bg-cover bg-center"
        style={{
          backgroundImage: `url("${image.storageKey}")`,
        }}
      />

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={image.imageType === "cover" ? "success" : "secondary"}>
            {image.imageType}
          </Badge>

          <span className="text-xs text-muted-foreground">{formatFileSize(image.sizeBytes)}</span>

          <span className="truncate text-xs text-muted-foreground">{image.originalFilename}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`type-${image.id}`}>Image type</Label>

            <select
              id={`type-${image.id}`}
              value={imageType}
              onChange={(event) => setImageType(event.target.value as ProjectImageType)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="cover">Cover</option>
              <option value="screenshot">Screenshot</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`order-${image.id}`}>Display order</Label>

            <Input
              id={`order-${image.id}`}
              type="number"
              min={0}
              value={displayOrder}
              onChange={(event) => setDisplayOrder(Number(event.target.value))}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`alt-${image.id}`}>Alt text</Label>

            <Input
              id={`alt-${image.id}`}
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`caption-${image.id}`}>Caption</Label>

            <Textarea
              id={`caption-${image.id}`}
              rows={3}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" disabled={isPending} onClick={save}>
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
            onClick={remove}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
