CREATE TYPE "public"."form_status_enum" AS ENUM('publish', 'unpublish', 'closed');--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "expire_at" timestamp;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status_enum";--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "response_limit" integer;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "is_private" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "hash_password" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "template_id" text;