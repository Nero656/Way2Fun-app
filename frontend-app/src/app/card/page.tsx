'use client'
import {Button, Divider, Panel, Modal} from "rsuite"
import ModalBodyCard from '@/app/components/modal_body_card/index'
import {store} from "@/redux/store"
import NoResult from "@/app/components/no_result"
import {useEffect, useState} from "react"
import {handleResizeMin} from "@/app/config"
import {useSelector} from "react-redux"
import CardItems from "@/app/components/card_items"
import {css} from "@emotion/css"
import {clear} from '@/redux/features/user-cart'
import {getRequest} from "@/app/components/modal_body_card/requests";

const cardStyle = css`
    display: grid;
    grid-template-columns: 1rem;
    gap: 1rem;
    grid-template-areas: 
    "CardItems CardItems . Sidebar"
    "CardItems CardItems . .";
`
const cardMobileStyle = css`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas:
    "CardItems"
    "Sidebar";
`

export default function page() {
    useSelector(() => store.getState().cart)
    const [isMobile, setIsMobile] = useState<boolean>(handleResizeMin(725))
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const getActivityText = () => {
        if (store.getState().cart?.products.length % 10 === 1 && store.getState().cart?.products.length % 100 !== 11)
            return "услуга"
        if (
            [2, 3, 4].includes(store.getState().cart?.products.length % 10)
            && ![12, 13, 14].includes(store.getState().cart?.products.length % 100))
            return "услуги";

        return 'услуг'
    }


    useEffect(() => {
        getRequest()
        const updateResolution = () => setIsMobile(handleResizeMin(800))
        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, []);

    return <Panel>
        {store.getState().cart?.products.length > 0 ? <div
            className={handleResizeMin(725) ? cardMobileStyle : cardStyle}>
            <CardItems/>
            <Panel
                header={<div>Ваша корзина <Divider/></div>}
                bordered={true}
                style={
                    {
                        marginTop: 10,
                        gridArea: 'Sidebar',
                    }
                }
            >
                <p>В корзине: {store.getState().cart?.products.length} {getActivityText()}</p>
                <p>Цена: {
                    store.getState().cart?.products.reduce(
                        (acc, num) => acc + parseFloat(num.activity.price), 0).toFixed(2)
                } ₽
                </p>
                <Divider/>
                <Button
                    block
                    appearance={'primary'}
                    onClick={handleOpen}
                >
                    Купить
                </Button>
                <Button
                    block
                    appearance={'ghost'}
                    color={'red'}
                    onClick={
                        () => store.dispatch(clear())
                    }
                >
                    Очистить
                </Button>
            </Panel>
        </div> : <NoResult/>
        }
        <ModalBodyCard onOpen={open} onClose={handleClose}/>
    </Panel>
}