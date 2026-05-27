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
