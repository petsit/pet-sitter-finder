CREATE TYPE "public"."review_status" AS ENUM('pending', 'verified', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "herd_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" text NOT NULL,
	"business_name" text NOT NULL,
	"author_name" text NOT NULL,
	"author_email" text NOT NULL,
	"rating" text NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"service_used" text,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"reviewer_note" text,
	"reported_count" text DEFAULT '0'
);
--> statement-breakpoint
CREATE INDEX "herd_reviews_place_idx" ON "herd_reviews" USING btree ("place_id");--> statement-breakpoint
CREATE INDEX "herd_reviews_email_idx" ON "herd_reviews" USING btree ("author_email");--> statement-breakpoint
CREATE INDEX "herd_reviews_status_idx" ON "herd_reviews" USING btree ("status");