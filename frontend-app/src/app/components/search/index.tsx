import {DatePicker, Form, Input, InputGroup} from "rsuite";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import React from "react";
import {useForm, Controller} from "react-hook-form";
import {store} from "@/redux/store";
import {setSearchResults} from "@/redux/features/search-slice"
import {useRouter} from "next/navigation"
import {setParams} from "@/redux/features/searchRequest_slice";



export default function Search() {
    const router = useRouter()

    const defaultValues = {
        city_name: '',
        date: new Date(),
    }

    const {handleSubmit, control} = useForm({defaultValues})

    const searchRequest = async (data: any) => {
        try {
            store.dispatch(setParams(data))
            const res = await fetch(`${store.getState().api?.value.url}activities/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'city_name': data.city_name,
                    'date': data.date,
                }),
            })
            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json()

                store.dispatch(setSearchResults(data?.activity))

                router.push('/activities/activitiesSearch')
            } else {
                throw new Error("Received non-JSON response")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const InputController = ({fieldName, title, type}: any) => {
        return (
            <Controller
                name={fieldName}
                control={control}
                render={({field}) => (
                    <InputGroup inside>
                        <Input
                            name={fieldName}
                            id={field.name}
                            value={field.value}
                            placeholder={title}
                            onChange={value => field.onChange(value)}
                            type={type}
                        />
                        <DateController
                            fieldName={'date'}
                            title={'Когда?'}
                            type={'date'}
                        />
                        <InputGroup.Button type="submit" style={{height:'100%'}}>
                            <SearchOutlinedIcon />
                        </InputGroup.Button>
                    </InputGroup>
                )}
            />
        )
    }

    const DateController = ({fieldName, title}: any) => {
        return (
            <Controller
                name={fieldName}
                control={control}
                render={({field}) => (
                    <DatePicker
                        oneTap
                        name={fieldName}
                        id={field.name}
                        value={field.value}
                        placeholder={title}
                        onChange={value => field.onChange(value)}
                    />
                )}
            />
        )
    }

    const onSubmit = handleSubmit((data) => {
        searchRequest(data)
    })

    return (
        <>
            <Form onSubmit={
                (formValue, event) =>
                    onSubmit(event)
            }
                  style={{display: 'flex', flexDirection: 'row'}}
            >
                <InputController
                    fieldName={'city_name'}
                    title={'Какой город?'}
                    type={'text'}
                />
            </Form>
        </>
    )
}