// Drizzle client wrapped around @vercel/postgres. Uses the DATABASE_URL
// env var automatically when running on Vercel (it's set by the Vercel
// Postgres / Neon integration). Locally, drop the same URL into
// .env.local — Drizzle Kit's CLI tools will pick it up too.

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });
