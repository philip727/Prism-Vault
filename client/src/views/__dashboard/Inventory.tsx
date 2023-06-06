import { invoke } from "@tauri-apps/api"
import { Component as SComponent, For, Show } from "solid-js"
import { ButtonType } from "../../components/inputs/Button"
import DynamicButton from "../../components/inputs/DynamicButton"
import InputField from "../../components/inputs/InputField"
import unwrapPromise from "../../scripts/utils/unwrapPromise"
import { getPageSearches, inventory, updateSearches } from "../../stores/inventory"
import './Inventory.scss'
import { Card } from "./__inventory/Card"
import { PageButtons } from "./__inventory/PageButtons"

export type Item = {
    name: string,
    isPrime: boolean,
    category: string,
    uniqueName: string,
    tradable: boolean,
    components: Array<Component>
    wikiaThumbnail: string,
    [key: string]: any,
}

type Component = {
    name: string,
    tradable: boolean,
    uniqueName: string,
    [key: string]: any,
}


export const Inventory: SComponent = () => {
    const handleChange = async (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }) => {
        let searchTime = Date.now();
        if (e.currentTarget.value.length == 0) {
            updateSearches([], searchTime);
            return;
        }

        let { err, result } = await unwrapPromise<Array<Item>, string>(invoke("search_item", { query: e.currentTarget.value }));

        if (!result) return;
        result = clearItemArray(result);

        updateSearches(result, searchTime)
    }

    return (
        <article>
            <div class="w-screen flex flex-row justify-center">
                <div class="w-1/3" />
                <div class="w-1/3 flex flex-row justify-center">
                    <InputField name="part" type="text" placeholder="search for parts" onKeyUp={handleChange} />
                </div>
                <div class="w-1/3" />
            </div>
            <div class="w-screen h-[512px]">
                <ul class="w-screen items-grid gap-6 mt-6 px-6">
                    <For each={inventory.searches}>{(search) => (
                        <Card item={search} />
                    )}
                    </For>
                </ul>
            </div>
            <Show when={inventory.maxPage > 1}>
                <PageButtons />
            </Show>
        </article>
    )
}


    
    
    
const itemHasTradableParts = (item: Item): boolean => {
    if (!item.components || typeof item.components == "undefined") {
        return false;
    }

    for (let i = 0; i < item.components.length; i++) {
        const component = item.components[i];
        if (component.tradable) {
            continue;
        }

        return false;
    }

    return true;
}

const isItemTradableOrHasTradableParts = (item: Item): boolean => {
    return !(!item.isPrime && !item.tradable && !itemHasTradableParts(item));
}

const clearItemArray = (arr: Array<Item>) => {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];

        if (item.category == "Skins" || item.category == "Misc" || !isItemTradableOrHasTradableParts(item)) {
            continue;
        }
        newArr.push(item);
    }

    return newArr;
}