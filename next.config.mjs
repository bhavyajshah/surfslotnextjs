/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['surfslot.pt', 'lh3.googleusercontent.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
