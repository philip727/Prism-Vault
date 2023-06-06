import { Motion } from "@motionone/solid"
import { Component } from "solid-js"
import { setItemDetails, setItemModal } from "../../../stores/itemModal"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import { Item } from "../Inventory"

type Props = {
    item: Item
}

export const Card: Component<Props> = (props) => {
    return (
        <TooltipPrompter prompt={`Open ${props.item.name}`}>
            <Motion.button
                class="w-fit h-20 bg-[var(--c5)] flex flex-row items-center justify-center rounded-md overflow-hidden cursor-pointer"
                hover={{ scale: 1.05 }}
                press={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                    console.log(props.item);
                    setItemModal(true);
                    setItemDetails(props.item);
                }}
            >
                <div class="w-56 bg-[var(--c3)] h-full flex justify-evenly items-center">
                    <img class={`${props.item.category == "Mods" ? "w-12" : "w-16"} h-16 select-none`} src={cleanWikiaThumbnail(props.item.wikiaThumbnail)} />
                    <p class="text-white font-medium text-center max-w-[8rem]">{props.item.name}</p>
                </div>
                <div class="w-16">

                </div>
            </Motion.button>
        </TooltipPrompter>
    )
}

export const cleanWikiaThumbnail = (url: string): string => {
    if (typeof url == "undefined") {
        return "./logos/wf-comp-logo.svg"
    }

    try {
        return url.split("/revision")[0];
    } catch {
        return url;
    }
}
