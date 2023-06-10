import { invoke } from "@tauri-apps/api"
import { Component as SComponent, For, Show } from "solid-js"
import InputField from "../../components/inputs/InputField"
import { isItemTradableOrHasTradableParts, Item } from "../../scripts/inventory"
import unwrapPromise from "../../scripts/utils/unwrapPromise"
import { searches, updateSearches } from "../../stores/search"
import './Inventory.scss'
import { Card } from "./__inventory/Card"
import { PageButtons } from "./__inventory/PageButtons"


export const Inventory: SComponent = () => {
    const handleChange = async (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }) => {
        let searchTime = Date.now();
        if (e.currentTarget.value.length == 0) {
            updateSearches([], searchTime);
            return;
        }

        let { err, result } = await unwrapPromise<Array<Item>, string>(invoke("search_query", { query: e.currentTarget.value }));

        if (!result) return;
        result = clearItemArray(result);

        console.log(result);

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
            <div class="w-screen h-[420px]">
                <ul class="w-screen items-grid gap-6 mt-6 px-6">
                    <For each={searches.searches}>{(search) => (
                        <Card item={search} />
                    )}
                    </For>
                </ul>
            </div>
            <Show when={searches.maxPage > 1}>
                <PageButtons />
            </Show>
        </article>
    )
}

const clearItemArray = (arr: Array<Item>) => {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];

        if (item.category == "Skins" 
            || item.category == "Misc" 
            || !isItemTradableOrHasTradableParts(item)
            || item.excludeFromCodex) {
            continue;
        }
        newArr.push(item);
    }

    return newArr;
}
