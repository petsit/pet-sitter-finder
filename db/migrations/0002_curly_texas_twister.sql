ALTER TABLE "herd_reviews" ADD COLUMN "reported_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "provider_overrides" ADD COLUMN "price_from" text;--> statement-breakpoint
ALTER TABLE "provider_overrides" ADD COLUMN "price_unit" text;--> statement-breakpoint
ALTER TABLE "provider_overrides" ADD COLUMN "response_time_hours" text;