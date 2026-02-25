"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Smartphone, CheckCircle, AlertCircle, RotateCcw } from "lucide-react"
import { getDashboardRoute } from "@/contexts/mock-users"

type TwoFAStep = "otp" | "success"

export default function TwoFAPage() {
  const [step, setStep] = useState<TwoFAStep>("otp")
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>("super_admin")
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Simulate getting user role from session - in production, get from auth context
    const storedRole = localStorage.getItem("userRole")
    
    // If there's no role or an invalid role, redirect to login page
    if (!storedRole || !["super_admin", "school_admin", "security_staff", "parent", "teacher", "librarian", "clinic_staff"].includes(storedRole)) {
      router.push("/")
      return
    }

    setUserRole(storedRole)

    // Simulate timer countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Auto-redirect when success state is reached after 2 seconds
  useEffect(() => {
    if (step === "success" && !isRedirecting) {
      const timer = setTimeout(() => {
        setIsRedirecting(true)
        const route = getDashboardRoute(userRole as any)
        router.push(route)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [step, isRedirecting, userRole, router])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otpDigits]
    newOtp[index] = value
    setOtpDigits(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const otp = otpDigits.join("")

    if (otp.length !== 6) {
      setError("Please enter all 6 digits")
      setLoading(false)
      return
    }

    setTimeout(() => {
      if (otp === "123456") {
        setMessage("OTP verified successfully")
        setStep("success")
      } else {
        setError("Invalid OTP. Please try again.")
      }
      setLoading(false)
    }, 1500)
  }

  const handleResendOtp = async () => {
    setError("")
    setMessage("New OTP sent to your phone number")
    setOtpDigits(["", "", "", "", "", ""])
    setTimeLeft(300)
    setResendCooldown(60)
    inputRefs.current[0]?.focus()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Two-Factor Authentication</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {step === "otp" && "Enter the 6-digit code from your email to continue."}
                {step === "success" && "Redirecting to your dashboard..."}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Alert Messages */}
          {error && (
            <div className="flex gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-xl animate-in">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {message && (
            <div className="flex gap-3 p-3 sm:p-4 bg-primary/10 border border-primary/30 rounded-xl animate-in">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary">{message}</p>
            </div>
          )}

          {/* Step 1: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-4">
                <label className="text-sm mb-6 font-semibold text-foreground">Enter Authentication Code</label>
                <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      placeholder="0"
                      className="w-full h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-orange-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">Demo code: 123456</p>
              </div>

              {/* Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-xl border border-border gap-2 sm:gap-0">
                <span className="text-sm font-medium text-muted-foreground">Code expires in</span>
                <span className={`text-lg font-mono font-bold ${timeLeft < 60 ? "text-destructive" : "text-primary"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otpDigits.join("").length !== 6}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              {/* Resend Button */}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="w-full py-3 px-4 bg-secondary/20 text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-border"
              >
                <RotateCcw className="w-4 h-4" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </form>
          )}

          {/* Step 2: Success - Auto-redirect */}
          {step === "success" && (
            <div className="space-y-6 text-center py-8 sm:py-12">
              <div className="flex justify-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">2FA Verified</h2>
                <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
              </div>

              {/* Loading indicator */}
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/auth/recovery" className="text-primary hover:underline font-semibold">
                Account Recovery
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
