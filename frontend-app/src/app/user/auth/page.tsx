'use client'
import {Form, Panel, useToaster, Button, VStack, Schema, Notification} from 'rsuite';
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {store} from "@/redux/store";
import { logIn } from '@/redux/features/auth-slice'
import {useRouter} from "next/navigation";

type responseType = {
    access_token?: string,
    error?: string
}

export default function Auth() {
    const [isMobile, setIsMobile] = useState(false)
    const {control, handleSubmit} = useForm({defaultValues: {email: '', password: ''}})
    const toaster = useToaster()
    const router = useRouter()

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
    }, [])

    const {StringType, NumberType} = Schema.Types;
    const model = Schema.Model({
        email: StringType().isEmail('Email должен быть действительным')
            .isRequired('Email обязательно должен быть заполнен'),
        password: StringType().isRequired('Пароль обязательно должен быть заполнен')
    })

    const message = (error: string | undefined) => (
        <Notification type="error" header="Ошибка авторизации" closable>
            <strong>{error}</strong>
        </Notification>
    );

    const requestLogin = async (data: any) => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}users/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': data.email,
                    'password': data.password,
                }),
            })

            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()
                // setResponse(data)
                if (res.status !== 200) {
                    toaster.push(message(data?.error), {placement: 'topStart', duration: 5000})
                }
                if (res.status === 200) {
                    await requestGetCurrentUser(data?.access_token)
                }
            } else {
                throw new Error("Received non-JSON response")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const requestGetCurrentUser = async (auth_token: string) => {
        console.log(auth_token)
        try {
            const res = await fetch(`${store.getState().api?.value.url}users/auth/current_user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth_token}`
                }
            })

            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()
                if (res.status !== 200) {
                    toaster.push(message(data?.error), {placement: 'topStart', duration: 5000})
                }
                if (res.status === 200) {
                    store.dispatch(logIn({accessToken: auth_token, user: data}))
                    // router.refresh()
                    // router.push(`/`)
                    location.replace('/')
                }
            } else {
                throw new Error("Received non-JSON response")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const InputController = (
        {fieldName, title, type}: any) => {
        return (
            <Controller
                name={fieldName}
                control={control}
                render={({field}) => (
                    <Form.Group>
                        <Form.Group controlId={fieldName}>
                            <Form.ControlLabel>{title}</Form.ControlLabel>
                            <Form.Control
                                name={fieldName}
                                id={field.name}
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                type={type}

                            />
                        </Form.Group>
                    </Form.Group>
                )}
            />
        )
    }

    const onSubmit = handleSubmit((data) => {
        requestLogin(data)
    })

    return (
        <>
            <div style={isMobile ? {
                padding: 10
            } : {
                display: 'flex',
                marginTop: 25,
                justifyContent: 'center',
            }}>

                <Panel
                    header="Авторизация"
                    shaded
                    style={isMobile ? {
                        width: 'auto'
                    } : {
                        width: 500
                    }}>
                    <Form onSubmit={
                        (formValue, event) =>
                            onSubmit(event)
                    }
                          model={model}
                          fluid>
                        <InputController
                            fieldName={'email'}
                            title={'Email'}
                            type={'text'}
                            patternRule={
                                {value: /\S+@\S+\.\S+/, message: 'Не верный email', required: 'Email обязателен'}
                            }
                        />
                        <InputController fieldName={'password'} title={'Пароль'} type={'password'}/>
                        <VStack spacing={10}>
                            <Button appearance="primary" block type={'submit'}>
                                Войти
                            </Button>
                            {/*<a href="#">Забыли пароль?</a>*/}
                        </VStack>
                    </Form>
                </Panel>
            </div>
        </>
    )
}