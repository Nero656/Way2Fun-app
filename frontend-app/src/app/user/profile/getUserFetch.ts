import {base_url} from "@/app/config";
import {store} from "@/redux/store";

export type User = {
    name : string,
    email: string,
    telephone: string,
    email_verified_at: string,
    role_id: number,
    created_at: string,
    updated_at: string,
}

export const requestGetCurrentUser = async () => {
    try {
        const res = await fetch(`${base_url}users/auth/current_user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${store.getState().user?.value.accessToken}`
            }
        })

        const contentType = res.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            const data : User = await res.json()
            if (res.status !== 200) {
                // toaster.push(message(data?.error), {placement: 'topStart', duration: 5000})
            }
            if (res.status === 200) {
                return data
            }
        } else {
            throw new Error("Received non-JSON response")
        }
    } catch (e) {
        console.error(e)
    }
}