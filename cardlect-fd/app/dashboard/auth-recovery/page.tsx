"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

type RecoveryStep = "email" | "verify" | "reset" | "success"

interface PasswordStrength {
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export default function AccountRecoveryPage() {
  const [step, setStep] = useState<RecoveryStep>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const checkPasswordStrength = (password: string): PasswordStrength => {
    return {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    }
  }

  const passwordStrength = checkPasswordStrength(newPassword)
  const isPasswordValid =
    passwordStrength.hasMinLength &&
    passwordStrength.hasUppercase &&
    passwordStrength.hasLowercase &&
    passwordStrength.hasNumber &&
    passwordStrength.hasSpecial

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email) {
      setError("Please enter your email address")
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setMessage(`Recovery code sent to ${email}. Check your inbox.`)
      setStep("verify")
      setLoading(false)
    }, 1500)
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!code) {
      setError("Please enter the verification code")
      setLoading(false)
      return
    }

    if (code.length < 6) {
      setError("Verification code must be at least 6 characters")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (code === "123456") {
        setMessage("Code verified successfully")
        setStep("reset")
      } else {
        setError("Invalid verification code. Please try again.")
      }
      setLoading(false)
    }, 1500)
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError("Password does not meet all requirements")
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setMessage("Password reset successfully")
      setStep("success")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-8 sm:p-12 space-y-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Account Recovery</h1>
            <p className="text-sm text-muted-foreground">
              {step === "email" && "Enter your email to receive a recovery code"}
              {step === "verify" && "Enter the code sent to your email"}
              {step === "reset" && "Create a new password"}
              {step === "success" && "Your password has been reset"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            <div
              className={`flex-1 h-2 rounded-full ${step === "email" || step === "verify" || step === "reset" || step === "success" ? "bg-primary" : "bg-muted"}`}
            />
            <div
              className={`flex-1 h-2 rounded-full ${step === "verify" || step === "reset" || step === "success" ? "bg-primary" : "bg-muted"}`}
            />
            <div
              className={`flex-1 h-2 rounded-full ${step === "reset" || step === "success" ? "bg-primary" : "bg-muted"}`}
            />
            <div className={`flex-1 h-2 rounded-full ${step === "success" ? "bg-primary" : "bg-muted"}`} />
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {message && (
            <div className="flex gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary">{message}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@school.com"
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Recovery Code"}
              </button>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === "verify" && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest"
                />
                <p className="text-xs text-muted-foreground">Demo code: 123456</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email")
                  setCode("")
                  setError("")
                  setMessage("")
                }}
                className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
              >
                Back
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`flex items-center gap-2 ${passwordStrength.hasMinLength ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${passwordStrength.hasMinLength ? "bg-primary" : "bg-muted"}`}
                    />
                    8+ characters
                  </div>
                  <div
                    className={`flex items-center gap-2 ${passwordStrength.hasUppercase ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${passwordStrength.hasUppercase ? "bg-primary" : "bg-muted"}`}
                    />
                    Uppercase (A-Z)
                  </div>
                  <div
                    className={`flex items-center gap-2 ${passwordStrength.hasLowercase ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${passwordStrength.hasLowercase ? "bg-primary" : "bg-muted"}`}
                    />
                    Lowercase (a-z)
                  </div>
                  <div
                    className={`flex items-center gap-2 ${passwordStrength.hasNumber ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? "bg-primary" : "bg-muted"}`} />
                    Number (0-9)
                  </div>
                  <div
                    className={`flex items-center gap-2 ${passwordStrength.hasSpecial ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${passwordStrength.hasSpecial ? "bg-primary" : "bg-muted"}`}
                    />
                    Special (!@#$%)
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-10 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid || newPassword !== confirmPassword}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("verify")
                  setNewPassword("")
                  setConfirmPassword("")
                  setError("")
                  setMessage("")
                }}
                className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
              >
                Back
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Password Reset Successful</h2>
                <p className="text-sm text-muted-foreground">
                  Your password has been reset. You can now log in with your new password.
                </p>
              </div>

              <Link
                href="/"
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block"
              >
                Back to Login
              </Link>
            </div>
          )}

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
