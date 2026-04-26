"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
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
            style={{ background: "rgba(99,102,241,0.15)" }}
          >
            <Mail className="w-6 h-6" style={{ color: "#6366f1" }} />
          </div>
          
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "#e8eaf6" }}>
            Check your email
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            We sent you a confirmation link. Click it to verify your account.
          </p>

          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e8eaf6",
            }}
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
