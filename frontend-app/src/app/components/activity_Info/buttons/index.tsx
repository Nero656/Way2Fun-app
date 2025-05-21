import {Button, ButtonGroup, ButtonToolbar, InputPicker, useToaster, Text, Loader, Stack} from "rsuite"
import {format} from "date-fns"
import {ru} from "date-fns/locale"
import {store} from "@/redux/store"
import {add as addCard} from "@/redux/features/user-cart"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import {add as addFavorite} from "@/redux/features/user-favorite"
import FavoriteIcon from "@mui/icons-material/FavoriteBorder"
import React, {useState} from "react"
import {activityType} from "@/app/components/activity/types"
import Message from "@/app/components/activity_Info/message"
import {base_url} from "@/app/config";

export default function index({activity}: { activity: activityType }) {
    const [selected, setSelected] = useState<string | number>('')
    const [selectedId, setSelectedId] = useState<any>()
    const [availableSeats, setAvailableSeats] = useState<number | string | null>(null)
    const [buttonEnabler, setButtonEnabler] = useState<boolean>(false)
    const toaster = useToaster()

    const date = activity?.activity.activity_date.map(
        (item, index) => ({
            label: format(new Date(item.event_date), 'd MMMM HH:mm', {locale: ru}),
            value: item.event_date,
            index: index,
            id: item.id,
        }));

    const handleDateChange = async (value: string | number) => {
        setSelected(value)

        // Находим выбранную дату в массиве date
        const selectedDateItem =
            date.find(item => item.value === value)

        const activityDateItem = activity.activity.activity_date.find(
            (item) => item.event_date === value
        )
        setSelectedId(selectedDateItem?.id)

        try {
            setAvailableSeats(null)

            await new Promise(resolve => setTimeout(resolve, 1000));

            const res = await
                fetch(`${base_url}available_seats/${activityDateItem?.id}/${activity.activity.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()
                if (data?.available_seats === 0) {
                    setAvailableSeats(0)
                    setButtonEnabler(false)
                } else {
                    setAvailableSeats(data?.available_seats)
                    setButtonEnabler(true)
                }
            }
        } catch (e) {
            console.error(e)
        }

    }

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20
    }}>
        <h4>Цена: {activity?.activity.price} ₽</h4>

        <InputPicker
            style={{marginTop: 10}}
            data={date}
            size="lg"
            value={selected}
            onChange={handleDateChange}
            placeholder="Выберите дату"
        />

        {/*todo доделать вывод свободных мест*/}
        <div style={{marginTop: 10}}>
            {selected
                ? (availableSeats !== null ? (<Stack spacing={2}>
                        <Text as='b'>Осталось свободных мест: </Text>
                        {availableSeats === 0 ? (
                                <Text color="red">на выбранную дату, свободные места закончились!</Text>)
                            : (availableSeats)}
                    </Stack>) : (
                        <Loader size="sm" content="Загрузка"/>
                    )
                ) : 'Выберите дату'}
        </div>


        <ButtonToolbar style={{marginTop: 10}}>
            <ButtonGroup>
                <Button
                    appearance="primary"
                    disabled={!buttonEnabler}
                    onClick={() => {
                        store.dispatch(
                            addCard({activity: activity?.activity, selected, selectedId})
                        );
                        toaster.push(
                            Message('/card', 'Мероприятие была добавлена в корзину', 'success'),
                            {placement: 'topStart', duration: 5000}
                        );
                    }}
                    startIcon={<ShoppingCartIcon/>}
                >
                    Добавить в корзину
                </Button>
                <Button
                    appearance="ghost"
                    color="red"
                    onClick={() => {
                        toaster.push(
                            Message('/favorite', 'Мероприятие была добавлена в избранное', 'success'),
                            {placement: 'topStart', duration: 5000}
                        );
                        store.dispatch(addFavorite(activity?.activity));
                    }}
                >
                    <FavoriteIcon/>
                </Button>
            </ButtonGroup>
        </ButtonToolbar>
    </div>

}