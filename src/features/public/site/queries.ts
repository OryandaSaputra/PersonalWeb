import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { profiles, siteSettings, socialLinks } from "@/server/db/schema";

export type PublicSiteShellData = {
  siteName: string;
  siteTagline: string | null;
  socialLinks: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
  }>;
};

export async function getPublicSiteShellData(): Promise<PublicSiteShellData> {
  const [settingsRows, profileRows] = await Promise.all([
    db
      .select({
        siteName: siteSettings.siteName,
        siteTagline: siteSettings.siteTagline,
      })
      .from(siteSettings)
      .limit(1),

    db
      .select({
        id: profiles.id,
        fullName: profiles.fullName,
        professionalTitle: profiles.professionalTitle,
      })
      .from(profiles)
      .limit(1),
  ]);

  const settings = settingsRows[0] ?? null;

  const profile = profileRows[0] ?? null;

  const links = profile
    ? await db
        .select({
          id: socialLinks.id,
          platform: socialLinks.platform,
          label: socialLinks.label,
          url: socialLinks.url,
          displayOrder: socialLinks.displayOrder,
        })
        .from(socialLinks)
        .where(and(eq(socialLinks.profileId, profile.id), eq(socialLinks.isVisible, true)))
        .orderBy(asc(socialLinks.displayOrder), asc(socialLinks.label))
    : [];

  return {
    siteName: settings?.siteName ?? profile?.fullName ?? "Portfolio",

    siteTagline: settings?.siteTagline ?? profile?.professionalTitle ?? null,

    socialLinks: links.map((link) => ({
      id: link.id,
      platform: link.platform,
      label: link.label,
      url: link.url,
    })),
  };
}
