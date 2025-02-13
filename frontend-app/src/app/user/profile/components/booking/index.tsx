'use client'
import {Panel, Card, CardGroup, Text, Avatar, HStack, VStack, SelectPicker} from "rsuite"
import React, {useState} from "react"

const items = [
    {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?u=9',
        job: 'Software Engineer',
        description:
            'A passionate developer with a love for learning new technologies. Enjoys building innovative solutions and solving problems.',
        joined: 'Joined in January 2023'
    },
    {
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?u=8',
        job: 'UI/UX Designer',
        description:
            'A creative designer with a keen eye for aesthetics. Focuses on user experience and intuitive interfaces.',
        joined: 'Joined in March 2022'
    },
    {
        name: 'Michael Johnson',
        avatar: 'https://i.pravatar.cc/150?u=7',
        job: 'Data Scientist',
        description:
            'A data scientist who enjoys analyzing complex datasets and uncovering insights to drive business decisions.',
        joined: 'Joined in June 2021'
    },
    {
        name: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/150?u=6',
        job: 'Project Manager',
        description:
            'A project manager with a passion for leading teams to success. Specializes in Agile methodologies and team coordination.',
        joined: 'Joined in August 2020'
    }
]

export default function booking() {
    const [columns, setColumns] = useState(2)
    const [spacing, setSpacing] = useState(20)

    return (<Panel header="Список запланированных поездок" shaded>
        <CardGroup columns={columns} spacing={spacing}>
            {items.map((item, index) => (
                <Card key={index}>
                    <Card.Header>
                        <HStack>
                            <Avatar circle src={item.avatar} />
                            <VStack spacing={2}>
                                <Text>{item.name}</Text>
                                <Text muted size="sm">
                                    {item.job}
                                </Text>
                            </VStack>
                        </HStack>
                    </Card.Header>
                    <Card.Body>{item.description}</Card.Body>
                    <Card.Footer>
                        <Text muted>{item.joined}</Text>
                    </Card.Footer>
                </Card>
            ))}
        </CardGroup>
    </Panel>)
}