import {Button, Form, InputPicker, Uploader, useToaster} from "rsuite"
import {Controller, useForm} from "react-hook-form"
import {useEffect, useState} from "react"
import type { FileType } from "rsuite/esm/Uploader"
import {base_url} from "@/app/config"
import Message from "@/app/components/activity_Info/message";


export default function index(){
    const [category, setCategory] = useState([])
    const [activities, setActivities] = useState([])
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null)
    const toaster = useToaster()
    const {control, handleSubmit, reset, watch} = useForm({
        defaultValues: {
            file: '',
            category_id: '',
            activity_id: ''
        }
    })
    const categoryId: number = Number(watch("category_id")) || 0
    const activityId: number = Number(watch("activity_id")) || 0


    const fileList : any = []

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

    const requestStoreActivity = async (activity_id: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append('activity_id', activity_id);
            formData.append('file', file);

            const res = await fetch(`${base_url}image`, {
                method: 'POST',
                body: formData
            })
            const contentType = res.headers.get("content-type")
            if (!res.ok) {
                toaster.push(Message(`/activities/activity/${activity_id}`, 'Изображение было добавлено', 'success'),
                    {placement: 'topStart', duration: 5000})
            }

            if (!res.ok) {
                toaster.push(Message(`/activities/activity/${activity_id}`,
                        'Изображение не было добавлено', 'error'),
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


    const onSubmit = handleSubmit((data) => {
        if (!selectedFile?.blobFile) {
            console.warn("Файл не выбран");
            return;
        }

        requestStoreActivity(data.activity_id, selectedFile?.blobFile)
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

        <Form.Group controlId="file">
            <Form.ControlLabel>Загрузить изображение:</Form.ControlLabel>
            <Uploader
                name="file"
                listType="picture-text"
                disabled={!activityId}
                defaultFileList={fileList}
                fileList={selectedFile ? [selectedFile] : []}
                action="//jsonplaceholder.typicode.com/posts/"
                onChange={(fileList) => {
                    setSelectedFile(fileList?.[0] || null);
                }}
                autoUpload={false}
                removable
                renderFileInfo={(file, fileElement) => {
                    return (
                        <>
                            <span>File Name: {file.name}</span>
                            <p>File URL: {file.url}</p>
                        </>
                    );
                }}
            >
                <Button>Выберите изображение</Button>
            </Uploader>
        </Form.Group>

        <Button appearance="primary" type={'submit'} block> Создать </Button>
    </Form>
}