'use client'
import {Navbar as RSNavbar, Stack, Nav, InputGroup, Input, Button, DatePicker, Modal, Dropdown, Toggle} from 'rsuite'
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

export default function Navbar({toggleMode, theme}: any) {
    const [city, setCity] = useState('');
    const [date, setDate] = useState<Date | null>(null)
    const [showSearch, setShowSearch] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [token, setToken] = useState<string | null>('')
    const [username, setUsername] = useState<string | null>('')
    const router = useRouter()

    const toggleModeFunc = () => {
        store.dispatch(themeAction({theme: store.getState().theme?.value.theme}))
        theme()
    };

    const handleSearch = () => {
        console.log('Searching for city:', city, 'on date:', date);
    };

    useEffect(() => {
        setIsClient(true);
        setIsMobile(window.innerWidth <= 768);

        const savedToken = store.getState().user?.value.accessToken
        const savedUsername = store.getState().user?.value.user.name

        setToken(savedToken ? String(savedToken) : null)
        setUsername(savedUsername ? String(savedUsername) : null)

    }, []);

    if (!isClient) {
        return null;
    }

    const handleLogout = () => {
        store.dispatch(logOut())
        location.reload()
    };

    return (
        <>
            <RSNavbar>
                <RSNavbar.Brand style={{cursor: 'pointer'}} onClick={() => router.push('/')}>
                    Way2Fun
                </RSNavbar.Brand>
                <Nav pullRight>
                    {!isMobile && (
                        <Nav.Item>
                            <InputGroup inside style={{width: '100%'}}>
                                <Input
                                    placeholder="Какой город?"
                                    value={city}
                                    onChange={(value) => setCity(value)}
                                    style={{flex: 1}} // Растягиваем поле ввода города
                                />
                                <DatePicker
                                    value={date}
                                    onChange={(newDate) => setDate(newDate)}
                                    placeholder="Когда?"
                                    style={{marginLeft: '10px', flex: 2}}
                                />
                                <Button
                                    onClick={handleSearch}
                                    appearance="primary"
                                    className={isMobile ? 'hidden-xs' : ''}
                                    style={{marginLeft: '10px'}}
                                ><SearchOutlinedIcon/></Button>
                            </InputGroup>
                        </Nav.Item>
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
                            >
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
                    <InputGroup inside style={{width: '100%'}}>
                        <Input
                            placeholder="Какой город?"
                            value={city}
                            onChange={(value) => setCity(value)}
                            style={{flex: 1}}
                        />
                        <DatePicker
                            value={date}
                            onChange={(newDate) => setDate(newDate)}
                            placeholder="Select date"
                            style={{marginLeft: '10px', flex: 2}}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSearch} appearance="primary">
                        Искать
                    </Button>
                    <Button onClick={() => setShowSearch(false)} appearance="subtle">
                        Отменить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
