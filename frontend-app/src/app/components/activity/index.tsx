import {Card, Divider, HStack, Placeholder, Tag, TagGroup, Text, VStack} from "rsuite";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";

type activityItem = {
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
}

interface ActivityItem {
    item: activityItem
}

export default function index({item}: ActivityItem) {
    const router = useRouter()

    return <Card
        shaded={'hover'}
        onClick={() => router.push(`/activities/activity/${item?.id}`)}
    >
        <Placeholder.Graph/>
        <VStack spacing={2}>
            <Card.Header>
                <HStack>
                    <VStack spacing={2}>
                        <Text>{item?.name}</Text>
                        <Text muted size="sm">
                            {item.city?.name}, {item.city.country}
                        </Text>
                    </VStack>
                </HStack>
            </Card.Header>
            <Card.Body style={{width: '100%'}}>
                <Text><strong>Цена:</strong> {item?.price}</Text>
                <Text><strong>Время:</strong> {item?.duration} часов</Text>
                <Text><strong>Количество мест:</strong> {item?.capacity} чел.</Text>
                {item?.activity_date.length > 0 ?
                    <>
                        <Divider>Даты проведения</Divider>
                        <TagGroup style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                            {item?.activity_date.slice(0, 5).map((event, index) => (
                                <Tag
                                    color={'blue'}
                                    size="sm"
                                    key={index}
                                >
                                    {event.event_date}
                                </Tag>
                            ))}
                        </TagGroup>
                    </> : <>
                        <Divider>Даты проведения не назначены</Divider>
                        <TagGroup style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                                <Tag
                                    color={'red'}
                                    size="md"
                                >
                                    Дата отсутствует
                                </Tag>
                        </TagGroup>
                    </>
                }
                <Divider>Описание</Divider>
                <Text>{item?.short_description}</Text>
            </Card.Body>

            <Divider>Теги</Divider>
            <Card.Footer>
                <TagGroup>
                    <Tag size="md" color={'blue'}>Климат: {item.city?.climate}</Tag>
                    <Tag size="md" color={'blue'}>Гид: {item.guide?.name}</Tag>
                </TagGroup>
            </Card.Footer>
        </VStack>
    </Card>
}