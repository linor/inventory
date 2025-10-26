import type { NextConfig } from "next";
import pack from './package.json' assert { type: "json" };

const version = (pack as { version: string }).version;

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    env: {
        version,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    output: 'standalone',
};

export default nextConfig;
