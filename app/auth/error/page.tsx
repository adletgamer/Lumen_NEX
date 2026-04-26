"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#020617" }}>
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(48px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-6"
            style={{ background: "rgba(239,68,68,0.15)" }}
          >
            <AlertCircle className="w-6 h-6" style={{ color: "#ef4444" }} />
          </div>
          
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "#e8eaf6" }}>
            Authentication Error
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Something went wrong during authentication. Please try again.
          </p>

          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "#fff",
            }}
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
