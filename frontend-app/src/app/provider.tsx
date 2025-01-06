'use client'
import 'rsuite/dist/rsuite.min.css'
import {CustomProvider, Panel} from 'rsuite'
import {useCallback, useState} from "react"

import { Button, ButtonToolbar } from 'rsuite'

import Navbar from "./components/navbar/index";
import {Visible, Unvisible} from "@rsuite/icons";



export default function Provider({props}){
    const [toggleMode, setToggleMode] = useState(true)

    const Theme = useCallback(() => {
        setToggleMode(!toggleMode)
    }, [toggleMode])
    const toggleModeFunc = () => {
        setToggleMode(!toggleMode)
    };

    return (
        <CustomProvider theme={toggleMode ? 'light' : 'dark'}>
            <Navbar toggleMode = {toggleMode} theme={Theme}/>
            <div style={{
                height: '100vh',
            }}>
                    {props}
            </div>
        </CustomProvider>
    )
}