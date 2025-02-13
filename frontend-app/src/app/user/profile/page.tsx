'use client'
import {Nav, Row, Col} from "rsuite"
import UserPage from '@/app/user/profile/components/user_page'
import Booking from '@/app/user/profile/components/booking'
import {useEffect, useState} from "react"
import {css} from '@emotion/css'

const contentDesktopStyle = css`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    padding: 2rem 2rem 0 0;
`

const contentMobileStyle = css`
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
`


export default function page() {
    const [active, setActive] = useState(1)
    const [isMobile, setIsMobile] = useState(window.innerWidth >= 726)

    const handleResize = () => {
        setIsMobile(window.innerWidth >= 726)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const CustomNav = ({active, onSelect, ...props}: any) => {
        return (
            <Nav
                {...props}
                vertical={isMobile}
                activeKey={active}
                onSelect={onSelect}
                style={isMobile ? {width: 100} : {}}
            >
                <Nav.Item eventKey={1}>Бронь</Nav.Item>
                <Nav.Item eventKey={2}>Профиль</Nav.Item>
            </Nav>
        )
    }

    const Content = ({id}: any) => {
        return (
            <div>
                {id === 1 &&
                    <Booking/>
                }

                {id === 2 &&
                    <UserPage/>
                }
            </div>
        )
    }

    return (
        <div className={isMobile ? contentDesktopStyle : contentMobileStyle}>
            <Row>
                <Col md={4}>
                    <CustomNav appearance="subtle" active={active} onSelect={setActive}/>
                </Col>
            </Row>
            <div style={isMobile ? {marginLeft: 100} : {}}>
                    <Content id={active}/>
            </div>
        </div>
    )
}