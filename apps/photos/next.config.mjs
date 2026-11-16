import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wending/domain', '@wending/ui', '@wending/utils'],
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@wending/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
      '@wending/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@wending/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
    };
    return config;
  },
};

export default nextConfig;
