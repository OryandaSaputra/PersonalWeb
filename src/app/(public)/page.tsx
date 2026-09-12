export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section
        className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-20 sm:px-8 lg:px-12"
        aria-labelledby="portfolio-foundation-title"
      >
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Portfolio Foundation
          </p>

          <h1
            id="portfolio-foundation-title"
            className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Oryanda Saputra
          </h1>

          <p className="mt-4 text-xl font-medium text-slate-700 sm:text-2xl">
            Full-Stack Web Developer
          </p>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            The application foundation is ready. Portfolio content, design system, database, private
            administration, and professional case studies will be implemented incrementally in the
            next development stages.
          </p>

          <div
            className="mt-8 flex flex-wrap gap-2"
            aria-label="Current application foundation technologies"
          >
            <span className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
              Next.js
            </span>

            <span className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
              React
            </span>

            <span className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
              TypeScript
            </span>

            <span className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
              Tailwind CSS
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
