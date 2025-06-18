/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['reactflow', '@reactflow/core', '@reactflow/controls', '@reactflow/background', '@reactflow/minimap'],
  output: 'export',
  distDir: 'docs'
}

module.exports = nextConfig 