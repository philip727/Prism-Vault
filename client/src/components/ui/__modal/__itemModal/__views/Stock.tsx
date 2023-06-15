import { Component, Match, Show, Switch, For } from "solid-js"
import { isItemWithoutComponents, itemHasTradableParts } from "../../../../../scripts/inventory"
import { itemDisplay } from "../../../../../stores/itemModal"
import { PartShowcase } from "./__stock/PartShowcase"
import { SellShowcase } from "./__stock/SellShowcase"

export const Stock: Component = () => {
    return (
        <>
            <Switch>
                <Match when={isItemWithoutComponents(itemDisplay.item)}>
                    <SellShowcase item={itemDisplay.item} />
                </Match>
                <Match when={itemHasTradableParts(itemDisplay.item)}>
                    <For each={itemDisplay.item.components}>{(component) => (
                        <Show when={component.tradable}>
                            <PartShowcase item={itemDisplay.item} component={component} />
                        </Show>
                    )}</For>
                </Match>
            </Switch>
            <div class="bg-[var(--c5)] rounded-md w-128 flex flex-row items-center justify-end h-8">
                <p class="text-white text-sm font-light w-full text-left pl-2">Total Piece Platinum Count</p>
                <p class="text-white font-medium mr-1 text-sm">{itemDisplay.partPlatinumTotal}</p>
                <img class="w-4 h-4 mr-2" src="warframe/platinum.webp" />
            </div>
        </>
    )
}
