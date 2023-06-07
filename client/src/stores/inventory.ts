import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Item } from "../scripts/inventory";

export type InventorySearch = {
    searches: Array<Item>,
    lastSearch: number,
    page: number,
    maxPage: number,
}

let storedSearches: Array<Item> = [];
const MAX_ITEMS_PER_PAGE = 12;
export const [inventory, setInventory] = createStore<InventorySearch>({ searches: [], lastSearch: 0, page: 1, maxPage: 1 })
export const [pageOffset, setPageOffset] = createSignal(0);

export const updateSearches = (searches: Array<Item>, initialSearchTime: number) => {
    // If a request finishes after the user has already began searching 
    // for something else, then we don't want it to set the store
    if ((initialSearchTime * 100) < (inventory.lastSearch * 100)) {
        return;
    }

    setPageOffset(0);
    // If there is more items than the page can hold then we need to get the right amount per page
    if (searches.length > MAX_ITEMS_PER_PAGE) {
        setInventory("page", 1);

        let amountOfPages = Math.ceil(searches.length / MAX_ITEMS_PER_PAGE)
        setInventory("maxPage", amountOfPages)

        storedSearches = [...searches]
        setInventory("searches", storedSearches.slice(0, MAX_ITEMS_PER_PAGE));

        return;
    }

    // Makes sure we are showing the correct stuff on search :D
    setInventory("lastSearch", initialSearchTime);
    setInventory("searches", searches);
    setInventory("maxPage", 1)
}

// Get items on that page
export const getPageSearches = (page: number) => {
    const startingIndex = 0 + (MAX_ITEMS_PER_PAGE * (page - 1));
    let itemsOnPage = []; // fucking slice wasn't working?
    for (let i = 0; i < MAX_ITEMS_PER_PAGE; i++) {
        if (i+startingIndex >= storedSearches.length) {
            continue
        }
        itemsOnPage.push(storedSearches[i+startingIndex]) 
    }
    setInventory("searches", itemsOnPage);
    setInventory("page", page);
}
