import {Button, DatePicker, Form, useToaster, InputPicker} from "rsuite"
import {Controller, useForm} from "react-hook-form"
import {useEffect, useState} from "react"
import {authorizationFetch, base_url} from "@/app/config"
import Message from "@/app/components/activity_Info/message";
import {store} from "@/redux/store";

export default function index(){
    const [category, setCategory] = useState([])
    const [activities, setActivities] = useState([])
    const toaster = useToaster()
    const {control, handleSubmit, reset, watch} = useForm({
        defaultValues: {
            event_date: '',
            category_id: '',
            activity_id: ''
        }
    })
    const categoryId: number = Number(watch("category_id")) || 0
    const activityId: number = Number(watch("activity_id")) || 0

    const getCategoryRequest = async () => {
        try {
            const res = await fetch(`${base_url}categories/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`)
            }

            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()

                setCategory(
                    data.map((
                        item: { name: string, id: number }) => (
                            {label: item.name, value: item.id})
                    ))
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }
    const getActivityRequest = async (id: number) => {
        try {
            const res = await fetch(`${base_url}activities/select/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`)
            }

            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()

                setActivities(
                    data.map((
                        item: { name: string; id: number; }) =>
                        ({label: item.name, value: item.id})))
            } else {
                throw new Error("Received non-JSON response")
            }

        } catch (e) {
            console.error(e)
        }
    }
    const requestStoreActivity = async (data: any) => {
        try {
            const res = await fetch(`${base_url}activities_dates/`, {
                method: 'POST',
                headers: authorizationFetch(store.getState().user?.value.accessToken),
                body: JSON.stringify({
                    'event_date' : data.event_date,
                    'activity_id' : String(data.activity_id),
                }),
            })
            const contentType = res.headers.get("content-type")
            if (res.ok) {
                toaster.push(
                    Message(`/activities/activity/${data.activity_id}`,
                        'Дата была добавлена была добавленная', 'success'),
                    {placement: 'topStart', duration: 5000})
            }

            if (!res.ok) {
                toaster.push(Message(`/activities/activity/${data.id}`,
                        'Дата не была добавлена', 'error'),
                    {placement: 'topStart', duration: 5000})
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (!categoryId) return
        getActivityRequest(categoryId);
    }, [categoryId])

    useEffect(() => {
        getCategoryRequest()
    }, []);


    const DateController = ({fieldName, title}: any) => {
        return (
            <Controller
                name={'event_date'}
                control={control}
                render={({field}) => (
                    <DatePicker
                        block
                        format="yyyy-MM-dd HH:mm"
                        name={'event_date'}
                        id={field.name}
                        value={field.value ? new Date(field.value) : null}
                        placeholder={title}
                        disabled={!activityId}
                        onChange={value => field.onChange(value)}
                    />
                )}
            />
        )
    }

    const onSubmit = handleSubmit((data) => {
        requestStoreActivity(data)
        reset()
    })

    return <Form onSubmit={
        (formValue, event) =>
            onSubmit(event)
    } fluid>



        <Form.Group controlId="category_id">
            <Form.ControlLabel>Выберите категорию:</Form.ControlLabel>
            <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                    <InputPicker
                        data={category}
                        value={field.value}
                        onChange={field.onChange}
                        block
                    />
                )}
            />
        </Form.Group>

        <Form.Group controlId="activity_id">
            <Form.ControlLabel>Выберите активность:</Form.ControlLabel>
            <Controller
                name="activity_id"
                control={control}
                render={({ field }) => (
                    <InputPicker
                        data={activities}
                        value={field.value}
                        onChange={field.onChange}
                        block
                        disabled={!categoryId}
                    />
                )}
            />
        </Form.Group>

        <Form.Group controlId="event_date">
            <Form.ControlLabel>Введите дату:</Form.ControlLabel>
            <DateController name={'event_date'} title={'дата'} type="date" />
        </Form.Group>

        <Button appearance="primary" type={'submit'} block> Создать </Button>
    </Form>
}