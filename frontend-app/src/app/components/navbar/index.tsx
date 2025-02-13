'use client'
import {Navbar as RSNavbar, Nav, Button, Modal, Dropdown, Toggle} from 'rsuite'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {store} from "@/redux/store";
import {themeAction} from "@/redux/features/theme-slice"
import {logOut} from "@/redux/features/auth-slice";
import Search from '../search'

export default function Navbar({theme}: any) {
    const [showSearch, setShowSearch] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [token, setToken] = useState<string | null>('')
    const [username, setUsername] = useState<string | null>('')
    const router = useRouter()

    const toggleModeFunc = () => {
        store.dispatch(themeAction({theme: store.getState().theme?.value.theme}))
        theme()
    }
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768)
    }

    useEffect(() => {
        setIsClient(true)
        setIsMobile(window.innerWidth <= 768)

        const savedToken = store.getState().user?.value.accessToken
        const savedUsername = store.getState().user?.value.user.name

        setToken(savedToken ? String(savedToken) : null)
        setUsername(savedUsername ? String(savedUsername) : null)

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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
                <RSNavbar.Brand style={{cursor: 'pointer'}} onClick={() => router.push('/')}>
                    Way2Fun
                </RSNavbar.Brand>
                <Nav pullRight>
                    {!isMobile && (
                        <div style={{float: 'left', marginTop: '0.5rem'}}>
                            <Search/>
                        </div>
                    )}

                    {isMobile && (
                        <Nav.Item
                            onClick={() => setShowSearch(true)}
                            style={{marginTop: '10px'}}
                        >
                            <SearchOutlinedIcon/>
                        </Nav.Item>
                    )}


                    {token === null ? <span>
                        <Nav.Item onClick={() => toggleModeFunc()}>
                            <Toggle
                                checkedChildren={<DarkModeOutlinedIcon fontSize={'small'}/>}
                                unCheckedChildren={<LightModeOutlinedIcon fontSize={'small'}/>}
                                checked={store.getState().theme?.value.theme}
                            />
                        </Nav.Item>
                         <Nav.Item
                             onClick={() => router.push(`/user/registration`)}
                             icon={<PersonOutlineOutlinedIcon/>}
                         >
                           Войти
                        </Nav.Item>
                        </span> :
                        <Dropdown title={username} icon={<PersonOutlineOutlinedIcon/>} placement="bottomStart">
                            <Dropdown.Item
                                icon={<AccountCircleIcon fontSize={'small'}/>}
                                onClick={() => {router.push(`/user/profile`)}}
                            >
                                {/*<Link href={`/user/profile`}>*/}
                                    Профиль
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Toggle
                                    onClick={() => toggleModeFunc()}
                                    checkedChildren={<DarkModeOutlinedIcon fontSize={'small'}/>}
                                    unCheckedChildren={<LightModeOutlinedIcon fontSize={'small'}/>}
                                    checked={store.getState().theme?.value.theme}
                                    size={'md'}
                                >Тема</Toggle>
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => handleLogout()}
                                icon={<LogoutIcon fontSize={'small'}/>}
                            >
                                Выйти
                            </Dropdown.Item>
                        </Dropdown>
                    }
                </Nav>
            </RSNavbar>

            {/* Модальное окно для поиска на маленьких экранах */}
            <Modal open={showSearch} onClose={() => setShowSearch(false)}>
                <Modal.Header>
                    <Modal.Title>Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Search />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowSearch(false)} appearance="subtle">
                        Отменить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
