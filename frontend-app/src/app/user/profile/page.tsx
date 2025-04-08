'use client'
import {Col, Nav, Row} from "rsuite"
import UserPage from '@/app/user/profile/components/user_page'
import Booking from '@/app/user/profile/components/booking'
import Moderator from '@/app/user/profile/components/moderator'
import {useEffect, useState} from "react"
import {css} from '@emotion/css'
import {handleResizeMin} from "@/app/config"
import {requestGetCurrentUser, User} from './getUserFetch'

const contentDesktopStyle = css`
    display: flex;
    flex-flow: row nowrap;
    justify-content: center; 
    align-items: flex-start; 
    padding: 2rem 2rem 0 0;
    gap: 2rem;
`

const contentMobileStyle = css`
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
`

interface userNavigator {
    id: number
}


export default function page() {
    const [active, setActive] = useState<number>(1)
    const [isMobile, setIsMobile] = useState<boolean>(handleResizeMin(800))
    const [user, setUser] = useState<User | null>(null)

    const fetchUser = async () => {
        const data = await requestGetCurrentUser()
        if (data) setUser(data)
    }

    useEffect(() => {
        fetchUser()
        const updateResolution = () => setIsMobile(handleResizeMin(800))
        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])

    const CustomNav = ({active, onSelect, ...props}: any) => {
        return (
            <Nav
                {...props}
                vertical={!isMobile}
                defaultValue={2}
                activeKey={active}
                onSelect={onSelect}
                style={isMobile ? {} : {width: 100}}
            >
                <Nav.Item eventKey={1}>Бронь</Nav.Item>
                <Nav.Item eventKey={2}>Профиль</Nav.Item>
                {user?.role_id !== 2 &&
                <Nav.Item eventKey={3}>Панель <br/>модератора</Nav.Item>
                }
            </Nav>
        )
    }

    const Content = ({id}: userNavigator) => {
        return <div>
                {id === 1 &&
                    <Booking/>
                }
                {id === 2 &&
                    <UserPage/>
                }
            {/*user?.role_id !== 2 &&*/}
                {id === 3 &&
                    <Moderator/>
                }
            </div>
    }

    return (
        <div className={isMobile ? contentMobileStyle : contentDesktopStyle}>
            <Row style={{ flexShrink: 0 }}>
                <Col md={4}>
                    <CustomNav appearance="subtle" active={active} onSelect={setActive}/>
                </Col>
            </Row>
            <div style={isMobile ? {padding: 10} : { flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Content id = {active}/>

            </div>
        </div>
    )
}