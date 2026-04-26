"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Save, LogOut } from "lucide-react"

interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setProfile(data)
        setDisplayName(data.display_name || "")
        setBio(data.bio || "")
      } else {
        setProfile({ id: user.id, display_name: null, avatar_url: null, bio: null })
      }
      setIsLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleSave = async () => {
    if (!profile) return
    setIsSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: profile.id,
        display_name: displayName || null,
        bio: bio || null,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Profile updated" })
    }
    setIsSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020617" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#6366f1", borderTopColor: "transparent" }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "#020617" }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(48px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.15)" }}
              >
                <User className="w-8 h-8" style={{ color: "#6366f1" }} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold" style={{ color: "#e8eaf6" }}>
                  Profile Settings
                </h1>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  Customize your account
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="displayName" className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
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
                <label htmlFor="bio" className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e8eaf6",
                  }}
                />
              </div>

              {message && (
                <p
                  className="text-sm px-3 py-2 rounded-lg"
                  style={{
                    background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    color: message.type === "success" ? "#10b981" : "#ef4444",
                  }}
                >
                  {message.text}
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    color: "#fff",
                  }}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#ef4444",
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
