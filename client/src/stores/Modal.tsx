import { createStore } from "solid-js/store";

export enum ModalDisplay {
    ITEM = "ITEM",
    EMAILCHANGE = "EMAILCHANGE",
    PASSWORDCHANGE = "PASSWORDCHANGE"
}

export let onModalOpen = () => {

}

export const updateOnModalOpen = (fn: () => void) => {
    onModalOpen = fn;
}

export const [modal, setModal] = createStore({
    open: false,
    display: ModalDisplay.ITEM, 
})
