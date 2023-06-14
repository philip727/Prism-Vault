import { Outlet } from "@solidjs/router"
import { Component, JSX, Show } from "solid-js"
import { client } from "../../stores/client"

type RouteProps = {
    fallback?: any 
}
export const PrivateRoute: Component<RouteProps> = (props) => {
    return (
        <Show when={client.isAuthenticated} fallback={props.fallback}>
            <Outlet />
        </Show>
    )
}

