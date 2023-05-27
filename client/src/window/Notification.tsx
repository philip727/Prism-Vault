import { createMotion, Motion } from "@motionone/solid"
import { Component, onMount } from "solid-js"
import { NotificationDetails } from "./__notification/Manager"

type Props = {
    details: NotificationDetails
}

const EXIT_ANIMATION_LENGTH = 0.3
const ENTER_ANIMATION_LENGTH = 0.5

const Notification: Component<Props> = (props) => {
    let notificationDiv!: HTMLDivElement;
    onMount(async () => {
        await new Promise(resolve => setTimeout(resolve, (props.details.lengthInSeconds - EXIT_ANIMATION_LENGTH) * 1000));

        if (!notificationDiv) {
            return;
        }

        createMotion(notificationDiv, {
            animate: { transform: "translateX(200px)", opacity: 0 },
            transition: {duration: EXIT_ANIMATION_LENGTH, easing: "ease-out"}
        })
    })

    return (
        <Motion.div
            ref={notificationDiv}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: ENTER_ANIMATION_LENGTH } }}
            class="w-60 rounded-xl bg-[var(--c3)] py-2 px-3"
        >
            <p class="text-white">{props.details.text}</p>
        </Motion.div>
    )
}

export default Notification;
