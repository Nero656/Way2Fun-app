'use client'
import {useForm, Controller} from 'react-hook-form'
import {Form, Panel, ButtonToolbar, Button, VStack, Schema, Notification, useToaster,} from 'rsuite'
import React, {useEffect, useState} from "react"
import Link from "next/link"
import {store} from "@/redux/store";

export default function Registration() {
    const [isMobile, setIsMobile] = useState(false)
    const toaster = useToaster()

    const defaultValues = {
        username: '',
        telephone: '',
        email: '',
        password: '',
        repeatPassword: ''
    }

    const {control, handleSubmit} = useForm({defaultValues})

    const {StringType, NumberType} = Schema.Types;
    const model = Schema.Model({
        username: StringType().isRequired(''),
        telephone: StringType().isRequired(''),
        email: StringType().isEmail('Email должен быть действительным')
            .isRequired('Email обязательно должен быть заполнен'),
        password: StringType().isRequired('Пароль обязательно должен быть заполнен'),
        repeatPassword: StringType().equalTo('password', 'Пароли обязательно должны совпадать')
    });

    const requestRegistration = async (data: any) => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}users/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name' : data.username,
                    'telephone' : data.telephone,
                    'email' : data.email,
                    'password' : data.password,
                }),
            })

            const contentType = res.headers.get("content-type")



            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()

                location.replace('/user/auth')
            } else {
                toaster.push(message(), {placement: 'topStart', duration: 5000})
                throw new Error("Received non-JSON response")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const message = () => (
        <Notification type="error" header="Ошибка регистрации" closable>
            <strong>Что-то пошло не так</strong>
        </Notification>
    );

    const onSubmit = handleSubmit((data) => {
        if (data.password !== data.repeatPassword || data.password.length === 0){
            console.log('Пароли не совпадают')
        }else{
            requestRegistration(data)
        }
    })

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
    }, [])

    const InputController = ({fieldName, title, type} : any) => {
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
                                type = {type}
                            />
                        </Form.Group>
                    </Form.Group>
                )}
            />
        )
    }

    return (
        <div style={isMobile ? {
            padding: 10
        } : {
            display: 'flex',
            marginTop: 25,
            justifyContent: 'center',
        }}>
            <Panel
                header="Регистрация"
                shaded
                style={isMobile ? {
                    width: 'auto'
                } : {
                    width: 500
                }}>
                <Form
                    onSubmit={
                        (formValue, event) =>
                            onSubmit(event)
                    }
                    model={model}
                    fluid>

                    <InputController fieldName = {'username'} title={'Имя'} type = {'name'}/>
                    <InputController fieldName = {'telephone'} title={'Телефон'} type = {'telephone'}/>
                    <InputController fieldName = {'email'} title={'email'} type = {'email'}/>
                    <InputController fieldName = {'password'} title={'Пароль'} type = {'password'}/>
                    <InputController fieldName = {'repeatPassword'} title={'Повторите пароль'} type = {'password'}/>

                    <Form.Group>
                        <VStack spacing={10}>
                            <ButtonToolbar>
                                <Button appearance="primary" type={'submit'}> Зарегистрироваться </Button>
                                <Link href={`/user/auth`}>
                                    <Button appearance="ghost">Уже есть аккаунт</Button>
                                </Link>
                            </ButtonToolbar>
                        </VStack>
                    </Form.Group>
                </Form>
            </Panel>
        </div>
    )
}