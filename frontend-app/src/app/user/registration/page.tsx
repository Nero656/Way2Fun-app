'use client'
import {Form, Panel, ButtonToolbar, Button, Input, InputGroup, InputNumber} from 'rsuite';
import React from "react";
import Link from "next/link"

const Textarea = React.forwardRef(
    (props, ref) =>
        <Input {...props} as="textarea" ref={ref}/>
);

export default function Registration() {
    return (
        <Panel header="Регистрация" shaded>
            <Form  fluid>
                <Form.Group controlId="name">
                    <Form.ControlLabel>Имя</Form.ControlLabel>
                    <Form.Control name="name"/>
                </Form.Group>
                <Form.Group controlId="telephone">
                    <Form.ControlLabel>Номер телефона</Form.ControlLabel>
                    <Form.Control name="telephone" type="telephone"/>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.ControlLabel>Email</Form.ControlLabel>
                    <Form.Control name="email" type="email"/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.ControlLabel>Пароль</Form.ControlLabel>
                    <Form.Control name="password" type="password" autoComplete="off"/>
                </Form.Group>

                <Form.Group controlId="password_repit">
                    <Form.ControlLabel>Подтверждение пароля</Form.ControlLabel>
                    <Form.Control name="password" type="password" autoComplete="off"/>
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary">Зарегистрироваться</Button>
                        <Link href = {'/user/auth'}>
                        <Button appearance="ghost">Уже есть аккаунт</Button>
                        </Link>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </Panel>
    )
}