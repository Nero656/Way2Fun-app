import Echo from "laravel-echo"
import Pusher from "pusher-js"

declare global {
    interface Window {
        Pusher: typeof Pusher
    }
}

window.Pusher = Pusher

export const echo = new Echo({
    broadcaster: "pusher",
    key: process.env.APP_PUSHER_KEY,
    secret: process.env.APP_PUSHER_SECRET,
    forceTLS: process.env.PUSHER_CLUSTER === "true",
    disableStats: true,
    cluster: process.env.APP_PUSHER_CLUSTER,
    authEndpoint: "/api/broadcasting/auth"
});