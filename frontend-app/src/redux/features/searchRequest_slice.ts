import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    value: requestParams
}
type requestParams = {
    city_name: string,
    date: Date
}


const initialState = {
    value : {
        city_name: ``,
        date: new Date(),
    } as requestParams
} as InitialState

export const searchRequest = createSlice({
    name: 'searchRequest',
    initialState,
    reducers: {
        getParams: (state, action: PayloadAction<string>) => {return initialState},
        setParams: (state, action: PayloadAction<{
            city_name: string,
            date: Date
        }>)=> {
            state.value.city_name = action.payload.city_name
            state.value.date = action.payload.date
        }
    }
})

export const { getParams, setParams } = searchRequest.actions
export default searchRequest.reducer