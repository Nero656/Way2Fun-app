'use client'
import 'rsuite/dist/rsuite.min.css'
import {CustomProvider} from 'rsuite'
import Navbar from "./components/navbar/index";
import {ReduxProvider} from "@/redux/provider";
import { store } from "@/redux/store";
import {useCallback, useState} from "react";


export default function Provider({props}: any) {
    const [toggleMode, setToggleMode] = useState(store.getState().theme?.value.theme)


    const Theme = useCallback(() => {
        setToggleMode(!toggleMode)
    }, [toggleMode])
    const toggleModeFunc = () => {
        setToggleMode(!toggleMode)
    };

    return (
        <ReduxProvider>
            <CustomProvider theme={toggleMode ? 'light' : 'dark'}>
                <Navbar toggleMode={toggleMode} theme={Theme}/>
                <div style={{
                    height: '100vh',
                }}>
                    {props}
                </div>
            </CustomProvider>
        </ReduxProvider>
    )
}