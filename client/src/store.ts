import { createStore } from "solid-js/store"

export type Client = {
    user: {
        uid: number,
        username: string,
    },
    isAuthenticated: boolean,
}

export const [client, setClient] = createStore<Client>({ user: { uid: 0, username: "" }, isAuthenticated: false })
