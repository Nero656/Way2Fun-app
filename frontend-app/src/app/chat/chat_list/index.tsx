'use client'
import {useState, useEffect, useRef} from "react"
import ChatItem from './chat_item'
import {base_url, authorizationFetch} from "@/app/config"
import {store} from "@/redux/store"
import {List} from "rsuite"
import {format} from "date-fns"
import {css} from "@emotion/css"
import {ru} from "date-fns/locale"
import {echo} from "@/app/echo";

type chat = {
    id: number
    user_id: number,
    guide_id: number,
    user: {
        name: string,
    }
    guide: {
        name: string,
    }
    latest_message: {
        message: string,
        created_at: string,
    } | null
}

interface ActiveChat {
    activeChat : {
        activeChatId: number | null,
        setActiveChat: (id: number) => void
    }
}

const bodyStyle = css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
`

export default function index({activeChat}: ActiveChat) {
    const [chatList, setChatList] = useState<chat[]>([])

    const getChatList = async () => {
        const res = await fetch(`${base_url}chat/${store.getState().user?.value.user.id}`, {
            method: 'GET',
            headers: authorizationFetch(store.getState().user?.value.accessToken)
        })
        const data = await res.json();
        setChatList(data)
    }



    const setFirstChatActive = () => {
        if (chatList.length > 0) {
            activeChat.setActiveChat(chatList[0].id);
        }
    }

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // const connectChatChannel = () => {
    //     echo.channel(`chat.${store.getState().user?.value.user.id}`)
    //         .listen(".chat.list.event", (newMessage: chat) => {
    //         setChatList((prevMessages) => [...prevMessages, newMessage])
    //     }).error((error: any) => {
    //         console.log("Error connecting to channel:", error);
    //     });
    // }

    // useEffect(() => {
    //     // connectChatChannel()
    //     return () => {
    //         echo.channel(`chat.${store.getState().user?.value.user.id}`).stopListening(".chat_event")
    //         echo.leave(`chat.${store.getState().user?.value.user.id}`)
    //     }
    // }, [chatList])

    useEffect(() => {
        getChatList()
        setFirstChatActive
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [chatList]);


    return <List style={{gridArea: 'chat_list', padding: '10px'}}>
        {chatList.map((item, index) => (
            <span key={index} onClick={() => {
                activeChat.setActiveChat(item.id)
            }}>
                <ChatItem props={
                    {
                        active: item.id === activeChat.activeChatId,
                        user_id: item?.user_id,
                        guide_id: item?.guide_id,
                        username: item?.user_id === store.getState().user?.value.user.id ?
                            item.guide.name : item.user.name,
                        last_message: item.latest_message !== null ? item.latest_message.message : 'сообщений ещё нет',
                        created_at: item.latest_message !== null ?
                            format(new Date(item.latest_message.created_at), "dd.MM.yyyy HH:mm", {locale: ru}) :
                            ''
                    }
                }
                />
            </span>
        ))}
    </List>
}