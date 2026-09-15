import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { inter, manrope } from "@/lib/fonts";
import { cn } from "@/lib/utils";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, manrope.variable, "min-h-screen bg-background")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="oryanda-portfolio-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
