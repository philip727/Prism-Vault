import { createStore } from "solid-js/store"

export type Client = {
    user: UserDetails,
    isAuthenticated: boolean,
}

export type UserDetails = {
    id: number,
    username: string,
    email: string,
}

const defaultClient: Client = {
    user: {
        id: -1,
        username: "",
        email: "",
    },
    isAuthenticated: false
}

export const [client, setClient] = createStore<Client>(defaultClient)
export const updateClient = (user: UserDetails) => {
    if (user.id < 0) {
        setClient(defaultClient);
        return;
    }

    setClient({ user: user, isAuthenticated: user.id >= 0 && user.username.length > 0 });
}
