'use client'
import {Avatar, AvatarGroup, Button, Card, CardGroup, Form, HStack, Panel, Text, VStack, Rate} from "rsuite"
import React, {useEffect, useState} from "react"
import {Controller, useForm} from "react-hook-form"
import {store} from "@/redux/store"

type Color = 'violet' | 'blue' | 'green' | 'red' | 'orange' | 'yellow'

const getRandomColor = (): Color => {
    const colors: Color[] = ['violet', 'blue', 'green', 'red', 'orange', 'yellow']
    return colors[Math.floor(Math.random() * colors.length)]
};

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

type activityType = {
    activity: {
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

interface activityInterface {
    id: any,
    activity : activityType
}

export default function Comments({id, activity}: activityInterface){
    const [isMobile, setIsMobile] = useState(false)
    const {control, handleSubmit} = useForm({defaultValues: {comment: ''}})

    const onSubmit = handleSubmit((data) => {
        postComment(data)
    })




    const InputController = (
        {fieldName, title, type}: any) => {
        return (
            <Controller
                name={fieldName}
                control={control}
                render={({field}) => (
                    <Form.Group>
                        <Form.Group controlId={fieldName}>
                            <Form.ControlLabel>{title}</Form.ControlLabel>
                            <Form.Control
                                name={fieldName}
                                id={field.name}
                                value={field.value}
                                onChange={value => field.onChange(value)}
                            />
                        </Form.Group>
                    </Form.Group>
                )}
            />
        )
    }


    const RatingController = (
        {fieldName, title, type}: any) => {
        return (
            <Controller
                name={fieldName}
                control={control}
                render={({field}) => (
                        <Form.Group controlId={fieldName}>
                            <Form.ControlLabel>{title}</Form.ControlLabel>
                            <Rate
                                max={10}
                                defaultValue={0}
                                color="blue"
                                value={field.value}
                                name={field.name}
                                onChange={value => field.onChange(value)}
                            />
                        </Form.Group>
                )}
            />
        )
    }

    const postComment = async (data: any) => {
        fetch(`${store.getState().api?.value.url}reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'rating': data.rating,
                'user_id': store.getState().user?.value.user.id,
                'activity_id': id,
                'comment': data.comment,
            }),
        })
    }

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768)
    }, []);


    return <>
        <Panel
            header={'Комментарии'}
            shaded
            style={{marginTop: 10}}
        >
            <>
                <Form onSubmit={
                    (formValue, event) =>
                        onSubmit(event)
                }
                      fluid>
                    <InputController fieldName={'comment'} title={'Комментарий'} type={'textarea'}/>
                    <RatingController fieldName = {'rating'} title={'Оценка'} type={'rating'}/>
                    <VStack spacing={12}>
                        <Button appearance="primary" type={'submit'}>
                            Оставить комментарий
                        </Button>
                    </VStack>
                </Form>
                <hr/>
                <CardGroup columns={isMobile ? 1 : 2} spacing={20}>
                    {activity.activity.review.map((item, index) => (
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
    </>
}