import Activity from './activity/index'
import ActivityDate from './activity_date/index'
import ActivityImage from './activity_image/index'
import {Panel, Tabs, Placeholder} from "rsuite"

export default function index(){
    return <Panel header={'Панель модератора'} shaded style={{minWidth:'60vw'}}>
        <Tabs defaultActiveKey="1" appearance="subtle">
            <Tabs.Tab eventKey="1" title="Добовление активности">
                <Activity/>
            </Tabs.Tab>
            <Tabs.Tab eventKey="2" title="Добавление дат проведения мероприятия">
                <ActivityDate/>
            </Tabs.Tab>
            <Tabs.Tab eventKey="3" title="Добавление картинки мероприятия">
                <ActivityImage/>
            </Tabs.Tab>
        </Tabs>
    </Panel>
}