'use client'
import {Nav, Image, IconButton, Drawer, Placeholder} from 'rsuite'
import {useState, useEffect} from 'react'
import CategoryActivity from './activity/page'
import MenuIcon from '@rsuite/icons/Menu'

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
    id?: number,
    name?: string,
    description?: string,
    short_description?: string,
    price?: string,
    duration?: number,
    capacity?: number,

    city?: {
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


export default function category() {
    const [categoryResponse, setCategoryResponse] = useState<categoryType[]>([])
    const [activityResponse, setActivityResponse] = useState<activityList[]>([])
    const [imageResponse, setImageResponse] = useState<ImageType | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [active, setActive] = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const toggleDrawer = () => setDrawerOpen(!drawerOpen)

    const requestCategory = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/categories/`, {
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
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }

    const requestImage = async (id: number) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/image/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                if (res.status === 404) {
                    console.warn(`Image with ID ${id} not found.`)
                    setImageResponse(null) // Set a fallback or null response
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
            const res = await fetch(`http://127.0.0.1:8000/api/activities/${id}`, {
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
                setActivityResponse(data)
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
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
    }, [])


    const Navbar = ({active, onSelect, ...props}: any) => {
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
                        marginTop: -5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >

                    <div className="nav-items-desktop">
                        {categoryResponse.map((category, index) => (
                            <Nav.Item eventKey={category.id} key={index} onClick={() => {
                                requestActivity(category.id)
                                category.images.length > 0 ? requestImage(category.images[0].id) : 0
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
                                        requestActivity(category.id)
                                        category.images.length > 0 ?
                                            requestImage(category.images[0].id)
                                            : 0
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
            <div style={{width: '100vw', overflow: 'hidden'}}>
                {imageResponse?.img_url != null || imageResponse?.img_url != undefined &&
                <Image
                    src={`http://127.0.0.1:8000/${imageResponse?.img_url}`}
                    alt={`name`}
                    style={{
                        width: '100vw',
                        height: '45vh',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                />
                }
                {imageResponse?.img_url === null || imageResponse?.img_url === undefined &&
                    <Placeholder.Graph
                        style={{
                            width: '100vw',
                            height: '45vh',
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }}
                    />
                }
            </div>
            <Navbar active={active} onSelect={setActive}/>
            <CategoryActivity activityList={activityResponse}/>
        </>
    )
}