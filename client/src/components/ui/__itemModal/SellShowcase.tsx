import { Component, createEffect, createSignal, Show } from "solid-js"
import { Loading } from "../../../assets/Loading"
import { Item } from "../../../scripts/inventory"
import { parts } from "../../../stores/partCache"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import InputField from "../../inputs/InputField"

type Props = {
    item: Item
}




export const SellShowcase: Component<Props> = (props) => {
    const [platinum, setPlatinum] = createSignal(0);

    createEffect(() => {
        if (typeof parts[props.item.uniqueName] == "undefined") {
            return;
        }

        setPlatinum(parts[props.item.uniqueName].platinum)
    })

    return (
        <div class="bg-[var(--c3)] rounded-md w-96 flex flex-row items-center">
            <TooltipPrompter prompt="Quantity">
                <InputField
                    value="0"
                    type="number"
                    class="!w-16 !h-8"
                    onKeyUp={(e) => {
                    }}
                />
            </TooltipPrompter>
            <p class="ml-2 text-white text-base font-light w-60">x1 Sell Price</p>
            <div class="w-full h-full flex flex-row justify-end items-center">
                <Show when={platinum() != 0}
                    fallback={<Loading width="32" height="32" />}
                >
                    <TooltipPrompter prompt="Lowest Platinum Price">
                        <p class="text-white font-medium mr-2">{platinum()}</p>
                    </TooltipPrompter>
                </Show>
                <img class="w-4 h-4 mr-2" src="warframe/platinum.webp" />
            </div>
        </div>
    )
}
