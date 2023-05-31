import { P } from "@tauri-apps/api/event-30ea0228"
import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"

export type Client = {
    user: UserDetails,
    isAuthenticated: boolean,
}

export type UserDetails = {
    id: number,
    username: string,
}

export const [client, setClient] = createStore<Client>({ user: { id: -1, username: "" }, isAuthenticated: false })

export const updateClient = (user: UserDetails) => {
    if (user.id < 0) {
        return;
    }

    console.log(user);

    setClient({ user: user, isAuthenticated: user.id >= 0 && user.username.length > 0 })
}

createEffect(() => {
    console.log(client.isAuthenticated);
})
