import {Button, ButtonGroup, ButtonToolbar, InputPicker, Radio, RadioGroup, useToaster} from "rsuite"
import {format} from "date-fns"
import {ru} from "date-fns/locale"
import {store} from "@/redux/store"
import {add as addCard} from "@/redux/features/user-cart"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import {add as addFavorite} from "@/redux/features/user-favorite"
import FavoriteIcon from "@mui/icons-material/FavoriteBorder"
import {useState} from "react"
import {activityType} from "@/app/components/activity/types"
import Message from "@/app/components/activity_Info/message"
import {postRequest} from "@/app/components/modal_body_card/requests"

export default function index({activity}: { activity: activityType }) {
    const [selected, setSelected] = useState<string | number>('')
    const toaster = useToaster()

    let date: [] | any = activity?.activity.activity_date.map(
        (item, index) => (
            {label: format(new Date(item.event_date), "d MMMM HH:mm", {locale: ru}), value: item.event_date}
        )
    )

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20
    }}>
        <h4>Цена: {activity?.activity.price} ₽</h4>
        {/*<RadioGroup*/}
        {/*    appearance='default'*/}
        {/*    value={selected}*/}
        {/*    onChange={setSelected}*/}
        {/*>*/}
        {/*    <label style={{padding: 7}}>Выберете дату:</label>*/}


        {/*    {activity?.activity.activity_date.map((item, index) => (*/}
        {/*        <Radio value={item.event_date} key={index}>*/}
        {/*            {*/}
        {/*                format(new Date(item.event_date), "d MMMM HH:mm", {locale: ru})*/}
        {/*            } часов*/}
        {/*        </Radio>*/}
        {/*    ))}*/}
        {/*</RadioGroup>*/}
        <InputPicker
            style={{marginTop: 10}}
            data={date} size={'lg'}
            value={selected}
            onChange={setSelected}
            placeholder={'Выберете дату'}
        />

        <ButtonToolbar style={{marginTop: 10}}>
            <ButtonGroup>
                <Button appearance={'primary'} disabled={!selected}
                        onClick={() => {
                            store.dispatch(
                                addCard({activity: activity?.activity, selected: selected})
                            )
                            postRequest
                            toaster.push(Message('/card', 'Активность была добавлена в корзину', 'success'),
                                {placement: 'topStart', duration: 5000})
                        }}
                        startIcon={<ShoppingCartIcon/>}
                >
                    Добавить в корзину
                </Button>
                <Button appearance={'ghost'}
                        color={'red'}
                        onClick={() => {
                            toaster.push(Message('/favorite', 'Активность была добавлена в избранное', 'success'),
                                {placement: 'topStart', duration: 5000})
                            store.dispatch(addFavorite(activity?.activity))
                        }}
                >
                    <FavoriteIcon/>
                </Button>
            </ButtonGroup>
        </ButtonToolbar>
    </div>
}