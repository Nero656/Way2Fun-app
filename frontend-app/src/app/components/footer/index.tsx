import React from "react"
import {css} from "@emotion/css"
import {Text} from "rsuite"

const footerStyle = css`
    position: static;
    bottom: 0;
    min-width: 100vw;
    z-index: 1000;
    div {
        padding: 0 4rem 1rem;
        display: flex;
        flex-flow: row wrap; 
        justify-content: space-between;
        
        a {
            &:hover{
                transition-duration: 0.5s;
                text-decoration: none;
                top: 10px;
            }
        }
    }
`



export default function Footer() {
    return (
        <footer className={footerStyle}>
            <div>
                <a href={'https://github.com/Nero656/Way2Fun-app'}>
                    <Text>@info</Text>
                </a>
                <a href={'https://github.com/Nero656'}>
                    <Text>Автор: @Nero</Text>
                </a>
            </div>
        </footer>
    )
}