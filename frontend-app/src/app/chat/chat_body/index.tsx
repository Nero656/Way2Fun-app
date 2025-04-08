'use client'
import React, {useState, useRef, useEffect} from 'react'
import {authorizationFetch, base_url} from "@/app/config"
import {Form, Input, InputGroup} from "rsuite"
import {echo} from "@/app/echo"
import {store} from "@/redux/store"
import {Controller, useForm} from "react-hook-form"
import Message from "./message";
import {css} from "@emotion/css"
import SendIcon from '@mui/icons-material/Send'

interface MessageInterface {
    sender: {
        id: number,
        name: string,
        email: string,
    };
    message: string;
    created_at: string;
}

interface ChatProps {
    params: {
        userId: number;
        guideId: number;
    }
}

const charBody = css`
    max-height: 60vh;
    min-height: 60vh;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.05);
    overflow: hidden;
`


const bodyStyle = css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
`


export default function index({ chat_Id }: { chat_Id: number }) {
    const [messages, setMessages] = useState<MessageInterface[]>([])
    const {control, handleSubmit, reset} = useForm({defaultValues: {message: ''}})
    const messagesEndRef = useRef<HTMLDivElement | null>(null);



    useEffect(() => {
        if (chat_Id) fetchMessages(chat_Id)
    }, [chat_Id])

    async function fetchMessages(chatId: number) {
        const res = await fetch(`${base_url}messages/${chatId}`, {
            headers: authorizationFetch(store.getState().user?.value.accessToken),
        });
        const data = await res.json()
        setMessages(data)
    }

    const sendMessage = async (newMessage: string) => {
        const res = await fetch(`${base_url}message/${chat_Id}`, {
            method: 'POST',
            headers: authorizationFetch(store.getState().user?.value.accessToken),
            body: JSON.stringify({
                sender_id: store.getState().user?.value.user.id,
                message: newMessage
            })
        })

        if (res.ok) {
            fetchMessages(chat_Id)
        }
    }

    const connectChatChannel = () => {
        echo.channel(`chat.${chat_Id}`).listen(".chat.event", (newMessage: MessageInterface) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
        }).error((error: any) => {
            console.log("Error connecting to channel:", error);
        });
    }

    useEffect(() => {
        connectChatChannel()
        return () => {
            echo.channel(`chat.${chat_Id}`).stopListening(".chat_event")
            echo.leave(`chat.${chat_Id}`)
        }
    }, [chat_Id])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const InputController = (
        {fieldName, placeholder, type}: any) => {
        return (
            <Controller
                name={fieldName}
                control={control}
                render={({field}) => (
                    <Form.Group>
                        <InputGroup>
                            <Input
                                name={fieldName}
                                id={field.name}
                                value={field.value}
                                placeholder={placeholder}
                                onChange={value => field.onChange(value)}
                                type={type}
                            />
                            <InputGroup.Button type="submit">
                                <SendIcon/>
                            </InputGroup.Button>
                        </InputGroup>
                    </Form.Group>
                )}
            />
        )
    }

    const onSubmit = handleSubmit((data) => {
        sendMessage(data.message)
        reset()
    })

    return (
        <div style={{gridArea: 'chat_body'}}>
            <div className={charBody}>
                <div className={bodyStyle}>
                    {messages.map((item, index) => (
                        <Message props={{
                            message: item.message,
                            senderName: item.sender.name,
                            email: item.sender.email,
                            created_at: item.created_at,
                            userId: item.sender.id
                        }} key={index}/>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
            </div>



            <Form onSubmit={
                (formValue, event) =>
                    onSubmit(event)
            } fluid style={{padding: '10px'}}>
                <InputController placeholder={'Введите сообщение'} fieldName={'message'} value={''}/>
            </Form>
        </div>
    )
}