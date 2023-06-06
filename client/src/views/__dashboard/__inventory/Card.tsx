import { Motion } from "@motionone/solid"
import { Component } from "solid-js"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import { Item } from "../Inventory"

type Props = {
    item: Item
}

export const Card: Component<Props> = (props) => {
    return (
        <Motion.li
            class="w-fit h-20 bg-[var(--c5)] flex flex-row items-center justify-center rounded-md"
            hover={{ scale: 1.05 }}
        >
            <div class="w-12 font-medium text-white flex flex-col items-center justify-center">
                <TooltipPrompter prompt="Quantity">
                    <p>0</p>
                </TooltipPrompter>
                <div class="w-full flex flex-row justify-center gap-2">
                    <Motion.p
                        hover={{ scale: 1.1 }}
                        class="text-xl cursor-pointer select-none"
                    >+</Motion.p>
                    <Motion.p
                        hover={{ scale: 1.1 }}
                        class="text-xl cursor-pointer select-none"
                    >-</Motion.p>
                </div>
            </div>
            <div class="w-52 bg-[var(--c3)] h-full flex justify-evenly items-center">
                <img class={`${props.item.category == "Mods" ? "w-10" : "w-14"} h-14 select-none`} src={cleanWikiaThumbnail(props.item.wikiaThumbnail)} />
                <p class="text-white font-medium text-center max-w-[8rem]">{props.item.name}</p>
            </div>
            <div class="w-12">

            </div>
        </Motion.li>
    )
}

const cleanWikiaThumbnail = (url: string): string => {
    if (typeof url == "undefined") {
        return "./logos/wf-comp-logo.svg"
    }

    try {
        return url.split("/revision")[0];
    } catch {
        return url;
    }
}
