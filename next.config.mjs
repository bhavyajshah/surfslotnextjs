/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['surfslot.pt'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
