import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    env: {
        APP_PUSHER_ID: '1932707',
        APP_PUSHER_KEY: 'c9b592b0c9b8c027971b',
        APP_PUSHER_SECRET: '258b2428f0214bb102a1',
        APP_PUSHER_PORT: process.env.APP_PUSHER_HOST || '443',
        APP_PUSHER_SCHEME: 'https',
        APP_PUSHER_CLUSTER: 'eu',
    },
}

export default nextConfig
