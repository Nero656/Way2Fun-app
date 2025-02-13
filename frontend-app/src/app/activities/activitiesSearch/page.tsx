'use client'
import {
    Panel,
    CardGroup,
    Text,
    HStack,
    Pagination,
    Heading
} from 'rsuite'
import ActivityItem from '@/app/components/activity'
import {useSelector} from 'react-redux'
import React, {useState, useEffect} from "react"
import {RootState} from "@/redux/store"
import {store} from "@/redux/store"
import {setSearchResults} from "@/redux/features/search-slice"
import SearchOffIcon from '@mui/icons-material/SearchOff'
import Link from "next/link";

interface Activity {
    id: number,
    name: string,
    description: string,
    short_description: string,
    price: string,
    duration: number,
    capacity: number,
    created_at: string,
    updated_at: string,
    city: {
        id: number,
        name: string,
        country: string,
        climate: string,
        description: string,
        short_description: string,
    },
    activity_date: {
        id: number,
        activity_id: number,
        event_date: string,
    }[],
    guide: {
        id: number,
        name: string,
        email: string,
        telephone: string,
        email_verified_at: string,
        role_id: number,
    },
    images: {
        img_url: string,
    }
    review: {
        id: number,
        rating: number,
        user_id: number,
        activity_id: number,
        comment: string,
        user: {
            id: number,
            name: string,
            email: string,
            telephone: string,
            email_verified_at: string,
            role_id: number,
        },
    }[],
}

export default function activitiesSearch() {
    const searchResults = useSelector((state: RootState) =>
        state.search?.results as Activity[]
    )
    const [columns, setColumns] = useState(window.innerWidth <= 768 ? 1 : 4);
    const [activePage, setActivePage] = useState(1)

    useEffect(() => {
        const handleResize = () => setColumns(columns);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        pageRequest(activePage)
    }, [activePage])

    const pageRequest = async (page: number) => {
        try {
            const res = await fetch(`${store.getState().api?.value.url}activities/search?page=${page}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'city_name': store.getState().searchRequest.value?.city_name,
                    'date': store.getState().searchRequest.value?.date,
                })
            });
            const contentType = res.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                store.dispatch(setSearchResults(data?.activity));
            } else {
                throw new Error("Received non-JSON response");
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <Panel header={`По вашему запросу найдено: ${searchResults.length}`} >
                {searchResults.length > 0 ?
                    <CardGroup columns={columns}>
                        {searchResults?.map((item, index) => (
                            <ActivityItem key={index} item={item} />
                        ))}
                    </CardGroup> :
                    <span style={{textAlign: "center"}}>
                    <HStack spacing={2} style={{justifyContent: 'center'}}>
                        <SearchOffIcon color={'error'}/>
                        <Heading level={4}>
                            По вашему запросу ничего не найдено!
                        </Heading>
                    </HStack>
                        <Text>
                            <Link href={'/'}>Вернуться на главную</Link>
                        </Text>
                    </span>
                }
            </Panel>
            <Pagination
                prev
                last
                next
                first
                size="sm"
                style={{justifyContent: 'center'}}
                total={store.getState().search.last_page}
                boundaryLinks={true}
                limit = {1}
                maxButtons={5}
                activePage={activePage}
                onChangePage={setActivePage}
            />
        </>
    )
}