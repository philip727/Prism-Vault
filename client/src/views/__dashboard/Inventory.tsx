import { Motion } from "@motionone/solid"
import { invoke } from "@tauri-apps/api"
import { Component as SComponent, createEffect, createSignal, Match, onMount, Show, Switch } from "solid-js"
import Logo from "../../assets/Logo"
import InputField from "../../components/inputs/InputField"
import { isItemTradableOrHasTradableParts, Item } from "../../scripts/inventory"
import unwrapPromise from "../../scripts/utils/unwrapPromise"
import { itemDisplay, setItemDisplay } from "../../stores/itemModal"
import { searches, updateSearches } from "../../stores/search"
import './Inventory.scss'
import { PageButtons } from "./__inventory/PageButtons"
import { ItemSearch } from "./__inventory/__views/ItemSearch"


export const Inventory: SComponent = () => {
    let searchBar!: HTMLInputElement;
    const [currentError, setCurrentError] = createSignal<null | string>(null);

    // Handles the search when we start to input
    const handleChange = async (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }) => {
        setCurrentError(null);
        let searchTime = Date.now();

        // If the search is empty then don't search for anything
        if (e.currentTarget.value.length == 0) {
            getUserItems();
            return;
        }

        let { err, result } = await unwrapPromise<Array<Item>, string>(invoke("search_query", { query: e.currentTarget.value }));
        setCurrentError(err);

        if (err || !result) return;
        result = clearItemArray(result);

        console.log(result);

        updateSearches(result, searchTime)
    }

    // Gets the items we have already got some of
    onMount(() => {
        getUserItems();
    })

    createEffect(() => {
        itemDisplay.page // dependency
        setItemDisplay("partPlatinumTotal", 0);
    })

    return (
        <Motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div class="w-screen flex flex-row justify-center">
                <div class="w-1/3" />
                <div class="w-1/3 flex flex-row justify-center">
                    <InputField
                        ref={searchBar}
                        name="part"
                        type="text"
                        placeholder="search for parts"
                        onKeyUp={handleChange}
                    />
                </div>
                <div class="w-1/3" />
            </div>
            <div class="w-screen h-[420px]">
                <Switch
                    fallback={
                        <>
                            <h1 class="text-white text-2xl font-semibold w-full text-center mt-8">Your Items</h1>
                            <ItemSearch />
                        </>
                    }
                >
                    <Match when={searches.items.length > 0 && searchBar.value.length > 0}>
                        <ItemSearch />
                    </Match>
                    <Match when={searches.items.length == 0 && searchBar.value.length > 0}>
                        <div class="h-full flex flex-col justify-center items-center gap-6 pt-12">
                            <Logo />
                            <p class="text-white text-2xl font-medium">
                                {`No results for \"${searchBar.value}\" Try searching for something else`}
                            </p>
                        </div>
                    </Match>
                    <Match when={currentError() != null}>
                        <div class="h-full flex flex-col justify-center items-center gap-6 pt-12">
                            <Logo />
                            <p class="text-white text-2xl font-medium">
                                {currentError()}
                            </p>
                        </div>
                    </Match>
                </Switch>
                <Show when={searches.maxPage > 1}>
                    <PageButtons />
                </Show>
            </div>
        </Motion.article>
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

const getUserItems = async () => {
    const { err, result } = await unwrapPromise<Array<Item>, string>(invoke("get_owned_items"));

    if (err || !result) return;

    let searchTime = Date.now();
    updateSearches(result, searchTime);
}
