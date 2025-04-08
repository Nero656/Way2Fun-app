import {Button, Form, Modal, Schema} from "rsuite";
import {base_url} from "@/app/config";
import {store} from "@/redux/store";
import {clear} from "@/redux/features/user-cart";
import {Controller, useForm} from "react-hook-form";
import {useState} from "react"
import {useRouter} from "next/navigation"
import {css} from "@emotion/css"

const {StringType} = Schema.Types

const formStyle = css`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    gap: 10px;
    grid-template-areas: 
    "email email email"
    "cardNumber cardNumber cardNumber"
    "expiryDate cvv ."
    "cardHolder cardHolder cardHolder";
`

interface props {
    onOpen: boolean,
    onClose: () => void
}

export default function index({onOpen, onClose}: props) {
    const router = useRouter()
    const {control, handleSubmit} = useForm(
        {
            defaultValues: {
                email: '',
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                cardHolder: '',
            }
        }
    )

    const InputController = (
        {fieldName, title, type, placeholder}: any) => {
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
                                placeholder={placeholder}
                                onChange={value => field.onChange(value)}
                                type={type}

                            />
                        </Form.Group>
                    </Form.Group>
                )}
            />
        )
    }

    const model = Schema.Model({
        email: StringType()
            .isEmail('Email должен быть действительным')
            .isRequired('Email обязательно должен быть заполнен'),
        cardHolder: StringType()
            .isRequired('Имя владельца карты обязательно'),
        cardNumber: StringType()
            .pattern(/^[0-9]{16}$/, 'Введите 16-значный номер карты')
            .isRequired('Номер карты обязателен'),
        expiryDate: StringType()
            .pattern(/^(0[1-9]|1[0-2])\/(\d{2})$/, 'Формат MM/YY')
            .isRequired('Срок действия обязателен'),
        cvv: StringType()
            .pattern(/^[0-9]{3,4}$/, 'Введите 3-4 цифры')
            .isRequired('CVV обязателен')
    })

    const onSubmit = handleSubmit(async () => {
        try {
            await fetch(`${base_url}bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'bookings': store.getState().cart?.products.map(product => {
                        const bookingDate = product.selected.toString()
                        const [date, time] = bookingDate.split(" ") // Разделяем дату и время
                        return {
                            date: date,
                            time: time,
                            user_id: store.getState().user?.value.user.id,
                            activity_id: product.activity.id
                        };
                    }),
                }),
            })
            store.dispatch(clear())
            router.push('user/profile')
        } catch (e) {
            console.error(e)
        }
    })

    return <Modal open={onOpen} onClose={onClose}>
        <Form onSubmit={
            (_formValue, event) =>
                onSubmit(event)
        }
              model={model}
              fluid>

            <Modal.Header>
                <Modal.Title>Оплата</Modal.Title>
            </Modal.Header>
            <Modal.Body className={formStyle}>
                    <span style={{gridArea: 'email'}}>
                        <InputController
                            fieldName={'email'}
                            title={'Email'}
                            placeholder={'email@email.com'}
                            type={'text'}
                            patternRule={{
                                value: /\S+@\S+\.\S+/,
                                message: 'Не верный email',
                                required: 'Email обязателен'
                            }}
                        />
                    </span>

                <span style={{gridArea: 'cardNumber'}}>
                        <InputController
                            fieldName={'cardNumber'}
                            title={'Номер карты'}
                            type={'text'}
                            placeholder={'0000 0000 0000 0000'}
                            patternRule={{
                                value: /^[0-9]{16}$/,
                                message: 'Введите 16-значный номер карты',
                                required: 'Номер карты обязателен'
                            }}

                        />
                    </span>

                <span style={{gridArea: 'expiryDate'}}>
                        <InputController
                            fieldName={'expiryDate'}
                            title={'(MM/YY)'}
                            placeholder={'MM/YY'}
                            type={'text'}
                            patternRule={{
                                value: /^(0[1-9]|1[0-2])\/(\d{2})$/,
                                message: 'Формат MM/YY',
                                required: 'Срок действия обязателен',
                            }}
                        />
                    </span>

                <span style={{gridArea: 'cvv'}}>
                        <InputController
                            fieldName={'cvv'}
                            title={'CVV'}
                            placeholder={'000'}
                            type={'password'}
                            patternRule={{
                                value: /^[0-9]{3,4}$/,
                                message: 'Введите 3-4 цифры',
                                required: 'CVV обязателен'
                            }}
                        />
                    </span>

                <span style={{gridArea: 'cardHolder'}}>
                        <InputController
                            fieldName={'cardHolder'}
                            title={'Имя владельца карты'}
                            placeholder={'Ivan Ivanov'}
                            type={'text'}
                            patternRule={{
                                required: 'Имя владельца карты обязательно'
                            }}
                        />
                    </span>
            </Modal.Body>
            <Modal.Footer>
                <Button type={'submit'} appearance="primary">
                    Купить
                </Button>
                <Button onClick={onClose} appearance="subtle">
                    Отмена
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
}