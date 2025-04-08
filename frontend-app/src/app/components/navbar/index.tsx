'use client'
import {Navbar as RSNavbar, Nav, Button, Modal, Dropdown, Toggle, Drawer, Panel, Avatar, HStack} from 'rsuite'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {store} from "@/redux/store";
import {themeAction} from "@/redux/features/theme-slice"
import {logOut} from "@/redux/features/auth-slice"
import {clear as clearCart} from '@/redux/features/user-cart'
import {clear as clearFavorite} from '@/redux/features/user-favorite'
import Search from '../search'
import {handleResizeMin, mouseEvent} from "@/app/config"
import {css} from "@emotion/css"
import MessageIcon from '@mui/icons-material/Message'

const mobileAdvancedSettings = css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 5px;
    cursor: pointer;

    p {
        margin-left: 8px;
    }
`


export default function Navbar({theme}: any) {
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [showAdvancedSetting, setShowAdvancedSetting] = useState<boolean>(false)
    const [isClient, setIsClient] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(handleResizeMin(800))
    const [token, setToken] = useState<string | null>('')
    const [username, setUsername] = useState<string | null>('')

    const [openDrawer, setOpenDrawer] = useState(false)
    const [placement, setPlacement] = useState('right')

    const router = useRouter()

    const toggleModeFunc = () => {
        store.dispatch(themeAction({theme: store.getState().theme?.value.theme}))
        theme()
    }

    const handleOpen = () => {
        setOpenDrawer(!openDrawer)
    }

    useEffect(() => {
        setIsClient(true)
        const updateResolution = () => setIsMobile(handleResizeMin(800))
        const savedToken = store.getState().user?.value.accessToken
        const savedUsername = store.getState().user?.value.user.name

        setToken(savedToken ? String(savedToken) : null)
        setUsername(savedUsername ? String(savedUsername) : null)

        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])
    if (!isClient) {
        return null;
    }

    const handleLogout = () => {
        store.dispatch(logOut())
        location.reload()
    }

    return (
        <div>
            <RSNavbar style={{position: 'fixed', zIndex: 99, minWidth: '100vw', top: 0}}>
                <RSNavbar.Brand
                    style={{cursor: 'pointer'}} onMouseDown={(event) => {
                    mouseEvent(event, router, '/')
                }}>
                    Way2Fun
                </RSNavbar.Brand>
                <Nav pullRight>
                    {!isMobile && (
                        <div style={{float: 'left', marginTop: '0.5rem', marginRight: '0.5rem'}}>
                            <Search/>
                        </div>
                    )}
                    {isMobile && (
                        <span>
                            <Nav.Item
                                onClick={() => setShowSearch(true)}
                            >
                                <SearchOutlinedIcon/>
                            </Nav.Item>


                            {token === null ?
                                <Nav.Item
                                    onClick={() => router.push(`/user/registration`)}
                                >
                                    <PersonOutlineOutlinedIcon/>
                                </Nav.Item> : null
                            }
                            {token === null ?
                                <Nav.Item
                                    onClick={() => setShowAdvancedSetting(true)}
                                >
                                    <MoreVertIcon/>
                                </Nav.Item> : null
                            }
                        </span>
                    )}

                    {token === null ? <span>
                         {!isMobile && (
                             <span>
                                 <Nav.Item
                                     href={`/favorite`}
                                 >
                                    <FavoriteIcon/>
                                </Nav.Item>
                                 <Nav.Item
                                     href={`/card`}
                                 >
                                    <ShoppingCartIcon/>
                                </Nav.Item>
                                 <Nav.Item onClick={() => toggleModeFunc()}>
                                    <Toggle
                                        checkedChildren={<DarkModeOutlinedIcon fontSize={'small'}/>}
                                        unCheckedChildren={<LightModeOutlinedIcon fontSize={'small'}/>}
                                        checked={store.getState().theme?.value.theme}
                                    />
                                </Nav.Item>
                                  <Nav.Item
                                      href={`/user/registration`}
                                      icon={<PersonOutlineOutlinedIcon/>}
                                  >
                                    Войти
                                </Nav.Item>
                             </span>
                         )}
                        </span> :
                        <Nav.Item icon={<PersonOutlineOutlinedIcon/>} onClick={handleOpen}>
                            {username}
                        </Nav.Item>
                    }
                </Nav>
            </RSNavbar>

            {/* Модальное окно для поиска на маленьких экранах */}
            <Modal open={showSearch} onClose={() => setShowSearch(false)}>
                <Modal.Header>
                    <Modal.Title>Поиск</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Search/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowSearch(false)} appearance="subtle">
                        Отменить
                    </Button>
                </Modal.Footer>
            </Modal>


            <Drawer style={{width: 300}} open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    <Drawer.Header>
                            <Drawer.Title>
                                <Avatar
                                    circle
                                    src="https://images.unsplash.com/broken"
                                    color={'blue'}
                                    alt={username ? username.charAt(0) : 'U'}
                                />
                                {`  ${username}`}
                            </Drawer.Title>
                    </Drawer.Header>

                    <Drawer.Body>
                        <Nav vertical onClick={handleOpen}>
                            <Nav.Item
                                icon={<AccountCircleIcon fontSize={'small'}/>}
                                onMouseDown={(event) => {
                                    mouseEvent(event, router, `/user/profile`)
                                }}
                            >
                                Профиль
                            </Nav.Item>
                            <Nav.Item
                                icon={<FavoriteIcon fontSize={'small'}/>}
                                onMouseDown={(event) => {
                                    mouseEvent(event, router, `/favorite`)
                                }}
                            >
                                Избранное
                            </Nav.Item>
                            <Nav.Item
                                icon={<ShoppingCartIcon fontSize={'small'}/>}
                                onMouseDown={(event) => {
                                    mouseEvent(event, router, `/card`)
                                }}
                            >
                                Корзина
                            </Nav.Item>
                            <Nav.Item
                                icon={<MessageIcon fontSize={'small'}/>}
                                onMouseDown={(event) => {
                                    mouseEvent(event, router, `/chat`)
                                }}
                            >
                                Сообщения
                            </Nav.Item>
                            <Nav.Item onClick={() => toggleModeFunc()}>
                                <Toggle
                                    checkedChildren={<DarkModeOutlinedIcon fontSize={'small'}/>}
                                    unCheckedChildren={<LightModeOutlinedIcon fontSize={'small'}/>}
                                    checked={store.getState().theme?.value.theme}
                                    size={'md'}
                                >Тема</Toggle>
                            </Nav.Item>
                            <Nav.Item
                                style={{color: '#e64949'}}
                                onClick={() => {
                                    handleLogout()
                                    store.dispatch(clearCart())
                                    store.dispatch(clearFavorite())
                                    router.push('/')
                                }}
                                icon={<LogoutIcon fontSize={'small'}/>}
                            >
                                Выйти
                            </Nav.Item>
                        </Nav>
                    </Drawer.Body>
            </Drawer>

            {/* Модальное окно для настройки темы и перехода в корзину на маленьких экранах */}
            <Modal open={showAdvancedSetting} onClose={() => setShowAdvancedSetting(false)}>
                <Modal.Header>
                    <Modal.Title>Меню</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Panel bodyFill={true}>
                        <div className={mobileAdvancedSettings} onClick={() => {
                            setShowAdvancedSetting(false)
                            router.push(`/favorite`)
                        }}>
                            <FavoriteIcon fontSize={'small'}/>
                            <p>Избранное</p>
                        </div>
                        <div className={mobileAdvancedSettings} onClick={() => {
                            setShowAdvancedSetting(false)
                            router.push(`/card`)
                        }}>
                            <ShoppingCartIcon fontSize={'small'}/>
                            <p>Корзина</p>
                        </div>
                        <div className={mobileAdvancedSettings}>
                            <Toggle
                                onClick={() => toggleModeFunc()}
                                checkedChildren={<DarkModeOutlinedIcon fontSize={'small'}/>}
                                unCheckedChildren={<LightModeOutlinedIcon fontSize={'small'}/>}
                                checked={store.getState().theme?.value.theme}
                                size={'md'}
                            >тема</Toggle>
                        </div>
                    </Panel>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowAdvancedSetting(false)}>
                        Принять
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
