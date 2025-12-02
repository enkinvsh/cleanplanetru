/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,
    compress: true, // Enable gzip compression
    poweredByHeader: false, // Remove X-Powered-By header
    experimental: {
        serverActions: {
            allowedOrigins: ['clean.meybz.asia', 'localhost:3000']
        },
        optimizePackageImports: ['lucide-react'], // Tree-shake icons
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // Security headers
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    },
                ]
            },
            {
                // Cache static assets aggressively
                source: '/(.*)\\.(js|css|woff|woff2|ttf|otf|eot|ico|png|jpg|jpeg|webp|svg|gif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                // Cache Next.js static files
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    }
};

module.exports = nextConfig;

