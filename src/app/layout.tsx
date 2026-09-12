import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Oryanda Saputra | Full-Stack Web Developer",
    template: "%s | Oryanda Saputra",
  },
  description:
    "Portfolio of Oryanda Saputra, an Informatics Engineering graduate focused on full-stack web development and software engineering.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
