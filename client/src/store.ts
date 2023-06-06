import { createStore } from "solid-js/store"
import { Item } from "./views/__dashboard/Inventory"

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

    setClient({ user: user, isAuthenticated: user.id >= 0 && user.username.length > 0 })
}
