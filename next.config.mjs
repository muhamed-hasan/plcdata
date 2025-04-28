/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Use transpilePackages for nodes7 compatibility (correct syntax for Next.js 14)
  transpilePackages: ['nodes7'],
  // Disable font optimization for Raspberry Pi compatibility
  optimizeFonts: false,
  // Force Webpack to run in production mode to avoid SWC
  webpack: (config, { isServer, dev }) => {
    // Force Next.js to use Babel
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force Babel to handle JavaScript/TypeScript
    };
    return config;
  }
};

export default nextConfig; 