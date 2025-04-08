'use client'
import {Panel, StatGroup, Stat, HStack} from "rsuite"
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import CallIcon from '@mui/icons-material/Call'
import {store} from "@/redux/store"
import {useState, useEffect} from "react"
import {handleResize} from "@/app/config"
import {css} from '@emotion/css'
import {useRouter} from 'next/navigation'
import LogoutIcon from '@mui/icons-material/Logout'
import {clear as clearCart} from "@/redux/features/user-cart";
import {clear as clearFavorite} from "@/redux/features/user-favorite";
import {logOut} from "@/redux/features/auth-slice";

const statStyle = (isLogout: boolean) => css`
    cursor: pointer;
    transition-duration: .5s;
    svg{
        font-size: 2rem;
    }
    
    :hover {
        border-color: ${isLogout ? '#e01c1c' : '#1C78E0'};
    }
`

export default function userPage() {
    const [isResolution, setResolution] = useState<number>(handleResize())
    const router = useRouter()

    const handleLogout = () => {
        store.dispatch(logOut())
        location.reload()
    }

    useEffect(() => {
        const updateResolution = () => {
            setResolution(handleResize() === 4 ? 3 : handleResize())
        }
        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])

    return (<Panel header="Профиль">
        <StatGroup columns={isResolution}>
            <Stat bordered className={statStyle(false)} icon={<PersonIcon color="primary"/>} >
                <Stat.Label>Имя:</Stat.Label>
                <HStack spacing={12}>
                    <Stat.Value>{store.getState().user?.value.user.name}</Stat.Value>
                </HStack>
            </Stat>
            <Stat bordered className={statStyle(false)} icon={<EmailIcon color="primary" className={statStyle(false)}/>}>
                <Stat.Label>Email:</Stat.Label>
                <HStack spacing={12}>
                    <Stat.Value>{store.getState().user?.value.user.email}</Stat.Value>
                </HStack>
            </Stat>
            <Stat bordered className={statStyle(false)} icon={<CallIcon color="primary" className={statStyle(false)}/>}>
                <Stat.Label>Телефон:</Stat.Label>
                <HStack spacing={12}>
                    <Stat.Value>+{store.getState().user?.value.user.telephone}</Stat.Value>
                </HStack>
            </Stat>
            <Stat bordered className={statStyle(true)} icon={<LogoutIcon color='error' className={statStyle(true)}/>}>
                <Stat.Label>Телефон:</Stat.Label>
                <HStack spacing={12}
                        onClick={() => {
                    handleLogout()
                    store.dispatch(clearCart())
                    store.dispatch(clearFavorite())
                    router.push('/')
                }}>
                    <Stat.Value>Выйти</Stat.Value>
                </HStack>
            </Stat>
        </StatGroup>
    </Panel>)
}