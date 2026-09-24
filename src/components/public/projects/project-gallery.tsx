import type { PublicProjectImage } from "@/features/public/projects/types";

type ProjectGalleryProps = {
  images: PublicProjectImage[];
};

export function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="project-gallery-heading" className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Product Views
        </p>

        <h2
          id="project-gallery-heading"
          className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground"
        >
          Interface gallery
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Selected screenshots managed directly from the project media workspace.
        </p>
      </div>

      <div className="grid gap-6">
        {images.map((image) => (
          <figure
            key={image.id}
            className="overflow-hidden rounded-[1.5rem] border border-border bg-card"
          >
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
              aria-label={`Open full-size image: ${image.altText}`}
            >
              <div
                role="img"
                aria-label={image.altText}
                className="aspect-video w-full bg-muted bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${image.url}")`,
                }}
              />
            </a>

            {image.caption ? (
              <figcaption className="border-t border-border px-5 py-4 text-sm leading-6 text-muted-foreground">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
