import {Heading, HStack, Text} from "rsuite";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Link from "next/link";
import React from "react";

export default function no_result() {
    return (
        <span style={{textAlign: "center", gridArea: 'CardItems'}}>
            <HStack spacing={2} style={{justifyContent: 'center'}}>
                <SearchOffIcon color={'error'}/>
                <Heading level={4}>
                    По вашему запросу ничего не найдено!
                </Heading>
            </HStack>
            <Text>
                <Link href={'/'}>Вернуться на главную</Link>
            </Text>
        </span>
    )
}