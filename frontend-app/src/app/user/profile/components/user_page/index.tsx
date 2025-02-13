'use client'
import {Panel, StatGroup, Stat, HStack} from "rsuite"
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import CallIcon from '@mui/icons-material/Call'
import {store} from "@/redux/store"
import {useState, useEffect} from "react"



export default function userPage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 880)

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 880)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (<Panel header="Профиль" shaded>
        <StatGroup columns={isMobile ? 1: 4}>
            <Stat bordered icon={<PersonIcon color="primary" style={{ fontSize: '2rem' }}/>}>
                <Stat.Label>Имя:</Stat.Label>
                <HStack spacing={10}>
                    <Stat.Value>{store.getState().user?.value.user.name}</Stat.Value>
                </HStack>
            </Stat>
            <Stat bordered icon={<EmailIcon color="primary" style={{ fontSize: '2rem' }}/>}>
                <Stat.Label>Email:</Stat.Label>
                <HStack spacing={10}>
                    <Stat.Value>{store.getState().user?.value.user.email}</Stat.Value>
                </HStack>
            </Stat>
            <Stat bordered icon={<CallIcon color="primary" style={{ fontSize: '2rem'}}/>}>
                <Stat.Label>Телефон:</Stat.Label>
                <HStack spacing={10}>
                    <Stat.Value>+{store.getState().user?.value.user.telephone}</Stat.Value>
                </HStack>
            </Stat>
        </StatGroup>
    </Panel>)
}