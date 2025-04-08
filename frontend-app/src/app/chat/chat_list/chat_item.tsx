'use client'
import {List, HStack, Avatar, Text} from "rsuite"
import {css} from "@emotion/css"
import React from "react"

interface Props {
    props: {
        active: boolean,
        user_id: number,
        guide_id: number,
        username: string,
        last_message: string | null,
        created_at: string | null,
    }
}

const itemStyle = (active : boolean) => css`
    width: auto;
    padding: 10px;
    cursor: pointer;
    transition: 0.3s;
    border-radius: 5px;
    background-color: ${active ? 'rgba(20, 152, 237, 0.3)' : 'transparent'};

    :hover {
        background-color: ${active ? 'rgba(20, 152, 237, 0.5)' : 'rgba(67, 67, 67, 0.3)'};
    }
`

export default function index({props}: Props) {
    return <List.Item className={itemStyle(props.active)}>
        <HStack alignItems="center">
            <Avatar circle src="https://images.unsplash.com/broken" color={'blue'} alt={props.username.charAt(0)}/>
            <HStack.Item flex={1}>
                <HStack justifyContent="space-between">
                    <Text>
                        <strong>
                            {props.username}
                        </strong>
                    </Text>
                    <Text muted size="sm">
                        {props.created_at}
                    </Text>
                </HStack>
            </HStack.Item>
        </HStack>
    </List.Item>
}