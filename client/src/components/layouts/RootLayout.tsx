import { Component, Show } from "solid-js"
import { Outlet } from "@solidjs/router";
import Toolbar from "../../window/Toolbar";
import Notificationholder from "../../window/__notification/Holder";
import { Tooltip } from "../../window/Tooltip";
import { showTooltip } from "../../window/__tooltip/Manager";
import { notifications } from "../../window/__notification/Manager";
import { modal } from "../../stores/modal";
import { Modal } from "../ui/Modal";

const RootLayout: Component = () => {
    return (
        <>
            <Show when={modal.open}>
                <Modal /> 
            </Show>
            <Show when={showTooltip()}>
                <Tooltip />
            </Show>
            <Show when={notifications.length > 0}>
                <Notificationholder />
            </Show>
            <header>
                <Toolbar />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default RootLayout;
