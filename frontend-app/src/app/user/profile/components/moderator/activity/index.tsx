import {Form, Button, InputGroup, InputPicker, useToaster} from "rsuite"
import {Controller, useForm} from "react-hook-form"
import PersonIcon from "@mui/icons-material/Person"
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone'
import {authorizationFetch, base_url} from "@/app/config"
import {useState, useEffect} from "react"
import {store} from "@/redux/store";
import Message from "@/app/components/activity_Info/message"


export default function index() {
    const [guides, setGuides] = useState([])
    const [cities, setCities] = useState([])
    const [categories, setCategories] = useState([])
    const toaster = useToaster()
    const {control, handleSubmit, reset} = useForm({
        defaultValues: {
            name: '',
            description: '',
            short_description: '',
            price: 0,
            duration: 0,
            capacity: 0,
            category_id: '',
            city_id: '',
            guide_id: '',

        }
    })

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

                setCategories(
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
    const getCitiesRequest = async () => {
        try {
            const res = await fetch(`${base_url}cities/`, {
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

                setCities(
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
    const getGuidesListRequest = async () => {
        try {
            const res = await fetch(`${base_url}users/guides_list`, {
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

                setGuides(
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
            const res = await fetch(`${base_url}activities/`, {
                method: 'POST',
                headers: authorizationFetch(store.getState().user?.value.accessToken),
                body: JSON.stringify({
                    'name' : data.name,
                    'description' : data.description,
                    'short_description' : data.short_description,
                    'price' : data.price,
                    'capacity' : data.capacity,
                    'duration' : data.duration,
                    'category_id' : String(data.category_id),
                    'city_id' : String(data.city_id),
                    'guide_id' : String(data.guide_id)
                }),
            })
            const contentType = res.headers.get("content-type")
            data = await res.json()

            if (res.ok) {
                toaster.push(Message(`/activities/activity/${data.id}`, 'Активность была создана', 'success'),
                    {placement: 'topStart', duration: 5000})
            }

            if (!res.ok) {
                toaster.push(Message(`/activities/activity/${data.id}`, 'Активность не была создана', 'error'),
                    {placement: 'topStart', duration: 5000})
            }

            reset()
        } catch (e) {
            console.error(e)
        }
    }


    useEffect(() => {
        getCategoryRequest()
        getCitiesRequest()
        getGuidesListRequest()
    },[])

    const InputController = (
        {fieldName, title, type, icon}: any) => {
        return (
            <Controller
                name={fieldName}
                control={control}
                render={({field}) => (
                    <Form.Group controlId={fieldName}>
                        <Form.ControlLabel>{title}</Form.ControlLabel>
                        <InputGroup inside>
                            <Form.Control
                                name={fieldName}
                                id={field.name}
                                value={field.value}
                                type={type}
                                onChange={value => field.onChange(value)}
                            />
                            <InputGroup.Addon>
                                {icon}
                            </InputGroup.Addon>
                        </InputGroup>
                    </Form.Group>
                )}
            />
        )
    }

    const onSubmit = handleSubmit((data) => {
        requestStoreActivity(data)
    })

    return <Form onSubmit={
        (formValue, event) =>
            onSubmit(event)
    }
                 fluid>
        <InputController fieldName={'name'} title={'название'} type={'text'}/>
        <InputController fieldName={'description'} title={'Описание'} type={'text'}/>
        <InputController fieldName={'short_description'} title={'Короткое описание'} type={'text'}/>
        <InputController fieldName={'price'} title={'Цена'} type={'number'} icon={'₽'}/>
        <InputController fieldName={'duration'} title={'продолжительность'} type={'number'}
                         icon={<AccessTimeTwoToneIcon fontSize={'small'} color="primary"/>}/>
        <InputController fieldName={'capacity'} title={'количество мест'} type={'number'}
                         icon={<PersonIcon fontSize={'small'} color="primary"/>}/>

        <Form.Group controlId="category_id">
            <Form.ControlLabel>Выберите категорию</Form.ControlLabel>
            <Controller
                name="category_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <InputPicker
                        data={categories}
                        value={field.value}
                        onChange={field.onChange}
                        block
                    />
                )}
            />
        </Form.Group>

        <Form.Group controlId="city_id">
            <Form.ControlLabel>Выберите город</Form.ControlLabel>
            <Controller
                name="city_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <InputPicker
                        data={cities}
                        value={field.value}
                        onChange={field.onChange}
                        block
                    />
                )}
            />
        </Form.Group>

        <Form.Group controlId="guide_id">
            <Form.ControlLabel>Выберите гида</Form.ControlLabel>
            <Controller
                name="guide_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <InputPicker
                        data={guides}
                        value={field.value}
                        onChange={field.onChange}
                        block
                    />
                )}
            />
        </Form.Group>

        <Button appearance="primary" type={'submit'} block> Создать </Button>
    </Form>
}