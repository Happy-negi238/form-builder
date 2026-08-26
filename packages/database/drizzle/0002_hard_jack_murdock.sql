CREATE TYPE "public"."field_type_enum" AS ENUM('TEXT', 'EMAIL', 'PASSWORD', 'NUMBER', 'YES_NO');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(70) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"description" varchar(100),
	"type" "field_type_enum" NOT NULL,
	"placeholder" varchar(70),
	"is_required" boolean DEFAULT false NOT NULL,
	"index" numeric NOT NULL,
	"form_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "form_fields_index_form_id_unique" UNIQUE("index","form_id")
);
--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;