import { Component } from "solid-js"
import { Outlet } from "@solidjs/router";
import Toolbar from "../../window/Toolbar";
import Holder from "../../window/__notification/Holder";
import { Tooltip } from "../../window/Tooltip";
import { ItemModal } from "../ui/ItemModal";

const RootLayout: Component = () => {
    return (
        <>
            <ItemModal />
            <Tooltip />
            <Holder />
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
