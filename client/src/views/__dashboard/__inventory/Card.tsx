import { Motion } from "@motionone/solid"
import { Component } from "solid-js"
import { determineItemPicture, Item, ProductCategory } from "../../../scripts/inventory"
import { setItemDisplay, setupItemForModalDisplay, } from "../../../stores/itemModal"
import { ModalDisplay, setModal, updateOnModalOpen } from "../../../stores/modal"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"

type Props = {
    item: Item
}

export const Card: Component<Props> = (props) => {
    return (
        <TooltipPrompter prompt={`Open ${props.item.name}`}>
            <Motion.button
                class="w-fit h-20 bg-[var(--c5)] flex flex-row items-center justify-center rounded-md overflow-hidden cursor-pointer hover-shadow"
                hover={{ scale: 1.05 }}
                press={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                    setItemDisplay("item", props.item)
                    updateOnModalOpen(setupItemForModalDisplay)
                    setModal("display", ModalDisplay.ITEM)
                    setModal("open", true);
                }}
            >
                <div class="w-56 bg-[var(--c3)] h-full flex justify-evenly items-center">
                    <img
                        class={`${props.item.category == ProductCategory.MOD ? "w-12" : "w-16"} h-16 select-none`}
                        src={determineItemPicture(props.item)}
                    />
                    <p class="text-white font-medium text-center max-w-[8rem]">{props.item.name}</p>
                </div>
                <div class="w-16">

                </div>
            </Motion.button>
        </TooltipPrompter>
    )
}

