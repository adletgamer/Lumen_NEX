"use client"

import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#020617" }}>
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(48px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold" style={{ color: "#e8eaf6" }}>
              Create Account
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Sign up to get started
            </p>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8eaf6",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8eaf6",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8eaf6",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8eaf6",
                }}
              />
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                color: "#fff",
              }}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#6b7280" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4" style={{ color: "#818cf8" }}>
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
