import { Component as SComponent, createEffect, createSignal, mergeProps, Show } from "solid-js"
import { Loading } from "../../../assets/Loading"
import { Component, getComponentPicture, Item, Order } from "../../../scripts/inventory"
import { parts } from "../../../stores/partCache"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import InputField from "../../inputs/InputField"

type Props = {
    item: Item,
    component: Component,
}

export const PartShowcase: SComponent<Props> = (props) => {
    const [platinum, setPlatinum] = createSignal(0);

    createEffect(() => {
        if (typeof parts[props.component.uniqueName] == "undefined" || typeof parts[props.component.uniqueName].platinum == "undefined") {
            return;
        }

        setPlatinum(parts[props.component.uniqueName].platinum)
    })

    return (
        <div class="bg-[var(--c3)] rounded-md w-96 flex flex-row items-center">
            <TooltipPrompter prompt="Quantity">
                <InputField
                    value="0"
                    type="number"
                    class="!w-16 !h-8"
                />
            </TooltipPrompter>
            <img class="h-7 w-7 ml-2" src={getComponentPicture(props.item, props.component)} />
            <p class="ml-2 text-white text-base font-light w-72">{props.component.name}</p>
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
