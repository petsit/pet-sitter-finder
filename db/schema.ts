import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "approved",
  "rejected",
]);

// Claims submitted via the "Are you the owner?" flow. Persisted so that
// the admin can review and approve them, and so that a single email
// address can claim multiple listings over time.
export const claims = pgTable(
  "claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    placeId: text("place_id").notNull(),
    businessName: text("business_name").notNull(),
    businessAddress: text("business_address"),
    claimantName: text("claimant_name").notNull(),
    claimantRole: text("claimant_role").notNull(),
    claimantEmail: text("claimant_email").notNull(),
    claimantPhone: text("claimant_phone"),
    message: text("message"),
    status: claimStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewerNote: text("reviewer_note"),
  },
  (t) => ({
    placeIdx: index("claims_place_idx").on(t.placeId),
    emailIdx: index("claims_email_idx").on(t.claimantEmail),
    statusIdx: index("claims_status_idx").on(t.status),
  })
);

// Once a claim is approved, the claimant can edit this row to overlay
// their own data on top of the Google Places baseline. Keyed by placeId
// because a listing has at most one owner at a time.
export const providerOverrides = pgTable(
  "provider_overrides",
  {
    placeId: text("place_id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    description: text("description"),
    servicesOffered: text("services_offered"),
    pricingNotes: text("pricing_notes"),
    customPhotos: jsonb("custom_photos").$type<string[]>(),
    customHours: jsonb("custom_hours").$type<string[]>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    ownerIdx: index("overrides_owner_idx").on(t.ownerEmail),
  })
);

export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;
export type ProviderOverride = typeof providerOverrides.$inferSelect;
export type NewProviderOverride = typeof providerOverrides.$inferInsert;

// Reviews left directly on HERD by customers, displayed alongside the
// Google reviews on the provider detail page.  Every review must be
// (a) email-verified by the reviewer and (b) approved by an admin
// before it appears publicly — keeps HERD's defence under UK
// Defamation Act 2013 s.5 intact (notice-and-takedown process) and
// the review feed trustworthy.
export const reviewStatusEnum = pgEnum("review_status", [
  "pending", // submitted, awaiting email verification
  "verified", // email verified, awaiting admin moderation
  "approved", // visible on the listing
  "rejected", // hidden — not shown to anyone
]);

export const herdReviews = pgTable(
  "herd_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    placeId: text("place_id").notNull(),
    businessName: text("business_name").notNull(),
    authorName: text("author_name").notNull(),
    authorEmail: text("author_email").notNull(),
    rating: text("rating").notNull(), // store as text to avoid drizzle integer issues; 1-5
    title: text("title"),
    body: text("body").notNull(),
    serviceUsed: text("service_used"), // optional: which service the reviewer used
    status: reviewStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewerNote: text("reviewer_note"),
    reportedCount: text("reported_count").default("0"),
  },
  (t) => ({
    placeIdx: index("herd_reviews_place_idx").on(t.placeId),
    emailIdx: index("herd_reviews_email_idx").on(t.authorEmail),
    statusIdx: index("herd_reviews_status_idx").on(t.status),
  })
);

export type HerdReview = typeof herdReviews.$inferSelect;
export type NewHerdReview = typeof herdReviews.$inferInsert;
