import { createStore, produce } from 'solid-js/store';
import { TaskQueue } from '../../scripts/utils/taskQueue'

const MAX_AMOUNT_OF_NOTIFICATIONS = 5;

export const notificationQueue = new TaskQueue<() => void>(MAX_AMOUNT_OF_NOTIFICATIONS);
let notificationId = 0;

export type NotificationDetails = {
    text: string,
    lengthInSeconds: number,
}

export const [notifications, setNotifications] = createStore<Array<{ id: number, details: NotificationDetails }>>([]);


// Creates a notification in the window rather than a toast
export const createInWindowNotification = (newNotification: NotificationDetails) => {
    if (newNotification.text.includes("<DS>")) {
        return;
    }
    
    notificationQueue.enqueue(async () => {
        const id = ++notificationId;

        setNotifications(produce(prev => prev.push({ id: id, details: newNotification })));

        await new Promise(resolve => setTimeout(resolve, newNotification.lengthInSeconds * 1000));

        const notificationInArr = notifications.find(x => x.id === id);

        if (typeof notificationInArr === 'undefined') return; 

        const indexOfNotification = notifications.indexOf(notificationInArr);
        if (indexOfNotification < 0) {
            return;
        }

        setNotifications(produce(prev => prev.splice(indexOfNotification, 1)));
    })
}
