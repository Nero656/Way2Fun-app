'use client'
import {
    Panel,
    Card,
    CardGroup,
    Text,
    HStack,
    VStack,
    Placeholder,
    Image,
    Button,
    Modal,
    Divider
} from "rsuite"
import React, {useEffect, useState} from "react"
import {store} from "@/redux/store";
import {authorizationFetch, base_url, handleResize, image_url} from "@/app/config"
import NoResult from "@/app/components/no_result"
import {format} from "date-fns"
import {ru} from "date-fns/locale"
import {css} from "@emotion/css"
import {useRouter} from "next/navigation";

const image = css`
    width: 100%;
    height: 200px;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 6px;
`

type BookingState = {
    date: string,
    time: string,
    status: boolean,
    formatted_date: string,
    user: {
        name: string,
        email: string,
        telephone: string
    },
    activity: {
        name: string,
        description: string,
        short_description: string,
        price: number,
        capacity: number,
        duration: number,
        guide_id: number,
        images: {
            img_url: string,
        }[]
    }
    created_at: string,
}

interface Booking {
    booking: BookingState
}

export default function booking() {
    const router = useRouter()
    const [bookingList, setBookingList] = useState<BookingState[]>([])
    const [isResolution, setResolution] = useState<number>(handleResize())
    const [selectedBooking, setSelectedBooking] = useState<BookingState | null>(null)
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const requestBooking = async () => {
        try {
            const res =
                await fetch(`${base_url}bookings/booking/${store.getState().user?.value.user.id}`, {
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
                setBookingList(data)
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }

    const makeNewChat = async (guidId: number) => {
        try {
            const res = await fetch(`
            ${base_url}chat/${store.getState().user?.value.user.id}/${guidId}`, {
                method: 'GET',
                headers: authorizationFetch(store.getState().user?.value.accessToken),
            })
            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()

                router.push(`/chat?id=${data.id}`)
            } else {
                throw new Error("Received non-JSON response")
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        requestBooking()
    }, [])

    useEffect(() => {
        const updateResolution = () => setResolution(handleResize())
        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])


    return (<Panel header="Список запланированных мероприятий">
        {bookingList.length > 0 ?
            <CardGroup columns={isResolution}>
                {bookingList.map((item, index) => (
                    <Card key={index}  shaded="hover" onClick={() => {
                        setSelectedBooking(item)
                        handleOpen()
                    }}>
                        {!item.activity.images[0]?.img_url ? (
                            <Placeholder.Graph active style={{width:500, height: 200}}/>
                        ) : (
                            <Image
                                src={`${image_url}${item.activity.images[0].img_url}`}
                                alt="category_image"
                                className={image}
                            />
                        )}
                        <Card.Header>
                            <HStack>
                                <VStack spacing={2}>
                                    <Text>{item?.activity.name}</Text>
                                    <Text muted size="sm">
                                        {item?.status ? 'Мероприятие планируется' : 'Мероприятие окончено'}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body>
                            <Text>
                                <strong>Дата проведения: </strong>
                                {format(new Date(item?.date), "d MMMM Y", {locale: ru})}
                            </Text>
                            <Text> <strong>Время проведения: </strong>
                                {
                                    `${new Date('1970-01-01T' + item.time).getHours()}ч
                                     ${new Date('1970-01-01T' + item.time).getMinutes()}м`
                                }
                            </Text>
                        </Card.Body>
                        <Card.Footer>
                            <Text muted>{item?.activity.short_description}</Text>
                        </Card.Footer>
                    </Card>
                ))}
            </CardGroup> :
            <NoResult/>
        }

        <Modal overflow={false} open={open} onClose={handleClose}>
            <Modal.Header>
                {selectedBooking && (
                <Modal.Title>Бронь: {selectedBooking.activity.name}</Modal.Title>
                )}
            </Modal.Header>
            <Modal.Body>
                {selectedBooking && (
                    <VStack spacing={3}>
                        {!selectedBooking.activity.images[0]?.img_url ? (
                            <Placeholder.Graph active style={{width:'100%', height: 200}}/>
                        ) : (
                            <Image
                                src={`${image_url}${selectedBooking.activity.images[0].img_url}`}
                                alt="category_image"
                                className={image}
                            />
                        )}
                        <Divider />
                        <Text>
                            <strong>Мероприятие:</strong> {selectedBooking.activity.name}
                        </Text>
                        <Text>
                            <strong>Забронировано: </strong>
                            {format(new Date(selectedBooking?.created_at), "d MMMM Y", {locale: ru})}
                        </Text>
                        <Text>
                            <strong>Описание:</strong> {selectedBooking.activity.description}
                        </Text>
                        <Text>
                            <strong>Дата:</strong> {format(new Date(selectedBooking?.date), "d MMMM Y", {locale: ru})}
                        </Text>
                        <Text>
                            <strong>Время:</strong> {selectedBooking.time}
                        </Text>
                        <Text>
                            <strong>Статус:</strong> {selectedBooking.status ? 'Планируется' : 'Окончено'}
                        </Text>
                        <Divider />
                        <Text>
                            <strong>Пользователь:</strong> {selectedBooking.user.name}
                        </Text>
                        <Text>
                            <strong>Email:</strong> {selectedBooking.user.email}
                        </Text>
                        <Text>
                            <strong>Телефон:</strong> {selectedBooking.user.telephone}
                        </Text>
                        <Divider />

                        <h5>Контакты</h5>
                        <Button
                            onClick={() => makeNewChat(selectedBooking.activity.guide_id)}
                            appearance={'link'}
                        >
                            Связаться с гидом
                        </Button>

                        <Divider />

                        <Text>
                            <strong>Цена:</strong> {selectedBooking.activity.price} ₽
                        </Text>
                        <Text>
                            <strong>Вместимость:</strong> {selectedBooking.activity.capacity} чел.
                        </Text>
                        <Text>
                            <strong>Длительность:</strong> {selectedBooking.activity.duration} мин.
                        </Text>
                    </VStack>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} appearance="primary">
                    Принять
                </Button>
            </Modal.Footer>
        </Modal>

    </Panel>)
}