import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Global Metadata (SEO + OG)
export const metadata: Metadata = {
  title: {
    default: "Cardlect – Smart School ID & Access Platform",
    template: "%s | Cardlect",
  },
  description:
    "Cardlect is a smart ID and access management platform for schools — enabling secure digital identification, attendance tracking, and student data management in one seamless system.",
  keywords: [
    "Cardlect",
    "Smart School ID",
    "Student Management System",
    "Digital ID",
    "School Technology",
    "Attendance Tracking",
    "School Platform",
  ],
  authors: [{ name: "Cardlect Team", url: "https://cardlect.com" }],
  creator: "Cardlect",
  publisher: "Cardlect",
  metadataBase: new URL("https://cardlect.com"),
  openGraph: {
    title: "Cardlect – Smart School ID & Access Platform",
    description:
      "Empowering schools with a digital smart ID system for students and staff. Simple, secure, and modern.",
    url: "https://cardlect.com",
    siteName: "Cardlect",
    images: [
      {
        url: "https://cardlect.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cardlect Smart School ID",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardlect – Smart School ID & Access Platform",
    description:
      "Smart ID and access management for schools. Secure, modern, and efficient.",
    images: ["https://cardlect.com/og-image.jpg"],
    creator: "@Cardlect",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "education technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// Root Layout
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
      >
        {children}
      </body>
    </html>
  );
}
