import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {activityItem as FavoriteState} from "@/app/components/activity/types"

interface FavoriteList {
    products: FavoriteState[]
}

const initialState: FavoriteList = {
    products: []
}

export const favorite = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<FavoriteState>) => {
            state.products.push(action.payload)
        },

        destroy: (state, action: PayloadAction<{ id: number }>) => {
            state.products.splice(action.payload.id, 1)
        },

        clear: () => {
            return initialState
        },
    }
})

export const { add, destroy, clear } = favorite.actions
export default favorite.reducer