import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable static generation to work around Turbopack workUnitAsyncStorage bug
  onDemandEntries: {
    maxInactiveAge: 15 * 1000, // 15 seconds
    pagesBufferLength: 5, // minimal pages kept in memory
  },
};

export default nextConfig;
