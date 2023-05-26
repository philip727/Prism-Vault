import { Component, For, Show } from "solid-js"
import Notification from "../Notification";
import { notifications } from "./Manager";

const Holder: Component = () => {
    return (
        <Show when={notifications.length > 0}>
            <div class="absolute bottom-6 right-6 flex flex-col gap-6">
                <For each={notifications}>{(notification) => (
                    <Notification details={notification.details} />
                )}
                </For>
            </div>
        </Show>
    )
}

export default Holder;
