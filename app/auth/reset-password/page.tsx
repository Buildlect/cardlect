"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordsMatch) {
      return
    }
    console.log("[v0] Password reset completed")
    // Add password reset logic here
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-balance">Password Reset Successful</h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <Link href="/login">
              <Button className="w-full" size="lg">
                Continue to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image src="/cardlet-logo.png" alt="Cardlet Logo" width={64} height={64} className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold text-balance">Reset Your Password</h1>
          <p className="text-muted-foreground mt-2 leading-relaxed">Create a strong password to secure your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password.length > 0 && (
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs font-medium text-foreground mb-2">Password must contain:</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    {hasMinLength ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className={hasMinLength ? "text-foreground" : "text-muted-foreground"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {hasUpperCase ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className={hasUpperCase ? "text-foreground" : "text-muted-foreground"}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {hasLowerCase ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className={hasLowerCase ? "text-foreground" : "text-muted-foreground"}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {hasNumber ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className={hasNumber ? "text-foreground" : "text-muted-foreground"}>One number</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {hasSpecialChar ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className={hasSpecialChar ? "text-foreground" : "text-muted-foreground"}>
                      One special character
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                !hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !passwordsMatch
              }
            >
              Reset Password
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
