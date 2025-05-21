import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    value: PathState
}
type PathState = {
    url: string
    image_url: string
}


const initialState = {
    value : {
        url: `http://192.168.1.5:81/api/`,
        image_url: `http://192.168.1.5:81`
    } as PathState
} as InitialState

export const api = createSlice({
    name: 'url',
    initialState,
    reducers: {
        getPath: (state, action: PayloadAction<string>) => {return initialState}
    }
})

export const { getPath } = api.actions
export default api.reducer