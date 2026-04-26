"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sql = neon(process.env.DATABASE_URL!);

// ── Types ─────────────────────────────────────────────────────────────────────
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

// ── Session Management ────────────────────────────────────────────────────────
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `;

  return token;
}

async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
}

// ── Get Current User ──────────────────────────────────────────────────────────
export async function getCurrentUser(): Promise<(User & { profile: Profile | null }) | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  const sessions = await sql`
    SELECT user_id, expires_at FROM sessions WHERE token = ${token}
  `;

  if (sessions.length === 0) return null;

  const session = sessions[0];
  if (new Date(session.expires_at) < new Date()) {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    return null;
  }

  const users = await sql`
    SELECT id, email, created_at FROM users WHERE id = ${session.user_id}
  `;

  if (users.length === 0) return null;

  const profiles = await sql`
    SELECT id, user_id, display_name, avatar_url, bio FROM profiles WHERE user_id = ${session.user_id}
  `;

  return {
    ...users[0],
    profile: profiles[0] || null,
  } as User & { profile: Profile | null };
}

// ── Sign Up ───────────────────────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return { success: false, error: "Email already registered" };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const users = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${passwordHash})
      RETURNING id
    `;

    const userId = users[0].id;

    // Create profile
    await sql`
      INSERT INTO profiles (user_id, display_name)
      VALUES (${userId}, ${displayName || null})
    `;

    // Create session
    const token = await createSession(userId);
    await setSessionCookie(token);

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

// ── Sign In ───────────────────────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const users = await sql`
      SELECT id, password_hash FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create session
    const token = await createSession(user.id);
    await setSessionCookie(token);

    return { success: true };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Failed to sign in" };
  }
}

// ── Sign Out ──────────────────────────────────────────────────────────────────
export async function signOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
  }

  cookieStore.delete("session_token");
  redirect("/");
}

// ── Update Profile ────────────────────────────────────────────────────────────
export async function updateProfile(
  userId: string,
  data: { display_name?: string; bio?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE profiles
      SET 
        display_name = COALESCE(${data.display_name ?? null}, display_name),
        bio = COALESCE(${data.bio ?? null}, bio),
        updated_at = NOW()
      WHERE user_id = ${userId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

// ── Require Auth (for Server Components) ──────────────────────────────────────
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}
