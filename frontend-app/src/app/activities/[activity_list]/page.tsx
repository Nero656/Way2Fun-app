'use client'
import React, {useEffect, useState} from "react"
import {
    Panel,
    CardGroup,
    Pagination
} from 'rsuite'
import ActivityItem from '@/app/components/activity'
import {store} from "@/redux/store"
import {usePathname} from 'next/navigation'

type activityList = {
    current_page: number,
    data: {
        id: number,
        name: string,
        description: string,
        short_description: string,
        price: string,
        duration: number,
        capacity: number,
        city: {
            name: string,
            country: string,
            climate: string,
        },
        activity_date: {
            id: number,
            activity_id: number,
            event_date: string,
        }[],
        guide: {
            name: string,
            telephone: string,
        }
        images: {
            img_url: string,
        }
    }[],
    first_page_url: string,
    last_page_url: string,
    last_page: number,
    from: number,
    links: [
        {
            url: string,
            label: string,
            active: boolean,
        }
    ],
    next_page_url: number,
    path: string,
    per_page: number,
    to: number,
    total: number
}

enum resolution {
    desktop = 4,
    tablet = 2,
    mobile = 1,
    fourK = 8
}

export default function Activities() {
    const path = usePathname()
    const [activePage, setActivePage] = useState(1)
    const [isResolution, setResolution] = useState<number>()

    const handleResize = () => {
        const width = window.innerWidth;
        const newResolution =
            width <= 720 ? resolution.mobile :
                width <= 1100 ? resolution.tablet :
                    width <= 2000 ? resolution.desktop :
                        resolution.fourK

        setResolution(newResolution)
    }

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
        total: 0
    })


    const requestActivity = async (id: string[], page: number) => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}activities/${id}?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
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
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
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
                    <ActivityItem key={index} item={item}/>
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