/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Enable using CommonJS modules like nodes7
  serverExternalPackages: ['nodes7'],
  // Disable font optimization for Raspberry Pi compatibility
  optimizeFonts: false,
  // Disable SWC compiler for Raspberry Pi ARM compatibility
  swcMinify: false,
  // Use Babel instead of SWC
  compiler: {
    // Disable SWC compiler
    styledComponents: false,
    // Use Babel for transpilation
    hasReactRefresh: false
  }
};

export default nextConfig; 