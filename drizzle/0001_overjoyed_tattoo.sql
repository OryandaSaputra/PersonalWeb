CREATE TABLE "admin_login_failures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_hash" varchar(128) NOT NULL,
	"ip_hash" varchar(128) NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "admin_login_failures_email_attempted_idx" ON "admin_login_failures" USING btree ("email_hash","attempted_at");--> statement-breakpoint
CREATE INDEX "admin_login_failures_ip_attempted_idx" ON "admin_login_failures" USING btree ("ip_hash","attempted_at");--> statement-breakpoint
CREATE INDEX "admin_login_failures_attempted_at_idx" ON "admin_login_failures" USING btree ("attempted_at");