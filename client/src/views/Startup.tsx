import { Navigate } from "@solidjs/router";
import { Component, createSignal, Match, onMount, Switch } from "solid-js"
import createTask from "../hooks/createTask";
import { loginWithSession } from "../scripts/auth/sessionLogin";
import { client } from "../store";


// Pre-login page, decides whether you need
// to login or will take you straight to the dashboard
const Startup: Component = () => {
    const loginTask = createTask(loginWithSession());

    return (
        <Switch>
            <Match when={loginTask.isLoading}>
                <h1>LOADING YAY</h1>
            </Match>
            <Match when={!client.isAuthenticated && !loginTask.isLoading}>
                <Navigate href="login" />
            </Match>
            <Match when={client.isAuthenticated && !loginTask.isLoading}>
                <Navigate href="dashboard" />
            </Match>
        </Switch>
    )
}

export default Startup;
