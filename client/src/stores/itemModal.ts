import { createSignal } from "solid-js";
import { Item, newItem } from "../scripts/inventory";

export const [isItemModalOpen, setIsItemModalOpen] = createSignal(false);

export const [itemShownOnModal, setItemShownOnModal] = createSignal(newItem());

export const updateItemDetailsOnModal = (item: Item) => {
    setItemShownOnModal(item);
}
