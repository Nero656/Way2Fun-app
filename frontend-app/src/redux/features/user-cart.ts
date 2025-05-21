import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {activityItem} from "@/app/components/activity/types"

export interface CartState {
    activity: activityItem
    selected: string | number
    selectedId: number
}

interface CardList {
    products: CartState[]
}

const initialState: CardList = {
    products: []
}

export const cart = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<
                  { activity: activityItem, selected: string | number, selectedId: number }
              >) => {
            state.products.push(
                {
                    activity: action.payload.activity,
                    selected: action.payload.selected,
                    selectedId: action.payload.selectedId
                }
            )
        },

        destroy: (state, action: PayloadAction<{ id: number }>) => {
            state.products.splice(action.payload.id, 1)
        },

        clear: () => {
            return initialState
        }
    }
})

export const {add, destroy, clear} = cart.actions
export default cart.reducer