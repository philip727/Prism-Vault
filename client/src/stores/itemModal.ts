import { createSignal } from "solid-js";
import { Item, newItem } from "../scripts/inventory";

export const [itemModal, setItemModal] = createSignal(false);

export const [itemDetails, setItemDetails] = createSignal(newItem());

export const updateItemDetailsOnModal = (item: Item) => {
    setItemDetails(item);
}
