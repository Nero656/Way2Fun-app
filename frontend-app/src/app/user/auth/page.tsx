'use client'
import {Form, Panel, ButtonToolbar, Button, Input, InputGroup, InputNumber} from 'rsuite';
import React from "react";


export default function Auth(){
    return (
        <Panel header="Авторизация" shaded>
            <Form fluid>
                <Form.Group controlId="email">
                    <Form.ControlLabel>Email</Form.ControlLabel>
                    <Form.Control name="email" type="email"/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.ControlLabel>Пароль</Form.ControlLabel>
                    <Form.Control name="password" type="password" autoComplete="off"/>
                </Form.Group>

                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary">Зарегистрироваться</Button>
                        <Button appearance="ghost">Уже есть аккаунт</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </Panel>
    )
}