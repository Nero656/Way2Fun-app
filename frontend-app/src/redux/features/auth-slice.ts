import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type InitialState = {
    value: AuthState
}

type AuthState = {
    accessToken: string,
    user: {
        name: string,
        email: string,
        telephone: string,
    }
}

const initialState = {
    value : {
        accessToken: '',
        user: {
            name: '',
            email: '',
            telephone: '',
        }
    } as AuthState
} as InitialState

export const auth = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        logOut: () => {
            return initialState
        },

        logIn: (state, action: PayloadAction<{
            accessToken: string,
            user: {
                name: string,
                email: string,
                telephone: string,
            }
        }>) => {
            return {
                value: {
                    accessToken: action.payload.accessToken,
                    user: {
                        name: action.payload.user.name,
                        email: action.payload.user.email,
                        telephone: action.payload.user.telephone
                    }
                }
            }
        }
    }
})

export const { logOut, logIn,  } = auth.actions
export default auth.reducer
