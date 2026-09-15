import type { ReactNode } from "react";

import { requireAdmin } from "@/server/auth/guards";

type ProtectedAdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  await requireAdmin();

  return children;
}
