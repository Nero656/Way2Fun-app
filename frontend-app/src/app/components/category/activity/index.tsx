'use client'
import {CardGroup, Card, VStack, TagGroup, Placeholder, Tag, Image} from 'rsuite'
import React, {useEffect, useState} from "react"
import {useRouter} from 'next/navigation'

type activityType = {
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
    }
    guide: {
        name: string,
        telephone: string,
    }
    images: {
        img_url: string,
    }
}

interface activityInterface {
    activity: activityType[]
}

export default function Activities({activity}: activityInterface) {
    const [isMobile, setIsMobile] = useState(false)
    const router = useRouter()

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 900)
    }

    useEffect(() => {
        setIsMobile(window.innerWidth <= 900)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <VStack spacing={20} style={{marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CardGroup columns={isMobile ? 1 : 2} spacing={10} style={{padding: 10}}>
                {activity.slice(0, 4).map((item: activityType, index: number) => (
                    <Card
                        shaded={'hover'}
                        direction={isMobile ? 'column' : "row"}
                        key={index}
                        onClick={() => router.push(`/activities/activity/${item?.id}`)}
                    >
                        {item.images?.img_url === null || item.images?.img_url === undefined &&
                            <Placeholder.Graph style={isMobile ? {} : {width: 200}}/>
                        }

                        {item.images?.img_url != null || item.images?.img_url != undefined &&
                            <Image
                                src="https://images.unsplash.com/broken"
                                alt={`image name: ${item.name}`}
                                style={{objectFit: 'cover'}}
                                width={isMobile ? '100%' : 200}
                            />
                        }
                        <VStack spacing={2}>
                            <Card.Header as="h5">{item.name}</Card.Header>
                            <Card.Body>
                                {item.short_description}
                            </Card.Body>
                            <Card.Footer>
                                <TagGroup>
                                    <Tag size="md">Город: {item.city?.name}</Tag>
                                    <Tag size="md">Климат: {item.city?.climate}</Tag>
                                    <Tag size="md">Гид: {item.guide?.name}</Tag>
                                </TagGroup>
                            </Card.Footer>
                        </VStack>
                    </Card>
                ))}
            </CardGroup>
        </VStack>
    )
}
