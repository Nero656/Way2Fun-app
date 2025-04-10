import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    env: {
        APP_PUSHER_ID: '***',
        APP_PUSHER_KEY: '***',
        APP_PUSHER_SECRET: '***',
        APP_PUSHER_PORT: process.env.APP_PUSHER_HOST || '443',
        APP_PUSHER_SCHEME: 'https',
        APP_PUSHER_CLUSTER: 'eu',
    },
}

export default nextConfig
