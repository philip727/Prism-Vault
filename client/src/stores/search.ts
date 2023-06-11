import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Item } from "../scripts/inventory";

export type InventorySearch = {
    items: Array<Item>,
    lastSearchTime: number,
    page: number,
    maxPage: number,
}

let storedSearches: Array<Item> = [];
const MAX_ITEMS_PER_PAGE = 12;
export const [searches, setSearches] = createStore<InventorySearch>({ items: [], lastSearchTime: 0, page: 1, maxPage: 1 })
export const [pageOffset, setPageOffset] = createSignal(0);

export const updateSearches = (items: Array<Item>, initialSearchTime: number) => {
    // If a request finishes after the user has already began searching 
    // for something new, then we don't want it to set the store
    if (initialSearchTime < searches.lastSearchTime) {
        return;
    }

    setPageOffset(0);
    // If there is more items than the page can hold then we need to get the right amount per page
    if (items.length > MAX_ITEMS_PER_PAGE) {
        setSearches("page", 1);

        let amountOfPages = Math.ceil(items.length / MAX_ITEMS_PER_PAGE)
        setSearches("maxPage", amountOfPages)

        storedSearches = [...items]
        setSearches("items", storedSearches.slice(0, MAX_ITEMS_PER_PAGE));

        setSearches("lastSearchTime", initialSearchTime);
        return;
    }

    setSearches("lastSearchTime", initialSearchTime);
    setSearches("items", items);
    setSearches("maxPage", 1)
}

// Get items on that page
export const getPageSearches = (page: number) => {
    const startingIndex = 0 + (MAX_ITEMS_PER_PAGE * (page - 1));
    let itemsOnPage = []; // fucking slice wasn't working?
    for (let i = 0; i < MAX_ITEMS_PER_PAGE; i++) {
        if (i + startingIndex >= storedSearches.length) {
            continue
        }
        itemsOnPage.push(storedSearches[i + startingIndex])
    }
    setSearches("items", itemsOnPage);
    setSearches("page", page);
}
