'use client'
import {Panel} from "rsuite"
import {store} from "@/redux/store"
import NoResult from "@/app/components/no_result"
import {useEffect, useState} from "react"
import {handleResizeMin} from "@/app/config"
import {useSelector} from "react-redux"
import FavoriteItems from "@/app/components/favorite_items"
import {css} from "@emotion/css"

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
    gap: 1rem;
    grid-template-areas:
    "CardItems"
    "Sidebar";
`

export default function page() {
    useSelector((state) => store.getState().favorite)
    const [isMobile, setIsMobile] = useState<boolean>(handleResizeMin(725))

    useEffect(() => {
        const updateResolution = () => setIsMobile(handleResizeMin(725))
        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, []);

    return <Panel>
        {store.getState().favorite?.products.length > 0 ? <div
            className={handleResizeMin(725) ? cardMobileStyle : cardStyle}>
            <FavoriteItems/>
        </div> : <NoResult/>}
    </Panel>
}