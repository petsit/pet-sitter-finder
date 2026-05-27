CREATE TYPE "public"."claim_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" text NOT NULL,
	"business_name" text NOT NULL,
	"business_address" text,
	"claimant_name" text NOT NULL,
	"claimant_role" text NOT NULL,
	"claimant_email" text NOT NULL,
	"claimant_phone" text,
	"message" text,
	"status" "claim_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewer_note" text
);
--> statement-breakpoint
CREATE TABLE "provider_overrides" (
	"place_id" text PRIMARY KEY NOT NULL,
	"owner_email" text NOT NULL,
	"description" text,
	"services_offered" text,
	"pricing_notes" text,
	"custom_photos" jsonb,
	"custom_hours" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "claims_place_idx" ON "claims" USING btree ("place_id");--> statement-breakpoint
CREATE INDEX "claims_email_idx" ON "claims" USING btree ("claimant_email");--> statement-breakpoint
CREATE INDEX "claims_status_idx" ON "claims" USING btree ("status");--> statement-breakpoint
CREATE INDEX "overrides_owner_idx" ON "provider_overrides" USING btree ("owner_email");