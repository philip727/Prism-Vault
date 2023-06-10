import { Component, For } from "solid-js"
import Notification from "../Notification";
import { notifications } from "./Manager";

const Holder: Component = () => {
    return (
        <div class="absolute bottom-6 right-6 flex flex-col gap-6">
            <For each={notifications}>{(notification) => (
                <Notification details={notification.details} />
            )}
            </For>
        </div>
    )
}

export default Holder;
