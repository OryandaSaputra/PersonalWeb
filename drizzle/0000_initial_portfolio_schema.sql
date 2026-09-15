CREATE TYPE "public"."case_study_visibility" AS ENUM('public', 'limited', 'private');--> statement-breakpoint
CREATE TYPE "public"."contact_message_status" AS ENUM('unread', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."project_image_type" AS ENUM('cover', 'screenshot');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'published', 'hidden');--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" smallint NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email"),
	CONSTRAINT "admin_users_singleton_check" CHECK ("admin_users"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(220) NOT NULL,
	"issuer" varchar(200) NOT NULL,
	"status" varchar(100),
	"issue_date" date,
	"expiration_date" date,
	"credential_id" varchar(200),
	"credential_url" text,
	"certificate_media_id" uuid,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certifications_date_range_check" CHECK ("certifications"."issue_date" IS NULL OR "certifications"."expiration_date" IS NULL OR "certifications"."expiration_date" >= "certifications"."issue_date"),
	CONSTRAINT "certifications_display_order_check" CHECK ("certifications"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(320) NOT NULL,
	"subject" varchar(220) NOT NULL,
	"message" text NOT NULL,
	"status" "contact_message_status" DEFAULT 'unread' NOT NULL,
	"read_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "educations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution" varchar(220) NOT NULL,
	"degree" varchar(160) NOT NULL,
	"major" varchar(160) NOT NULL,
	"start_year" smallint NOT NULL,
	"graduation_year" smallint,
	"gpa" numeric(3, 2),
	"gpa_scale" numeric(3, 2) DEFAULT 4 NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "educations_start_year_check" CHECK ("educations"."start_year" BETWEEN 1900 AND 2100),
	CONSTRAINT "educations_graduation_year_check" CHECK ("educations"."graduation_year" IS NULL OR "educations"."graduation_year" BETWEEN 1900 AND 2100),
	CONSTRAINT "educations_year_range_check" CHECK ("educations"."graduation_year" IS NULL OR "educations"."graduation_year" >= "educations"."start_year"),
	CONSTRAINT "educations_gpa_scale_check" CHECK ("educations"."gpa_scale" > 0),
	CONSTRAINT "educations_gpa_check" CHECK ("educations"."gpa" IS NULL OR ("educations"."gpa" >= 0 AND "educations"."gpa" <= "educations"."gpa_scale")),
	CONSTRAINT "educations_display_order_check" CHECK ("educations"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(200) NOT NULL,
	"position" varchar(200) NOT NULL,
	"employment_type" varchar(80),
	"location" varchar(160),
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text,
	"responsibilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"achievements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "experiences_date_range_check" CHECK ("experiences"."end_date" IS NULL OR "experiences"."end_date" >= "experiences"."start_date"),
	CONSTRAINT "experiences_current_end_date_check" CHECK ("experiences"."is_current" = false OR "experiences"."end_date" IS NULL),
	CONSTRAINT "experiences_display_order_check" CHECK ("experiences"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "organization_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization" varchar(200) NOT NULL,
	"position" varchar(200) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text,
	"responsibilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_experiences_date_range_check" CHECK ("organization_experiences"."end_date" IS NULL OR "organization_experiences"."end_date" >= "organization_experiences"."start_date"),
	CONSTRAINT "organization_experiences_current_end_date_check" CHECK ("organization_experiences"."is_current" = false OR "organization_experiences"."end_date" IS NULL),
	CONSTRAINT "organization_experiences_display_order_check" CHECK ("organization_experiences"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(50) DEFAULT 'vercel_blob' NOT NULL,
	"storage_key" text NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"mime_type" varchar(120) NOT NULL,
	"size_bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"visibility" "media_visibility" DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_storage_key_unique" UNIQUE("storage_key"),
	CONSTRAINT "media_assets_size_positive_check" CHECK ("media_assets"."size_bytes" > 0),
	CONSTRAINT "media_assets_width_positive_check" CHECK ("media_assets"."width" IS NULL OR "media_assets"."width" > 0),
	CONSTRAINT "media_assets_height_positive_check" CHECK ("media_assets"."height" IS NULL OR "media_assets"."height" > 0)
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"full_name" varchar(160) NOT NULL,
	"professional_title" varchar(160) NOT NULL,
	"short_introduction" text,
	"about" text,
	"location" varchar(160),
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"show_phone_publicly" boolean DEFAULT false NOT NULL,
	"career_focus" varchar(200),
	"hero_tagline" varchar(240),
	"profile_image_media_id" uuid,
	"cv_media_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_singleton_check" CHECK ("profiles"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" smallint NOT NULL,
	"platform" varchar(80) NOT NULL,
	"label" varchar(120) NOT NULL,
	"url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social_links_display_order_check" CHECK ("social_links"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"media_asset_id" uuid NOT NULL,
	"image_type" "project_image_type" DEFAULT 'screenshot' NOT NULL,
	"caption" varchar(300),
	"alt_text" varchar(300) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_images_display_order_check" CHECK ("project_images"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "project_technologies" (
	"project_id" uuid NOT NULL,
	"technology_id" uuid NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_technologies_pk" PRIMARY KEY("project_id","technology_id"),
	CONSTRAINT "project_technologies_display_order_check" CHECK ("project_technologies"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(220) NOT NULL,
	"slug" varchar(240) NOT NULL,
	"project_type" varchar(80),
	"organization" varchar(220),
	"short_description" varchar(500) NOT NULL,
	"full_description" text,
	"background" text,
	"problem" text,
	"solution" text,
	"role" text,
	"key_features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"challenges" text,
	"learning" text,
	"repository_url" text,
	"live_url" text,
	"documentation_url" text,
	"start_date" date,
	"end_date" date,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"case_study_visibility" "case_study_visibility" DEFAULT 'public' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"published_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug"),
	CONSTRAINT "projects_slug_format_check" CHECK ("projects"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "projects_display_order_check" CHECK ("projects"."display_order" >= 0),
	CONSTRAINT "projects_date_range_check" CHECK ("projects"."start_date" IS NULL OR "projects"."end_date" IS NULL OR "projects"."end_date" >= "projects"."start_date"),
	CONSTRAINT "projects_featured_published_check" CHECK ("projects"."is_featured" = false OR "projects"."status" = 'published'),
	CONSTRAINT "projects_published_at_check" CHECK ("projects"."status" <> 'published' OR "projects"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technologies_name_unique" UNIQUE("name"),
	CONSTRAINT "technologies_slug_unique" UNIQUE("slug"),
	CONSTRAINT "technologies_slug_format_check" CHECK ("technologies"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"site_name" varchar(160) DEFAULT 'Oryanda Saputra' NOT NULL,
	"site_tagline" varchar(240),
	"default_seo_title" varchar(200),
	"default_seo_description" text,
	"default_language" varchar(10) DEFAULT 'en' NOT NULL,
	"contact_form_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_singleton_check" CHECK ("site_settings"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "skill_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skill_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "skill_categories_slug_unique" UNIQUE("slug"),
	CONSTRAINT "skill_categories_slug_format_check" CHECK ("skill_categories"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "skill_categories_display_order_check" CHECK ("skill_categories"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"icon" varchar(120),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_display_order_check" CHECK ("skills"."display_order" >= 0)
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_certificate_media_id_media_assets_id_fk" FOREIGN KEY ("certificate_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_image_media_id_media_assets_id_fk" FOREIGN KEY ("profile_image_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_cv_media_id_media_assets_id_fk" FOREIGN KEY ("cv_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_skill_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."skill_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_sessions_user_idx" ON "admin_sessions" USING btree ("admin_user_id");--> statement-breakpoint
CREATE INDEX "admin_sessions_expires_at_idx" ON "admin_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "admin_sessions_revoked_at_idx" ON "admin_sessions" USING btree ("revoked_at");--> statement-breakpoint
CREATE INDEX "admin_users_active_idx" ON "admin_users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "certifications_visible_order_idx" ON "certifications" USING btree ("is_visible","display_order");--> statement-breakpoint
CREATE INDEX "contact_messages_status_created_idx" ON "contact_messages" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "educations_visible_order_idx" ON "educations" USING btree ("is_visible","display_order");--> statement-breakpoint
CREATE INDEX "experiences_visible_order_idx" ON "experiences" USING btree ("is_visible","display_order");--> statement-breakpoint
CREATE INDEX "experiences_start_date_idx" ON "experiences" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "organization_experiences_visible_order_idx" ON "organization_experiences" USING btree ("is_visible","display_order");--> statement-breakpoint
CREATE INDEX "media_assets_visibility_idx" ON "media_assets" USING btree ("visibility");--> statement-breakpoint
CREATE UNIQUE INDEX "social_links_profile_platform_unique_idx" ON "social_links" USING btree ("profile_id","platform");--> statement-breakpoint
CREATE INDEX "social_links_visible_order_idx" ON "social_links" USING btree ("is_visible","display_order");--> statement-breakpoint
CREATE INDEX "project_images_project_order_idx" ON "project_images" USING btree ("project_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_images_single_cover_idx" ON "project_images" USING btree ("project_id") WHERE "project_images"."image_type" = 'cover';--> statement-breakpoint
CREATE INDEX "project_technologies_technology_idx" ON "project_technologies" USING btree ("technology_id");--> statement-breakpoint
CREATE INDEX "projects_status_order_idx" ON "projects" USING btree ("status","display_order");--> statement-breakpoint
CREATE INDEX "projects_featured_order_idx" ON "projects" USING btree ("is_featured","display_order");--> statement-breakpoint
CREATE INDEX "skill_categories_visible_order_idx" ON "skill_categories" USING btree ("is_visible","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_category_name_unique_idx" ON "skills" USING btree ("category_id","name");--> statement-breakpoint
CREATE INDEX "skills_category_visible_order_idx" ON "skills" USING btree ("category_id","is_visible","display_order");