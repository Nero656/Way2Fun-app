'use client'
import React, {useEffect, useState} from "react"
import {
    Panel,
    CardGroup,
    Pagination
} from 'rsuite'
import ActivityItem from '@/app/components/activity'
import {authorizationFetch, base_url, handleResize, image_url} from "@/app/config"
import {usePathname} from 'next/navigation'
import {activityList} from "@/app/components/activity/types"
import {store} from "@/redux/store";

export default function Activities() {
    const path = usePathname()
    const [activePage, setActivePage] = useState(1)
    const [isResolution, setResolution] = useState<number>(handleResize())
    const [activityResponse, setActivityResponse] = useState<activityList>({
        current_page: 1,
        data: [],
        first_page_url: "",
        last_page_url: "",
        last_page: 1,
        from: 0,
        links: [
            {
                url: '',
                label: '',
                active: false,
            }
        ],
        next_page_url: 0,
        path: "",
        per_page: 10,
        to: 0,
        total: 0,
    })

    const requestActivity = async (id: string[], page: number) => {
        try {
            const res = await fetch(`${base_url}activities/category/${id}?page=${page}`, {
                method: 'GET',
                headers: authorizationFetch(store.getState().user?.value.accessToken)
            })
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`)
            }
            const contentType = res.headers.get("content-type")
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()
                setActivityResponse(data)
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        const updateResolution = () => setResolution(handleResize())

        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])

    useEffect(() => {
        async function fetchData() {
            try {
                await Promise.all([
                    requestActivity(path.split('/').slice(-1), activePage)
                ])
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchData()
    }, [activePage])

    return (<>
        <Panel header="Активности">
            <CardGroup columns={isResolution} spacing={20}>
                {activityResponse.data.map((item, index) => (
                    <ActivityItem key={index} item={item} selected={null}/>
                ))}
            </CardGroup>
        </Panel>
        <Pagination
            style={{justifyContent: 'center'}}
            prev
            last
            next
            first
            size="md"
            ellipsis={true}
            boundaryLinks={true}
            total={activityResponse?.last_page}
            limit={1}
            maxButtons={5}
            activePage={activePage}
            onChangePage={setActivePage}
        />
    </>)
}