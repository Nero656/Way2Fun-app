import {configureStore, combineReducers} from "@reduxjs/toolkit"
import {useDispatch, TypedUseSelectorHook, useSelector} from "react-redux"
import storage from 'redux-persist/lib/storage'
import {persistStore, persistReducer} from 'redux-persist'

import {auth} from '@/redux/features/auth-slice'
import {theme} from '@/redux/features/theme-slice'


const persistConfig = {
    key: 'root',
    storage,
}


const userPersistConfig = {
    key: 'user',
    storage,
}

const themePersistConfig = {
    key: 'theme',
    storage,
}

const rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, auth.reducer),
    theme: persistReducer(themePersistConfig, theme.reducer)
});


export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})


export const persist = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector