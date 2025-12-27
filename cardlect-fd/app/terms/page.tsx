'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function TermsPage() {
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-4 md:px-8 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms and Conditions</h1>
          <p className="text-muted-foreground">Last updated: January 2026</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Welcome to Cardlect, an integrated school management system ("the Service"). These Terms and Conditions ("Terms") govern your use of our platform, website, and all related services.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              By accessing and using Cardlect, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our Service.
            </p>
          </section>

          {/* User Eligibility */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. User Eligibility</h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>You must be at least 18 years old to use Cardlect, or have parental consent.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Schools and institutions must have proper authorization to use our platform.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>You are responsible for maintaining the confidentiality of your login credentials.</span>
              </li>
            </ul>
          </section>

          {/* Service Description */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Service Description</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Cardlect provides comprehensive school management solutions including:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 mb-4">
              <li className="flex gap-2 text-foreground/80">
                <span className="text-primary">✓</span> Student attendance tracking
              </li>
              <li className="flex gap-2 text-foreground/80">
                <span className="text-primary">✓</span> Academic performance management
              </li>
              <li className="flex gap-2 text-foreground/80">
                <span className="text-primary">✓</span> Staff and student communication
              </li>
              <li className="flex gap-2 text-foreground/80">
                <span className="text-primary">✓</span> Digital card and wallet systems
              </li>
              <li className="flex gap-2 text-foreground/80">
                <span className="text-primary">✓</span> CBT examination management
              </li>
              <li className="flex gap-2 text-foreground/80">
                <span className="text-primary">✓</span> Financial reporting and analytics
              </li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Responsibilities</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">You agree to:</p>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Use the Service only for legitimate educational purposes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Not share your account credentials with unauthorized persons</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Comply with all applicable laws and regulations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Not attempt to gain unauthorized access to our systems</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Maintain accurate and up-to-date information in your profile</span>
              </li>
            </ul>
          </section>

          {/* Data Privacy */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Privacy and Security</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Cardlect is committed to protecting user data in accordance with applicable privacy laws. We implement industry-standard security measures to safeguard personal information.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              For detailed information about how we collect, use, and protect your data, please refer to our Privacy Policy.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To the fullest extent permitted by law, Cardlect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Our total liability is limited to the amount paid by you in the last 12 months or $100, whichever is greater.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Intellectual Property Rights</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              All content, features, and functionality of Cardlect, including but not limited to text, graphics, logos, and code, are the exclusive property of Cardlect or its licensors.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              You may not reproduce, distribute, or transmit any content without our prior written permission.
            </p>
          </section>

          {/* Termination */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Termination</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your access to Cardlect at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              We may modify these Terms at any time. Your continued use of Cardlect after any modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="space-y-2 text-foreground/80">
              <p>Email: support@cardlect.io</p>
              <p>Website: www.cardlect.io</p>
            </div>
          </section>
        </div>

        {/* Agreement Checkbox */}
        <div className="mt-12 bg-card border border-border rounded-lg p-6 md:p-8">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agree"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border border-border cursor-pointer accent-primary"
            />
            <label htmlFor="agree" className="cursor-pointer flex-1">
              <p className="text-foreground font-medium">I have read and agree to the Terms and Conditions</p>
              <p className="text-sm text-muted-foreground mt-1">
                By checking this box, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </label>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors text-center"
            >
              Decline
            </Link>
            <button
              disabled={!agreeToTerms}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agree
            </button>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
