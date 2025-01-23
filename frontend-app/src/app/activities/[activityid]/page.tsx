'use client'
import {
    Button,
    ButtonToolbar,
    Panel,
    Placeholder,
    Card,
    CardGroup,
    Text,
    HStack,
    Avatar,
    VStack,
    AvatarGroup
} from "rsuite";
import {usePathname} from 'next/navigation'
import React, {useState, useEffect} from 'react'


type activityType = {
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

const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).replace(',', '')
}

export default function index() {
    const id = usePathname()
    const [isMobile, setIsMobile] = useState(false)
    const [activity, setActivity] = useState<activityType>()


    const requestActivity = async (id: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/activities/activity/${id.split('/').slice(-1)}`, {
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
    }

    type Color = 'violet' | 'blue' | 'green' | 'red' | 'orange' | 'yellow'

    const getRandomColor = (): Color => {
        const colors: Color[] = ['violet', 'blue', 'green', 'red', 'orange', 'yellow']
        return colors[Math.floor(Math.random() * colors.length)]
    };

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
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
            <Panel
                header={activity?.activity.name}
                shaded
                style={{marginTop: 10}}
            >
                <div style={
                    isMobile ? {display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 25}
                        : {display: 'flex', flexDirection: 'row', gap: 25, justifyContent: 'start', alignItems: 'start'}
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
                                <Text>Забронированно: {activity?.count_activities_booking}</Text>
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

            <Panel
                header={'Коментарии'}
                shaded
                style={{marginTop: 10}}
            >
                <>
                    <CardGroup columns={isMobile ? 1 : 2} spacing={20}>
                        {activity?.activity.review.map((item, index) => (
                            <Card key={index}>
                                <Card.Header>
                                    <HStack>
                                        <AvatarGroup spacing={6}>
                                            <Avatar color={getRandomColor()} circle alt={item.user.name.charAt(0)}></Avatar>
                                        </AvatarGroup>
                                        <VStack spacing={2}>
                                            {<Text>{item.user.name}</Text>}
                                            <Text muted size="sm">
                                                {item.user.email}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Header>
                                <Card.Body>{item.comment}</Card.Body>
                                <Card.Footer>
                                    <Text muted>{formatDate(item.created_at)}</Text>
                                </Card.Footer>
                            </Card>
                        ))}
                    </CardGroup>
                </>
            </Panel>
        </div>
    )
}