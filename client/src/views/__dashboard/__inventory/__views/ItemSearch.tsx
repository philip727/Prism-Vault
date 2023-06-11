import { Component, For } from "solid-js"
import { searches } from "../../../../stores/search"
import { Card } from "../Card"

export const ItemSearch: Component= () => {
    return (
        <ul class="w-screen items-grid gap-6 mt-6 px-6">
            <For each={searches.items}>{(search) => (
                <Card item={search} />
            )}
            </For>
        </ul>
    )
}
