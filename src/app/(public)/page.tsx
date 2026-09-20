import { AboutSection } from "@/components/public/about-section";
import { CertificationsSection } from "@/components/public/certifications-section";
import { ContactCtaSection } from "@/components/public/contact-cta-section";
import { EducationSection } from "@/components/public/education-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { FeaturedProjectsSection } from "@/components/public/featured-projects-section";
import { HeroSection } from "@/components/public/hero-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { SkillsSection } from "@/components/public/skills-section";
import { getPublicHomePageData } from "@/features/public/home/queries";
import type { PublicNavigationItem } from "@/features/public/home/types";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const data = await getPublicHomePageData();

  const profile = data.profile;

  if (!profile) {
    return (
      <>
        <PublicHeader
          siteName={data.settings.siteName}
          items={[
            {
              label: "Home",
              href: "#home",
            },
          ]}
        />

        <main id="main-content" className="flex min-h-[70svh] items-center">
          <section id="home" className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              Portfolio
            </p>

            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Portfolio content is currently unavailable.
            </h1>

            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              The public profile has not been configured yet.
            </p>
          </section>
        </main>

        <PublicFooter
          siteName={data.settings.siteName}
          siteTagline={data.settings.siteTagline}
          socialLinks={[]}
        />
      </>
    );
  }

  const hasAbout = Boolean(profile.about || profile.careerFocus || profile.location);

  const hasExperience = data.experiences.length > 0 || data.organizationExperiences.length > 0;

  const navigationItems: PublicNavigationItem[] = [
    {
      label: "Home",
      href: "#home",
    },

    ...(hasAbout
      ? [
          {
            label: "About",
            href: "#about",
          },
        ]
      : []),

    ...(data.skillCategories.length > 0
      ? [
          {
            label: "Skills",
            href: "#skills",
          },
        ]
      : []),

    ...(hasExperience
      ? [
          {
            label: "Experience",
            href: "#experience",
          },
        ]
      : []),

    ...(data.featuredProjects.length > 0
      ? [
          {
            label: "Projects",
            href: "#projects",
          },
        ]
      : []),

    ...(data.certifications.length > 0
      ? [
          {
            label: "Certifications",
            href: "#certifications",
          },
        ]
      : []),

    {
      label: "Contact",
      href: "#contact",
    },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] -translate-y-24 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform focus:translate-y-0 focus:ring-2 focus:ring-ring focus:outline-none"
      >
        Skip to content
      </a>

      <PublicHeader siteName={data.settings.siteName} items={navigationItems} />

      <main id="main-content">
        <HeroSection
          profile={profile}
          socialLinks={data.socialLinks}
          hasFeaturedProjects={data.featuredProjects.length > 0}
        />

        {hasAbout ? (
          <ScrollReveal>
            <AboutSection profile={profile} />
          </ScrollReveal>
        ) : null}

        {data.skillCategories.length > 0 ? (
          <ScrollReveal>
            <SkillsSection categories={data.skillCategories} />
          </ScrollReveal>
        ) : null}

        {hasExperience ? (
          <ScrollReveal>
            <ExperienceSection
              experiences={data.experiences}
              organizations={data.organizationExperiences}
            />
          </ScrollReveal>
        ) : null}

        {data.educations.length > 0 ? (
          <ScrollReveal>
            <EducationSection educations={data.educations} />
          </ScrollReveal>
        ) : null}

        {data.featuredProjects.length > 0 ? (
          <ScrollReveal>
            <FeaturedProjectsSection projects={data.featuredProjects} />
          </ScrollReveal>
        ) : null}

        {data.certifications.length > 0 ? (
          <ScrollReveal>
            <CertificationsSection certifications={data.certifications} />
          </ScrollReveal>
        ) : null}

        <ScrollReveal>
          <ContactCtaSection profile={profile} socialLinks={data.socialLinks} />
        </ScrollReveal>
      </main>

      <PublicFooter
        siteName={data.settings.siteName}
        siteTagline={data.settings.siteTagline ?? profile.professionalTitle}
        socialLinks={data.socialLinks}
      />
    </>
  );
}
