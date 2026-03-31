import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Temporarily disabled — babel plugin crashes with spaces in project path
  output: 'standalone',
};

export default nextConfig;
