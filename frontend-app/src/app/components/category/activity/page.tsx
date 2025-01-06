import {Card, Grid, Row, Col, VStack, TagGroup, Tag} from 'rsuite'

type activityList = {
    name: string,
    "description": string,
    "short_description": string,
    "price": string,
    "duration": number,
    "capacity": number,
}

export default function CategoryActivity({activityList}) {
    return (
        <VStack spacing={20} style={{marginTop: 10}}>
            <Grid fluid>
                <Row gutter={24}>
                    {activityList.map((item, index) => (
                        <Col xs={24} sm={12} md={12} lg={12} key={index}>
                            <Card
                                size="sm"
                                key={index}
                                style={{marginBottom: 10}}
                                shaded={'hover'}
                                direction="row"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1576606539605-b2a44fa58467?q=80&w=1974"
                                    alt="Shadow"
                                    style={{objectFit: 'cover'}}
                                    width={200}
                                />
                                <VStack spacing={2}>
                                    <Card.Header as="h5">{item.name}</Card.Header>
                                    <Card.Body>
                                        {item.short_description}
                                    </Card.Body>
                                    <Card.Footer>
                                        <TagGroup>
                                            <Tag size="sm">🐶 Dog</Tag>
                                            <Tag size="sm">☀️ Sunny</Tag>
                                            <Tag size="sm">🌈 Rainbow</Tag>
                                        </TagGroup>
                                    </Card.Footer>
                                </VStack>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Grid>
        </VStack>
    )
}