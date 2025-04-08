'use client'
import {Panel, Button, IconButton, Drawer, ButtonToolbar, Text} from "rsuite"
import ChatBody from './chat_body/index'
import ChatList from './chat_list/index'
import {css} from "@emotion/css"
import {useState, useEffect} from "react"
import {useSearchParams} from 'next/navigation'
import {handleResizeMin, resolutionColumns} from "@/app/config"
import MenuIcon from '@mui/icons-material/Menu'

const chatStyle = (columns: number) => css`
    display: grid;
    grid-template-columns: ${columns === 1 ? "1fr" : "0.25fr 1px 1fr"};
    grid-template-areas: ${columns === 1 ? "'chat_body'" : "'chat_list . chat_body'"};
    gap: ${columns === 1 ? "10px" : "0"};
`

const emptyStyle = css`
    max-height: 60vh;
    min-height: 60vh;
    text-align: center;
    margin: auto;
    width: 70vw;
`

export default function Page() {
    const router = useSearchParams()
    const id = router.get("id")
    const [activeChat, setActiveChat] = useState<number | null>(null)
    const [columns, setColumns] = useState(handleResizeMin(1270) ? 1 : 2)
    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {
        if (id) {
            setActiveChat(Number(id))
        }
    }, [id])

    useEffect(() => {
        const updateColumns = () => setColumns(handleResizeMin(1270) ? 1 : 2)
        window.addEventListener("resize", updateColumns)
        return () => window.removeEventListener("resize", updateColumns)
    }, [])

    const handleDrawerOpen = () => {
        setDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setDrawerOpen(false)
    }

    return (
        <div style={{padding: columns === 1 ? "10px" : "20px 100px 0 100px"}}>
            <Panel
                header={<div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                    {columns === resolutionColumns.mobile && (
                        <IconButton
                            appearance="subtle"
                            icon={<MenuIcon/>}
                            onClick={handleDrawerOpen}
                            size="sm"
                        />
                    )}
                    <h4>Чаты</h4>
                </div>}
                bordered
                bodyFill
            >
                <div className={chatStyle(columns)}>
                    {columns !== resolutionColumns.mobile && (
                        <ChatList activeChat={{activeChatId: activeChat, setActiveChat}}/>
                    )}
                    {activeChat !== null ? (
                        <ChatBody chat_Id={activeChat}/>
                    ) : (
                        <Text className={emptyStyle} muted={true}>
                            Выберите чат
                        </Text>
                    )}
                </div>
            </Panel>

            {/* Шторка для мобильных экранов */}
            <Drawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                placement="left"
                size={250}
            >
                <Drawer.Header>
                    <Drawer.Title>Выберите чат</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={handleDrawerClose}>Закрыть</Button>
                    </Drawer.Actions>
                </Drawer.Header>
                <div onClick={handleDrawerClose}>
                    <ChatList activeChat={{activeChatId: activeChat, setActiveChat}}/>
                </div>
            </Drawer>
        </div>
    )
}