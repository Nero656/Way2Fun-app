'use client'
import {useEffect, useState} from "react";
import {handleResize} from "@/app/config";
import {Button, CardGroup} from "rsuite";
import Activity from "@/app/components/activity/index"
import {store} from "@/redux/store"
import {destroy} from '@/redux/features/user-favorite'
import {css} from "@emotion/css"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const cardItemStyle = css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const deleteButtonStyle = css`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
`


export default function index() {
    const [isResolution, setResolution] = useState<number>(handleResize())

    useEffect(() => {
        const updateResolution = () => setResolution(handleResize())

        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])

    return <CardGroup columns={isResolution} style={{gridArea: 'CardItems'}}>
        {store.getState().favorite?.products?.map((item, index) => (
            <div key={index} className={cardItemStyle}>
                <Button className={deleteButtonStyle} appearance={"ghost"} color={'red'}
                        onClick={() => {
                            store.dispatch(destroy({id: index}))
                        }}>
                    <DeleteOutlineIcon/>
                </Button>
                <Activity item={item} selected={''}/>
            </div>
        ))}
    </CardGroup>
}