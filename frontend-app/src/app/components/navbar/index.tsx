'use client'
import {Navbar as RSNavbar, Nav, InputGroup, Input, Button, DatePicker, Modal} from 'rsuite'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar({toggleMode, theme}) {
    const [city, setCity] = useState('');
    const [date, setDate] = useState(null);
    const [showSearch, setShowSearch] = useState(false); // Состояние для отображения модального окна поиска
    const [isClient, setIsClient] = useState(false); // To track if we're on the client-side
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter()
    const toggleModeFunc = () => {
        theme()
    };

    const handleSearch = () => {
        console.log('Searching for city:', city, 'on date:', date);
    };

    useEffect(() => {
        setIsClient(true);
        setIsMobile(window.innerWidth <= 768);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <>
            <RSNavbar>
                <RSNavbar.Brand style={{cursor: 'pointer'}} onClick={() => router.push('/')}>
                        Way2Fun
                </RSNavbar.Brand>
                <Nav pullRight>
                    {/* Заменяем Nav.Item на Row и Col для мобильных устройств */}

                    {/* Показываем поля ввода только для больших экранов */}
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
                                    style={{marginLeft: '10px', flex: 2}} // Делаем поле даты шире
                                />
                                <Button
                                    onClick={handleSearch}
                                    appearance="primary"
                                    startIcon={<SearchOutlinedIcon/>}
                                    className={isMobile ? 'hidden-xs' : ''}
                                    style={{marginLeft: '10px'}}
                                />
                            </InputGroup>
                        </Nav.Item>
                    )}

                    {isMobile && (
                        <Nav.Item
                            onClick={() => setShowSearch(true)}
                            appearance="primary"
                            style={{marginTop: '10px'}}
                        >
                            <SearchOutlinedIcon/>
                        </Nav.Item>
                    )}
                    <Nav.Item onClick={() => router.push('/user/registration')}>

                        <PersonOutlineOutlinedIcon/>
                    </Nav.Item>
                    <Nav.Item onClick={() => toggleModeFunc()}>
                        {toggleMode ? <LightModeOutlinedIcon/> : <DarkModeOutlinedIcon/>}
                    </Nav.Item>
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
