'use client'
import {Button, Image, Placeholder, Text} from "rsuite"
import {activityType} from '@/app/components/activity/types'
import Buttons from '@/app/components/activity_Info/buttons'
import {authorizationFetch, base_url, image_url} from "@/app/config"
import {store} from "@/redux/store"
import {useRouter} from "next/navigation"
import {css} from "@emotion/css"

const image = css`
    width: 500px;
    aspect-ratio: 16/10;
    object-fit: cover;
`

export default function index({isMobile, activity}: { isMobile: boolean, activity: activityType }) {
    const router = useRouter()
    const makeNewChat = async () => {
        try {
            const res = await fetch(`
            ${base_url}chat/${store.getState().user?.value.user.id}/${activity?.activity.guide.id}`, {
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

    return <>
        <div style={
            isMobile ? {display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 25}
                : {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 25,
                    justifyContent: 'start',
                    alignItems: 'start'
                }
        }>

            {!activity.activity.images[0]?.img_url ? (
                <Placeholder.Graph style={isMobile ? {} : { width: 200 }} active/>
            ) : (
                <Image
                    src={`${image_url}${activity.activity.images[0].img_url}`}
                    alt="category_image"
                    className={image}
                />
            )}


            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div style={
                    isMobile ? {display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 25}
                        : {
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 25,
                            justifyContent: 'start',
                            alignItems: 'start'
                        }
                }>
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
                            <Text>Улица: {activity?.activity.city.address.street}</Text>
                            <Text>Строение: {activity?.activity.city.address.building}</Text>

                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <h5>Контакты</h5>
                            <Text>Гид: {activity?.activity.guide.name}</Text>
                            <Text>Телефон: {activity?.activity.guide.telephone}</Text>
                            <Button onClick={makeNewChat} appearance={'link'}>Связаться с гидом</Button>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <h5>Контакты</h5>
                            <Text>Гид: {activity?.activity.guide.name}</Text>
                            <Text>Телефон: {activity?.activity.guide.telephone}</Text>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <h5>Рейтинг: {Math.round(activity?.average_rating as number)}</h5>
                            <Text>Оценили: {activity?.count_review}</Text>
                            <Text>Забронировано: {activity?.count_activities_booking}</Text>
                        </div>
                    </div>
                </div>
                <Buttons activity = {activity}/>
            </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', marginTop: 20}}>
            <h5>Описание</h5>
            <Text align="justify">{activity?.activity.description}</Text>
        </div>
    </>
}