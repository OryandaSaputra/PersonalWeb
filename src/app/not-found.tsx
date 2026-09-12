import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-950">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">404</p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>

        <p className="mt-4 leading-7 text-slate-600">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
