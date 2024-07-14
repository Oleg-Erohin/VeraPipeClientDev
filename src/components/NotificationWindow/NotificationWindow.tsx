interface INotification{
    notification:string;
}

function NotificationWindow({notification}:INotification){
    return(
        <div style={{height:'100px'}}>{notification}</div>
    );
}
export default NotificationWindow;