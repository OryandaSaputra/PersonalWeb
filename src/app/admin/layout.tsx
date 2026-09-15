import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

type AdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AdminLayout({ children }: AdminLayoutProps) {
  return children;
}
