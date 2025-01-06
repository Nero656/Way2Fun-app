'use client'
import {Nav, Image, IconButton, Drawer} from 'rsuite'
import {useState, useEffect} from 'react'
import CategoryActivity from './activity/page'
import MenuIcon from '@rsuite/icons/Menu'



type ImageType = {
    id: number;
    img_url: string;
    category_id: number;
};

type categoryType = {
    id: number,
    name: string,
    images: ImageType[]
}

type activityList = {
    current_page : number
    name: string,
    description: string,
    short_description: string,
    price: string,
    duration: number,
    capacity: number,
}

export default function category() {
    const [categoryResponse, setCategoryResponse] = useState<categoryType[]>([])
    const [activityResponse, setActivityResponse] = useState<activityList[]>([])
    const [imageResponse, setImageResponse] = useState<ImageType>()
    const [active, setActive] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    const requestCategory = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/categories/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            setCategoryResponse(data);
        } catch (e) {
            console.error(e)
        }
    }

    const requestImage = async (id) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/image/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            setImageResponse(data);
        } catch (e) {
            console.error(e)
        }
    }

    const requestActivity = async (id) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/activities/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            setActivityResponse(data);
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        async function fetchData() {
            await requestCategory()

            await requestActivity(1)
            await requestImage(7)
        }

        fetchData()
    }, []);


    const Navbar = ({active, onSelect, ...props}) => {
        return (
            <>
                <Nav activeKey={active} onSelect={onSelect} appearance="subtle" justified>
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
                                        requestActivity(category.id);
                                        category.images.length > 0 ?
                                            requestImage(category.images[0].id)
                                            : 0
                                        toggleDrawer(); // Close drawer on selection
                                    }}>
                                        {category.name}
                                    </Nav.Item>
                                ))}
                            </>
                        </Nav>
                    </Drawer.Body>
                </Drawer>
            </>
        );
    };

    return (
        <>
            <div style={{ width: '100vw', overflow: 'hidden' }}>
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
            </div>
            <Navbar justified active={active} onSelect={setActive}/>

            <CategoryActivity props={active} activityList={activityResponse} />
        </>
    )
}