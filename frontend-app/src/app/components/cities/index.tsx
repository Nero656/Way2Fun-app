'use client'
import {List, HStack, Text, Panel, StatGroup, Placeholder, Image} from 'rsuite'
import React, {useState, useEffect} from 'react'
import {base_url, handleResize, image_url, mouseEvent} from '@/app/config'
import {css} from "@emotion/css"
import {router} from "next/client"
import {useRouter} from "next/navigation";

const image = css`
    width: 50px;
    height: 50px;
    aspect-ratio: 16/9;
    object-fit: cover;
`

const imageMobile = css`
    width: 50px;
    aspect-ratio: 16/9;
    object-fit: cover;
`

const itemStyle = css`
    width: auto;
    padding: 10px;
    cursor: pointer;
    transition: 0.3s;
    border-radius: 5px;

    :hover {
        background-color: ${'rgba(67, 67, 67, 0.3)'};
    }
`

type imageType = {
    id: number
    img_url: string
}

type cityType = {
    id: number
    name: string
    country: string
    climate: string
    description: string
    short_description: string
    images: imageType[]
}

export default function index() {
    const [cities, setCities] = useState<cityType[]>([])
    const [isResolution, setResolution] = useState<number>(handleResize())
    const router = useRouter()

    const requestCity = async () => {
        try {
            const res = await fetch(`${base_url}cities/`, {
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

                setCities(data)
            } else {
                throw new Error("Received non-JSON response")
            }
        } catch (e) {
            console.error(e)
        }
    }


    useEffect(() => {
        requestCity()
    }, [])

    useEffect(() => {
        const updateResolution = () => setResolution(handleResize())
        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])

    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Panel header={'Города'} style={{width: '90vw'}}>
            <StatGroup spacing={20} columns={isResolution}>
            {cities.map((item, index) => (
                <List.Item
                    key={index}
                    className={itemStyle}
                    onMouseDown={(event) => {
                        mouseEvent(event, router, `/activities/city/${item?.id}`)
                    }}
                >
                    <HStack spacing={10} alignItems="center">
                        {!item.images[0]?.img_url ? (
                            <Placeholder.Paragraph
                                style={{ width: 50, height: 50, marginRight: 10}}
                                graph="circle" active
                            />
                        ) : (
                            <Image
                                src={`${image_url}${item.images[0].img_url}`}
                                alt="category_image"
                                className={image}
                                circle
                            />
                        )}
                        <HStack.Item flex={1}>
                            <HStack justifyContent="space-between">
                                <Text>{item.name}</Text>
                            </HStack>
                            <Text>{item.short_description}</Text>
                        </HStack.Item>
                    </HStack>
                </List.Item>
            ))}
            </StatGroup>
        </Panel>
    </div>
}