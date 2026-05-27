// Minimal auth: provider signs in with an email, we send a short-lived
// magic link via Resend, clicking it sets a long-lived session cookie.
//
// This is intentionally simpler than Lucia or Auth.js — there are no
// password hashes, no OAuth flows, no per-device sessions to revoke.
// Everything is signed by AUTH_SECRET; rotating the secret logs every
// provider out at once, which is exactly what we want for an MVP.

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "petsit_session";
const SESSION_DAYS = 30;
const MAGIC_LINK_MIN = 15;

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET must be set (32+ chars). Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return new TextEncoder().encode(s);
}

// --- Magic link tokens ---

export async function signMagicLinkToken(email: string): Promise<string> {
  return await new SignJWT({ email: email.toLowerCase() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_LINK_MIN}m`)
    .setSubject("magic-link")
    .sign(secret());
}

export async function verifyMagicLinkToken(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), {
      subject: "magic-link",
    });
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

// --- Session cookies ---

async function signSessionToken(email: string): Promise<string> {
  return await new SignJWT({ email: email.toLowerCase() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .setSubject("session")
    .sign(secret());
}

async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), {
      subject: "session",
    });
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export async function startSession(email: string): Promise<void> {
  const token = await signSessionToken(email);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  const c = jar.get(SESSION_COOKIE);
  if (!c?.value) return null;
  return await verifySessionToken(c.value);
}

// Request-based variant for use in API route handlers. Reads cookies
// directly off the NextRequest rather than relying on the async-local-
// storage cookies() helper, which has been flaky for us in nested
// dynamic API routes.
export async function getSessionEmailFromReq(
  req: NextRequest
): Promise<string | null> {
  const value = req.cookies.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return await verifySessionToken(value);
}

// --- Admin auth (single shared password) ---

const ADMIN_COOKIE = "petsit_admin";

export async function startAdminSession(): Promise<void> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setSubject("admin")
    .sign(secret());
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

async function verifyAdminToken(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  try {
    await jwtVerify(value, secret(), { subject: "admin" });
    return true;
  } catch (err) {
    console.warn(
      "[auth] admin token verify failed:",
      (err as Error)?.message ?? err
    );
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

// Request-based variant for API route handlers (see comment on
// getSessionEmailFromReq above).
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  return verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export async function endAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  // Length-safe equality
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
