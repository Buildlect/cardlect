"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARDLECT_COLORS } from "@/lib/cardlect-colors";

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Simulate logout process
    const logoutTimer = setTimeout(() => {
      console.log("User logged out successfully");
      setIsLoggingOut(false);
      // logout logic here (clear tokens, cookies, etc.)
    }, 1500);

    return () => clearTimeout(logoutTimer);
  }, []);

  useEffect(() => {
    // Countdown for auto-redirect
    if (!isLoggingOut && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      window.location.href = "/";
    }
  }, [isLoggingOut, countdown]);

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          {/* Loading State */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 mb-6" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '15' }}>
              <LogOut className="w-8 h-8 animate-pulse" style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
            <h1 className="text-2xl font-bold text-balance mb-2">
              Signing Out...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we securely log you out
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Success State */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-in zoom-in duration-500" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '15' }}>
              <CheckCircle2 className="w-10 h-10" style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-balance">
            You've Been Signed Out
          </h1>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Your session has ended successfully. Thank you for choosing Cardlect!
          </p>
        </div>

        {/* Action Card */}
        <div className="bg-card border mb-10 border-border rounded-lg p-6 shadow-lg space-y-4">
          <Link href="/">
            <Button className="w-full" size="lg" style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}>
              Sign In Again
            </Button>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full mt-4"
              style={{ borderColor: CARDLECT_COLORS.primary.darker, color: CARDLECT_COLORS.primary.darker }}
            >
              Go to Homepage
            </Button>
          </Link>

          {/* Auto-redirect Notice */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Redirecting to sign in in{" "}
              <span className="font-medium text-foreground" style={{ color: CARDLECT_COLORS.primary.darker }}>{countdown}s</span>
            </p>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Security Tips
          </h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span style={{ color: CARDLECT_COLORS.primary.darker }} className="mt-0.5">•</span>
              <span>Always sign out when using shared or public computers</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: CARDLECT_COLORS.primary.darker }} className="mt-0.5">•</span>
              <span>Never share your password with anyone</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: CARDLECT_COLORS.primary.darker }} className="mt-0.5">•</span>
              <span>Enable two-factor authentication for extra security</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{" "}
          <Link href="/support" style={{ color: CARDLECT_COLORS.primary.darker }} className="hover:opacity-80 transition-opacity font-medium">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
