'use client'
import { Notification, useToaster, ButtonToolbar, SelectPicker, Button } from 'rsuite'
import {useEffect, useState} from 'react'
import {echo} from "@/app/echo"

// todo сделать оповещение о новом сообщении
export default function index() {
    const [messages, setMessages] = useState([])

    // const connectChatChannel = () => {
    //     echo.channel(`chat.${chat_Id}`).listen(".chat.event", (newMessage: MessageInterface) => {
    //         setMessages((prevMessages) => [...prevMessages, newMessage])
    //     }).error((error: any) => {
    //         console.log("Error connecting to channel:", error);
    //     });
    // }
    //
    // useEffect(() => {
    //     connectChatChannel()
    //     return () => {
    //         echo.channel(`chat.${chat_Id}`).stopListening(".chat_event")
    //         echo.leave(`chat.${chat_Id}`)
    //     }
    // }, [chat_Id])

    const message = (
        <Notification type={'info'} header={``} closable>
            <p>You have a message, please check it.</p>
            <ButtonToolbar>
                <Button appearance="primary">Ok</Button>
            </ButtonToolbar>
        </Notification>
    )



    return <div> </div>
}