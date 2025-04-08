'use client'
import {
    Avatar,
    AvatarGroup,
    Button,
    Card,
    CardGroup,
    Form,
    HStack,
    Panel,
    Text,
    VStack,
    Rate,
    Pagination
} from "rsuite"
import StarIcon from '@rsuite/icons/Star'
import {Controller, useForm} from "react-hook-form"
import {useState, useEffect} from "react"
import {store} from '@/redux/store'
import {authorizationFetch, base_url} from '@/app/config'

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


interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface ReviewsData {
    data: Review[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface CommentsProps {
    id: number;
    reviews: ReviewsData;
    refreshReviews: (page?: number) => void;
}


export default function Comments({id, reviews, refreshReviews}: CommentsProps) {
    const {control, handleSubmit, reset, formState: {isSubmitting}} = useForm({
        defaultValues: {
            comment: '',
            rating: 0
        }
    });
    const [activePage, setActivePage] = useState(1);


    const onSubmit = handleSubmit(async (data) => {
        try {
            await postComment(data)
            reset()
            refreshReviews(activePage)
        } catch (error) {
            console.error('Error submitting comment:', error)
        }
    })

    const handlePageChange = (page: number) => {
        refreshReviews(page)
        setActivePage(page)
    }

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
                            size={'sm'}
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
        fetch(`${base_url}reviews`, {
            method: 'POST',
            headers: authorizationFetch(store.getState().user?.value.accessToken),
            body: JSON.stringify({
                'rating': data.rating,
                'user_id': store.getState().user?.value.user.id,
                'activity_id': id,
                'comment': data.comment,
            }),
        })

        setActivePage(1)
        refreshReviews(1)
    }

    return <>
        <Panel
            header={'Комментарии'}

            style={{marginTop: 10}}
        >
            <>
                <Form onSubmit={
                    (formValue, event) =>
                        onSubmit(event)
                }
                      fluid>
                    <InputController fieldName={'comment'} title={'Комментарий'} type={'textarea'}/>
                    <RatingController fieldName={'rating'} title={'Оценка'} type={'rating'}/>
                    <VStack spacing={12}>
                        <Button appearance="primary" type={'submit'}>
                            Оставить комментарий
                        </Button>
                    </VStack>
                </Form>

                <div>
                    <Pagination
                        prev
                        next
                        first
                        last
                        size="sm"
                        maxButtons={5}
                        total={reviews.total}
                        limit={reviews.per_page}
                        activePage={activePage}
                        onChangePage={handlePageChange}
                        style={{margin: 20, justifyContent: 'center'}}
                    />
                </div>

                <CardGroup columns={1} spacing={20}>
                    {reviews?.data?.map((item) => (
                        <Card key={item.id}>
                            <Card.Header>
                                <HStack spacing={10} alignItems="center">
                                    <AvatarGroup>
                                        <Avatar circle alt={item.user.name.charAt(0)}>
                                            {item.user.name.charAt(0)}
                                        </Avatar>
                                    </AvatarGroup>
                                    <VStack spacing={2} alignItems="flex-start">
                                        <Text>{item.user.name}</Text>
                                        <Text muted size="sm">
                                            {item.user.email}
                                        </Text>
                                    </VStack>
                                    <span style={{right: 15, position: 'absolute'}}>
                                        <p>
                                        <StarIcon color={'#1499EF'} style={{ fontSize: '1em' }}/>
                                            {` ${item.rating}/10`}
                                        </p>
                                    </span>
                                </HStack>
                            </Card.Header>
                            <Card.Body>
                                <Text>{item.comment}</Text>
                            </Card.Body>
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