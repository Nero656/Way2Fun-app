import {Notification, ButtonToolbar, Button} from "rsuite"
import {TypeAttributes} from "rsuite/cjs/internals/types";
import Status = TypeAttributes.Status;

export default function index(url: string, message: string, status: Status) {
    return <Notification type={`${status}`} header={`${message}!`} closable>
        <ButtonToolbar>
            <Button appearance="link" onClick={() => {location.replace(`${url}`)}}>Перейти</Button>
        </ButtonToolbar>
    </Notification>
}