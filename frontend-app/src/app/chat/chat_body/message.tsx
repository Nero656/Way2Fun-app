import {Avatar, Card, HStack, Text, VStack} from "rsuite"
import {css} from "@emotion/css"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface Props {
    props: {
        message: string,
        senderName: string,
        email: string,
        created_at: string,
        userId: number,
    }
}

const itemStyle = css`
    padding: 0.2em;
    cursor: pointer;
    transition: 0.3s;
    
    :hover {
        background-color: rgba(67, 67, 67, 0.3);
    }
`

export default function index({props}: Props) {
    return <div className={itemStyle}>
        <Card bordered={false}>
            <Card.Header>
                <HStack>
                    <Avatar
                        circle
                        src="https://images.unsplash.com/broken"
                        color={'blue'}
                        alt={props.senderName.charAt(0)}/>
                        <VStack spacing={2}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                            <Text>{props.senderName}</Text>
                            <Text muted>{props.email}</Text>
                            </span>
                            <Text size={'sm'} muted>
                                Отправлено: {format(new Date(props.created_at), "d MMMM h:mm", { locale: ru })}
                            </Text>
                        </VStack>
                </HStack>
            </Card.Header>
            <Card.Body>
                <span style={{paddingLeft: 50}}>{props.message}</span>
            </Card.Body>
        </Card>
    </div>
}