import {Card, Divider, HStack, Image, Placeholder, Tag, TagGroup, Text, VStack} from "rsuite"
import {useRouter} from "next/navigation"
import {image_url, mouseEvent} from "@/app/config"
import {format} from "date-fns"
import {ru} from "date-fns/locale"
import {activityItem} from "@/app/components/activity/types"
import React from "react";
import {css} from "@emotion/css";

interface ActivityItem {
    item: activityItem
    selected: string | number | null
}

const image = css`
    width: 500px;
    height: 200px;
    aspect-ratio: 16/9;
    object-fit: cover;
`

export default function index({item, selected}: ActivityItem) {
    const router = useRouter()
    return <Card
        className={'activity_items'}
        onMouseDown={(event) => {mouseEvent(event, router, `/activities/activity/${item?.id}`)}}
    >
        {!item.images[0]?.img_url ? (
            <Placeholder.Graph active style={{width:500, height: 200}}/>
        ) : (
            <Image
                src={`${image_url}${item.images[0].img_url}`}
                alt="category_image"
                className={image}
            />
        )}
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
                                    {format(new Date(event.event_date), "d MMMM", { locale: ru })}
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
                {selected ?
                    <>
                        <Divider>Выбранная дата</Divider>
                        <TagGroup style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                            <Tag
                                color={'blue'}
                                size="md"
                            >
                                {format(new Date(selected), "d MMMM", { locale: ru })}
                            </Tag>
                        </TagGroup>
                     </> : <></>
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