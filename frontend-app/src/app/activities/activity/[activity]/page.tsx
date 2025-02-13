'use client'
import {
    Button,
    ButtonToolbar, Loader,
    Panel,
    Placeholder,
    Text,
} from "rsuite";
import {usePathname} from 'next/navigation'
import React, {useState, useEffect} from 'react'
import Comments from '@/app/components/comments'
import {store} from "@/redux/store";


import Pusher from 'pusher-js'

interface activityType {
    activity: {
        id: number,
        name: string,
        description: string,
        price: string,
        short_description: string,
        duration: number,
        capacity: number,
        city: {
            name: string,
            country: string,
            climate: string,
        },
        guide: {
            name: string,
            email: string,
            telephone: string,
        }
        review: [
            {
                rating: number,
                user_id: number,
                activity_id: number,
                comment: string,
                created_at: string,
                user: {
                    name: string,
                    email: string,
                    telephone: string,
                }
            }
        ]
    }
    average_rating: number,
    count_review: number,
    count_activities_booking: number,
}


export default function index() {
    const id = usePathname()
    const [isMobile, setIsMobile] = useState(false)
    const [activity, setActivity] = useState<activityType>()


    const requestActivity = async (id: string) => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}activities/activity/${id.split('/')
                .slice(-1)}`, {
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
                setActivity(data)
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }

        // Pusher.logToConsole = true
        // let pusher = new Pusher('e7e23394c6d9fa297d2c', {
        //     cluster: 'eu'
        // })
        //
        // let channel = pusher.subscribe('notification')
        //
        // channel.bind('my-event', function(mes: any) : void {
        //     console.log(JSON.stringify(mes))
        // });
    }


    useEffect(() => {
        setIsMobile(window.innerWidth <= 768)
        requestActivity(id)
    }, []);

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
            {activity ? <>
                <Panel
                    header={activity?.activity.name}
                    shaded
                    style={{marginTop: 10}}
                >
                    <div style={
                        isMobile ? {display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 25}
                            : {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 25,
                                justifyContent: 'start',
                                alignItems: 'start'
                            }
                    }>
                        <Placeholder.Graph active={true} style={isMobile ? {width: '100%'} : {width: `200px`}}/>

                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                            <div style={isMobile ?
                                {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 10, justifyContent: 'space-between'
                                } : {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 25,
                                    justifyContent: 'space-between'
                                }}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <h5>Место</h5>
                                    <Text>Город: {activity?.activity.city.name}</Text>
                                    <Text>Страна: {activity?.activity.city.country}</Text>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <h5>Контакты</h5>
                                    <Text>Гид: {activity?.activity.guide.name}</Text>
                                    <Text>Телефон: {activity?.activity.guide.telephone}</Text>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <h5>Контакты</h5>
                                    <Text>Гид: {activity?.activity.guide.name}</Text>
                                    <Text>Телефон: {activity?.activity.guide.telephone}</Text>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <h5>Рейтинг: {Math.round(activity?.average_rating as number)}</h5>
                                    <Text>Оценили: {activity?.count_review}</Text>
                                    <Text>Забронировано: {activity?.count_activities_booking}</Text>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 20
                                }}>

                                <ButtonToolbar>
                                    <Button appearance={'primary'}>Купить {activity?.activity.price} ₽</Button>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginTop: 20}}>
                        <h5>Описание</h5>
                        <Text align="justify">{activity?.activity.description}</Text>
                    </div>
                </Panel>
                <Comments id={parseInt(id.split('/').slice(-1)[0], 10)} activity={activity}/>
            </> :
                <Loader content="Загрузка..." />
            }
        </div>
    )
}