

import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type InitialState = {
    value: ThemeState
}

type ThemeState = {
    theme: boolean
}

const initialState = {
    value : {
        theme: true,
    } as ThemeState
} as InitialState

export const theme = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        themeDefault: () => {
            return initialState
        },

        themeAction: (state, action: PayloadAction<{theme: boolean}>) => {
            state.value.theme = !state.value.theme
        }

    }
})

export const { themeDefault, themeAction } = theme.actions
export default theme.reducer