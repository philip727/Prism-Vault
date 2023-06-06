import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Item } from "../views/__dashboard/Inventory";

export const [itemModal, setItemModal] = createSignal(false);

export const [itemDetails, setItemDetails] = createStore<Item>({
    name: "Default",
    isPrime: false,
    category: "Unknown",
    uniqueName: "Unknown",
    tradable: false,
    components: [],
    wikiaThumbnail: ""
});
