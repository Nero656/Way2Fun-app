'use client'
import 'rsuite/dist/rsuite.min.css'
import {CustomProvider} from 'rsuite'
import Navbar from "./components/navbar/index";
import Footer from "./components/footer/index";
import {ReduxProvider} from "@/redux/provider";
import { store } from "@/redux/store";
import {useCallback, useState} from "react";
import ruRU from 'rsuite/locales/ru_RU';
import {css} from "@emotion/css";

const main = css`
    min-height: 85vh;
    margin-top: 4em;
    margin-bottom: 1rem;
    position: relative;
`

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
            <CustomProvider theme={toggleMode ? 'light' : 'dark'} locale={ruRU}>
                <Navbar toggleMode={toggleMode} theme={Theme}/>
                <div className={main}>
                    {props}
                </div>
                <Footer/>
            </CustomProvider>
        </ReduxProvider>
    )
}