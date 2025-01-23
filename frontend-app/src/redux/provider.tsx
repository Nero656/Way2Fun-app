'use client'
import {persist, store} from './store'
import {Provider} from 'react-redux'
import React from 'react'
import {PersistGate} from "redux-persist/integration/react";

export function ReduxProvider({children}: { children: React.ReactNode }) {
    return <Provider store={store}>
        <PersistGate
            persistor={persist}
            loading={null}
        >
            {children}
        </PersistGate>
    </Provider>
}