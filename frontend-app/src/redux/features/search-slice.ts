import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState<T> {
    current_page: number,
    results: T[],
    first_page_url: string,
    last_page: number,
    last_page_url: string,
    links: T[],
    from: number,
    next_page_url: string,
    path: string,
    per_page: number,
    prev_page_url: string,
    to: number,
}

const initialState: SearchState<unknown> = {
    current_page: 1,
    results: [],
    first_page_url: '',
    last_page: 5,
    last_page_url: '',
    links: [],
    from: 1,
    next_page_url: '',
    path: '',
    per_page: 1,
    prev_page_url: '',
    to: 15,
}

const search = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchResults: <T>(state: SearchState<T>, action: PayloadAction<{
            current_page: number,
            data: T[],
            first_page_url: string,
            last_page: number,
            last_page_url: string,
            links: T[],
            from: number,
            next_page_url: string,
            path: string,
            per_page: number,
            prev_page_url: string,
            to: number,
        }>) => {
            state.current_page = action.payload.current_page
            state.results = action.payload.data
            state.first_page_url = action.payload.first_page_url
            state.last_page = action.payload.last_page
            state.last_page_url = action.payload.last_page_url
            state.links = action.payload.links
            state.from = action.payload.from
            state.next_page_url = action.payload.next_page_url
            state.path = action.payload.path
            state.per_page = action.payload.per_page
            state.to = action.payload.to
        },
        clearSearchResults: <T>(state: SearchState<T>) => {
            state.results = []
        }
    },
});

export const { setSearchResults, clearSearchResults } = search.actions
export default search.reducer
