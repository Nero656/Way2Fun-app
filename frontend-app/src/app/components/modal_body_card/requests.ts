import {base_url} from "@/app/config"
import {store} from "@/redux/store"

export const getRequest = async () => {
    try {
        const res = await fetch(`${base_url}cart?user_id=${store.getState().user?.value.user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!res.ok) {
            // throw new Error(`HTTP error! Status: ${res.status}`)
        }
        const contentType = res.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            const data = await res.json()
            // setActivity(data)
            if (data.products.length > 0) {
                // getProducts(data.products)
            }
        } else {
            // throw new Error("Received non-JSON response")
        }
    } catch (e) {
        console.error(e)
    }
}

export const postRequest = async () => {
    if (store.getState().user?.value.accessToken !== '') {
        try {
            const res = await fetch(`${base_url}cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_id': store.getState().user?.value.user.id,
                    'products': store.getState().cart.products,
                }),
            })
        } catch (e) {
            console.error(e)
        }
    }
}