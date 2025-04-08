'use client'
import {
    Panel,
    CardGroup,
    Pagination,
} from 'rsuite'
import ActivityItem from '@/app/components/activity'
import NoResult from '@/app/components/no_result'
import {useSelector} from 'react-redux'
import React, {useState, useEffect} from "react"
import {RootState} from "@/redux/store"
import {store} from "@/redux/store"
import {base_url, handleResize} from "@/app/config"
import {setSearchResults} from "@/redux/features/search-slice"
import {activityItem} from "@/app/components/activity/types"

export default function activitiesSearch() {
    const searchResults = useSelector((state: RootState) =>
        state.search?.results as activityItem[]
    )
    const [isResolution, setResolution] = useState<number>(handleResize())
    const [activePage, setActivePage] = useState(1)

    useEffect(() => {
        const updateResolution = () => setResolution(handleResize())

        window.addEventListener("resize", updateResolution)
        return () => window.removeEventListener("resize", updateResolution)
    }, [])

    useEffect(() => {
        pageRequest(activePage)
    }, [activePage])

    const pageRequest = async (page: number) => {
        try {
            const res = await fetch(`${base_url}activities/search?page=${page}`, {
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
                    <CardGroup columns={isResolution}>
                        {searchResults?.map((item, index) => (
                            <ActivityItem key={index} item={item} selected={''}/>
                        ))}
                    </CardGroup> :
                    <NoResult/>
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