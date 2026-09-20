import {
  Award,
  BriefcaseBusiness,
  FileImage,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type AdminNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  available: boolean;
  availabilityLabel?: string;
};

export type AdminNavigationGroup = {
  label: string;
  items: AdminNavigationItem[];
};

export const ADMIN_NAVIGATION_GROUPS: AdminNavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        available: true,
      },
    ],
  },
  {
    label: "Portfolio Content",
    items: [
      {
        label: "Profile",
        href: "/admin/profile",
        icon: UserRound,
        available: true,
      },
      {
        label: "Experience",
        href: "/admin/experience",
        icon: BriefcaseBusiness,
        available: true,
      },
      {
        label: "Organizations",
        href: "/admin/organizations",
        icon: UsersRound,
        available: true,
      },
      {
        label: "Education",
        href: "/admin/education",
        icon: GraduationCap,
        available: true,
      },
      {
        label: "Skills",
        href: "/admin/skills",
        icon: Sparkles,
        available: true,
      },
      {
        label: "Projects",
        href: "/admin/projects",
        icon: FolderKanban,
        available: true,
      },
      {
        label: "Certifications",
        href: "/admin/certifications",
        icon: Award,
        available: true,
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        label: "Messages",
        href: "/admin/messages",
        icon: Mail,
        available: false,
        availabilityLabel: "Stage 12",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Media",
        href: "/admin/media",
        icon: FileImage,
        available: true,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        available: false,
        availabilityLabel: "Planned",
      },
    ],
  },
];

const ADMIN_PAGE_TITLES = [
  {
    prefix: "/admin/dashboard",
    title: "Dashboard",
  },
  {
    prefix: "/admin/profile",
    title: "Profile",
  },
  {
    prefix: "/admin/experience",
    title: "Experience",
  },
  {
    prefix: "/admin/organizations",
    title: "Organizations",
  },
  {
    prefix: "/admin/education",
    title: "Education",
  },
  {
    prefix: "/admin/skills",
    title: "Skills",
  },
  {
    prefix: "/admin/projects",
    title: "Projects",
  },
  {
    prefix: "/admin/certifications",
    title: "Certifications",
  },
  {
    prefix: "/admin/messages",
    title: "Messages",
  },
  {
    prefix: "/admin/media",
    title: "Media",
  },
  {
    prefix: "/admin/settings",
    title: "Settings",
  },
] as const;

export function getAdminPageTitle(pathname: string): string {
  const match = ADMIN_PAGE_TITLES.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return match?.title ?? "Admin";
}
