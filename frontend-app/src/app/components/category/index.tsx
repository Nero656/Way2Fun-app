'use client'
import {Nav, Image, IconButton, Drawer, Placeholder, Loader, Text} from 'rsuite'
import React, {useState, useEffect} from 'react'
import CategoryActivity from './activity'
import MenuIcon from '@rsuite/icons/Menu'
import {store} from "@/redux/store"
import Link from "next/link";
import {css} from '@emotion/css'

type ImageType = {
    id: number
    img_url: string
    category_id: number
}

type categoryType = {
    id: number,
    name: string,
    images: ImageType[]
}

type activityList = {
    id: number,
    name: string,
    description: string,
    short_description: string,
    price: string,
    duration: number,
    capacity: number,
    city: {
        name: string,
        country: string,
        climate: string,
    }
    guide: {
        name: string,
        telephone: string,
    }
    images: {
        img_url: string,
    }
}

const image = css`
    width: 100vw;
    height: 45vh;
    aspect-ratio: 16/9;
    object-fit: cover;
`

const activity_footer = css`
    display: flex;
    width: 100%;
    overflow: auto;
    justify-content: center;
    align-items: 'center'
`

export default function category() {
    const [categoryId, setCategoryId] = useState<number>(0)
    const [categoryResponse, setCategoryResponse] = useState<categoryType[]>([])
    const [activityResponse, setActivityResponse] = useState<activityList[]>([])
    const [imageResponse, setImageResponse] = useState<ImageType | null>(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1100)
    const [active, setActive] = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const toggleDrawer = () => setDrawerOpen(!drawerOpen)

    const requestCategory = async () => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}categories/`, {
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
                setCategoryResponse(data)
                await requestImage(data[0].images[0].id)

            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }

    const requestImage = async (id: number) => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}image/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                if (res.status === 404) {
                    setImageResponse(null)
                    return
                }
                throw new Error(`HTTP error! Status: ${res.status}`)
            }
            const contentType = res.headers.get("content-type")
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()
                setImageResponse(data)
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }

    const requestActivity = async (id: number) => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}activities/${id}`, {
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
                setActivityResponse(data.data)
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 1100)
    }
    useEffect(() => {
        async function fetchData() {
            try {
                await Promise.all([
                    requestCategory(),
                    requestActivity(1)
                ])
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const Navbar = ({active, onSelect}: any) => {
        return (
            <>
                <Nav
                    activeKey={active}
                    onSelect={onSelect}
                    appearance="subtle"
                    reversed={true}
                    style={
                        isMobile ? {
                            display: 'flex',
                        } : {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                >
                    <div className="nav-items-desktop">
                        {categoryResponse.map((category, index) => (
                            <Nav.Item eventKey={category.id} key={index} onClick={() => {
                                requestActivity(category.id)
                                setCategoryId(category.id)
                                category.images.length > 0 ?
                                    requestImage(category.images[0].id) :
                                    setImageResponse(null)
                            }}>
                                {category.name}
                            </Nav.Item>
                        ))}
                    </div>

                    <div className="nav-items-mobile">
                        <IconButton
                            icon={<MenuIcon/>}
                            onClick={toggleDrawer}
                            className="nav-items-mobile"
                            appearance="subtle"
                            circle
                        />
                        <span>Категории</span>
                    </div>
                </Nav>

                <Drawer size="xs" placement="left" open={drawerOpen} onClose={toggleDrawer}>
                    <Drawer.Header>
                        <Drawer.Title>Категории</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        <Nav activeKey={active} onSelect={onSelect} vertical>
                            <>
                                {categoryResponse.map((category, index) => (
                                    <Nav.Item eventKey={category.id} key={index} onClick={() => {
                                        setCategoryId(category.id)
                                        requestActivity(category.id)
                                        category.images.length > 0 ?
                                            requestImage(category.images[0].id)
                                            :  requestImage(0)
                                        toggleDrawer() // Close drawer on selection
                                    }}>
                                        {category.name}
                                    </Nav.Item>
                                ))}
                            </>
                        </Nav>
                    </Drawer.Body>
                </Drawer>
            </>
        )
    }

    return (
        <>
            {imageResponse?.img_url != null &&
                <Image
                    src={`${store.getState().api?.value.image_url}${imageResponse?.img_url}`}
                    alt={'category_image'}
                    className={image}
                />
            }

            {imageResponse?.img_url === null || imageResponse?.img_url === undefined &&
                <Placeholder.Graph
                    style={{
                        marginBottom: -5,
                        width: '100vw',
                        height: '45vh',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                />
            }

            <Navbar active={active} onSelect={setActive}/>
            <> {activityResponse ?
                <CategoryActivity activity={activityResponse}/>
                : <Loader content="Загрузка..."/>
            }
            </>
            <div className={activity_footer}>
                {activityResponse.length < 5?
                    <Text>К сожалению больше активностей не обнаружено...</Text> :
                    <Link href={`/activities/${categoryId}`}>Посмотреть ещё... </Link>
                }
            </div>
        </>
    )
}