import { Navigate } from "@solidjs/router";
import { Component, createSignal, Match, Switch } from "solid-js"
import { client } from "../store";

const Startup: Component = () => {

    return (
        <Switch>
            <Match when={!client.isAuthenticated}>
                <Navigate href="login" />
            </Match>
        </Switch>
    )
}

export default Startup;
