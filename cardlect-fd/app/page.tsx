"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MessageSquare, Eye, EyeOff, Mail, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MOCK_USERS } from "@/contexts/mock-users"  // Import the MOCK_USERS from context
import { setAuthUser, getAuthUser } from "@/contexts/auth-context"
import type { UserRole } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const [loading, setLoading] = useState(false)
  const [credentialError, setCredentialError] = useState("") // Invalid credentials error
  const [termsError, setTermsError] = useState("") // Terms acceptance error
  const [touched, setTouched] = useState({ email: false, password: false })

  // Check if already authenticated and redirect
  useEffect(() => {
    const user = getAuthUser()
    if (user) {
      // Redirect to their dashboard
      const dashboardRoutes: Record<UserRole, string> = {
        'super-user': '/super-user',
        'admin': '/admin',
        'finance': '/finance',
        'security': '/security',
        'teacher': '/teacher',
        'parents': '/parent',
        'students': '/student',
        'clinic': '/clinic',
        'store': '/store',
        'approved-stores': '/approved-stores',
        'exam-officer': '/exam-officer',
        'librarian': '/librarian',
        'visitor': '/',
      }
      router.push(dashboardRoutes[user.role] || '/admin')
    }
  }, [])

  const textOptions = [
    "You can Now manage and monitor what goes in and out of your school with Cardlet!",
    "Seamlessly manage student identities, authorize parent pickups, and enable cashless transactions — all in one secure platform.",
    "Your Cardlect Login Details is your Identity, Do not share it with anyone, Cardlect support will never ask for your OTP",
    "If you are unable to login, please contact your school Administrator for prompt assistance",
    "Students now go fully cashless — just with the Cardlect smart card ID system",
  ]

  // Rotate informational texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textOptions.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Force light mode only
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.classList.remove("dark")
    body.classList.remove("dark")

    // Prefer light color-scheme for form controls / browser UI
    html.style.colorScheme = "light"

    let meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "color-scheme"
      document.head.appendChild(meta)
    }
    meta.content = "light"
  }, [])

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const isFormValid = () => {
    return isValidEmail(email) && password.trim().length > 0 && rememberMe
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setCredentialError("")
    setTermsError("")

    setTouched({ email: true, password: true })

    // Validate terms acceptance
    if (!rememberMe) {
      setTermsError("You must accept the Terms of Service to continue.")
      return
    }

    // Validate inputs
    if (!isValidEmail(email) || password.trim().length === 0) {
      setCredentialError("Please provide a valid email and password.")
      return
    }

    setLoading(true)

    setTimeout(() => {
      const matched = MOCK_USERS.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      )

      if (!matched) {
        setCredentialError(
          "Invalid credentials. Please check your email and password."
        )
        setLoading(false)
        return
      }
      
      // Log in the user directly
      setAuthUser({
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
      })
      
      // Redirect to their dashboard
      const dashboardRoutes: Record<UserRole, string> = {
        'super-user': '/super-user',
        'admin': '/admin',
        'finance': '/finance',
        'security': '/security',
        'teacher': '/teacher',
        'parents': '/parent',
        'students': '/student',
        'clinic': '/clinic',
        'store': '/store',
        'approved-stores': '/approved-stores',
        'exam-officer': '/exam-officer',
        'librarian': '/librarian',
        'visitor': '/',
      }
      router.push(dashboardRoutes[matched.role] || '/admin')
    }, 700)
  }

  return (
    <div>
      {/* header */}
      
      <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
        {/* Left Side - Purple Gradient (hidden on small, decorative on desktop) */}
        <div className="hidden md:block md:w-2/5 md:max-h-screen rounded-half background-bg p-12 md:p-20 flex flex-col md:justify-center text-white">
          <div className="max-w-md">
            <div className="flex mt-40 items-center gap-3 mb-3">
              {/* optional logo */}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hey, Hello!</h1>

            <p className="leading-relaxed text-lg">{textOptions[currentTextIndex]}</p>
          </div>

          {/* login footer */}
          <div className="absolute bottom-0 flex">
            <small className="pb-5">
              Read our{" "}
              <span className="text-orange-400 underline ">
                <Link href="/terms"> Terms of Service</Link>
              </span>
            </small>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full flex items-center justify-center p-4 md:p-8 md:w-3/5">
          <div
            className="
                w-full
                min-h-screen
                flex
                items-center
                justify-center
                p-6
                md:min-h-0
                md:max-w-2xl
                md:rounded-3xl
                md:shadow-xl
                md:bg-white/90
                md:backdrop-blur-sm
                md:border
                md:border-gray-100
                md:p-10
            "
          >
            <div className="w-full">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">
                Let's Log You in
              </h2>
              <p className="text-gray-500 text-center mb-6 md:text-left">
                Enter your Login credentals to access your dashboard.
              </p>

              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setCredentialError("")
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className={`w-full h-12 px-4 bg-gray-50 rounded-xl focus:ring-2 focus:border-transparent ${
                      credentialError && touched.email
                        ? "border-red-500 ring-red-200"
                        : "border-gray-200"
                    }`}
                    style={{
                      ...(credentialError && touched.email ? { outlineColor: CARDLECT_COLORS.danger.main } : { outlineColor: CARDLECT_COLORS.primary.darker }),
                      outlineOffset: '2px'
                    }}
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setCredentialError("")
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`w-full h-12 px-4 pr-12 bg-gray-50 rounded-xl focus:ring-2 focus:border-transparent ${
                      credentialError && touched.password
                        ? "border-red-500 ring-red-200"
                        : "border-gray-200"
                    }`}
                    style={{
                      ...(credentialError && touched.password ? { outlineColor: CARDLECT_COLORS.danger.main } : { outlineColor: CARDLECT_COLORS.primary.darker }),
                      outlineOffset: '2px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {credentialError && (
                  <div style={{ color: CARDLECT_COLORS.danger.main }} className="text-sm mt-1">
                    {credentialError}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => {
                        setTerms(e.target.checked)
                        if (e.target.checked) setTermsError("")
                      }}
                      className={`w-4 h-4 rounded border-gray-300 focus:ring-2 cursor-pointer ${
                        termsError ? "ring-2 ring-red-200 border-red-500" : ""
                      }`}
                      style={{
                        accentColor: CARDLECT_COLORS.primary.darker,
                        ...(termsError ? { borderColor: CARDLECT_COLORS.danger.main } : {})
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      Accept our Terms of Service
                    </span>
                  </label>
                  <Link
                    href="/auth/recovery"
                    className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {termsError && (
                  <div style={{ color: CARDLECT_COLORS.danger.main }} className="text-sm mt-1">
                    {termsError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={
                    !isValidEmail(email) ||
                    password.trim().length === 0 ||
                    !rememberMe ||
                    loading
                  }
                  className="w-full h-12 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ 
                    backgroundColor: isValidEmail(email) && password.trim().length > 0 && rememberMe && !loading ? CARDLECT_COLORS.primary.darker : '#FFB8A6',
                  }}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent md:bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl bg-transparent"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl bg-transparent"
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebook
                </Button>
              </div>

              <p className="text-sm font-medium transition-colors text-center mt-4"
                  style={{ color: '#6B7280' }}
              >
                Don't have an account?{" "}
                <Link
                  href="#"
                  className="hover:underline font-medium"
                  style={{ color: CARDLECT_COLORS.primary.darker }}
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
