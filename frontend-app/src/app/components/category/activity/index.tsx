'use client'
import {CardGroup, Card, VStack, TagGroup, Placeholder, Tag, Image} from 'rsuite'
import React, {useEffect, useState} from "react"
import {useRouter} from 'next/navigation'
import {base_url, image_url, mouseEvent} from "@/app/config"
import {activityItem} from "@/app/components/activity/types"
import {css} from "@emotion/css"

interface activityInterface {
    activity: activityItem[]
}

const image = css`
    width: 200px;
    height: 200px;
    aspect-ratio: 16/9;
    object-fit: cover;
`

const imageMobile = css`
    width: 500px;
    aspect-ratio: 16/9;
    object-fit: cover;
`

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
                {activity.slice(0, 4).map((item: activityItem, index: number) => (
                    <Card
                        className={'activity_items'}
                        direction={isMobile ? 'column' : "row"}
                        key={index}
                        onMouseDown={(event) => {
                            mouseEvent(event, router, `/activities/activity/${item?.id}`)
                        }}
                    >
                        {!item.images[0]?.img_url ? (
                            <Placeholder.Graph style={isMobile ? {} : { width: 200 }}  active/>
                        ) : (
                            <Image
                                src={`${image_url}${item.images[0].img_url}`}
                                alt="category_image"
                                className={isMobile ? imageMobile :  image}
                            />
                        )}

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
