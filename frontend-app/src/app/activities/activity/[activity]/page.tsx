'use client'
import {Loader, Panel,} from "rsuite";
import {usePathname} from 'next/navigation'
import React, {useState, useEffect} from 'react'
import Info from '@/app/components/activity_Info/index'
import Comments from '@/app/components/comments'
import {base_url, handleResizeMin} from '@/app/config'
import {activityType} from '@/app/components/activity/types'
import {echo} from "@/app/echo";

export default function page() {
    const id = usePathname()
    const [isMobile, setIsMobile] = useState<boolean>(handleResizeMin(800))
    const [activity, setActivity] = useState<activityType>()
    const [reviews, setReviews] = useState<any>(null)
    const [activePage, setActivePage] = useState(1)


    const requestActivity = async () => {
        try {
            const res = await fetch(`${base_url}activities/activity/${id.split('/')
                .slice(-1)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const contentType = res.headers.get("content-type")
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()
                setActivity(data)
            } else {
                throw new Error("Received non-JSON response")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const requestReviews = async (page: number) => {
        try {
            const res = await fetch(`${base_url}activities/activity/${id.split('/')
                .slice(-1)}/?page=${page}`)
            const data = await res.json()
            setReviews(data.reviews)
        } catch (e) {
            console.error(e)
        }
    }

    const connectCommentsChannel =  () => {
        echo.channel(`activity.comment.${id.split('/').slice(-1)}`)
            .listen(".comments.event", (newMessage: activityType) => {
                setActivity(newMessage)
                setReviews(newMessage.reviews)
            }).error((error: any) => {
            console.log("Error connecting to channel:", error);
        });
    }

    useEffect(() => {
        connectCommentsChannel()
        return () => {
            echo.channel(`activity.comment.${id.split('/').slice(-1)}`).stopListening(".comments.event")
            echo.leave(`activity.comment.${id.split('/').slice(-1)}`)
        }
    }, [activity?.activity.id])


    useEffect(() => {
        requestReviews(activePage)
    }, [activePage])

    useEffect(() => {
        requestActivity()
    }, [])

    useEffect(() => {
        const updateResolution = () => setIsMobile(handleResizeMin(800))
        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])


    return (
        <div style={isMobile ? {
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
        } : {
            padding: 60,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
        }}>
            {activity && reviews ? <>
                    <Panel header={activity?.activity.name}>
                        <Info isMobile={isMobile} activity={activity}/>
                    </Panel>

                    <Comments
                        id={parseInt(id.split('/').slice(-1)[0], 10)}
                        reviews={reviews}
                        refreshReviews={(page) => requestReviews(page || 1)}
                    />
                </> :
                <Loader content="Загрузка..."/>
            }
        </div>
    )
}