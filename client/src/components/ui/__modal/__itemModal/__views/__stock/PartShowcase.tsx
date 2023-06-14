
import { Component as SComponent, createEffect, createSignal, Show } from "solid-js"
import { Loading } from "../../../../../assets/Loading"
import { Component, getComponentPicture, Item } from "../../../../../scripts/inventory"
import { setItemDisplay } from "../../../../../stores/itemModal"
import { parts, updateQuantityOfPart } from "../../../../../stores/partCache"
import TooltipPrompter from "../../../../../window/__tooltip/TooltipPrompter"
import InputField from "../../../../inputs/InputField"

type Props = {
    item: Item,
    component: Component,
}

export const PartShowcase: SComponent<Props> = (props) => {
    const [platinum, setPlatinum] = createSignal(0);
    let previousTotal = 0;
    let inputField!: HTMLInputElement;

    createEffect(() => {
        if (typeof parts[props.component.uniqueName] == "undefined") {
            return;
        }

        setPlatinum(parts[props.component.uniqueName].platinum)
        inputField.value = `${parts[props.component.uniqueName].quantity}`;
    })

    createEffect(() => {
        let totalPlatinum = platinum() * parts[props.component.uniqueName].quantity;
        setItemDisplay("partPlatinumTotal", prev => (prev + totalPlatinum) - previousTotal);
        previousTotal = totalPlatinum;
    })

    return (
        <div class="bg-[var(--c3)] rounded-md w-128 flex flex-row items-center">
            <TooltipPrompter prompt="Quantity">
                <InputField
                    ref={inputField}
                    value="0"
                    type="number"
                    class="!w-16 !h-8 text-sm"
                    onChange={(e) => {
                        if (!e.currentTarget.value) {
                            return;
                        }

                        updateQuantityOfPart(props.component.uniqueName, parseInt(e.currentTarget.value, 10), props.item.name);
                    }}
                />
            </TooltipPrompter>
            <img class="h-7 w-7 ml-2" src={getComponentPicture(props.item, props.component)} />
            <p class="ml-2 text-white text-sm  font-light w-72">{props.component.name}</p>
            <div class="w-full h-full flex flex-row justify-end items-center">
                <Show when={platinum() != 0}
                    fallback={<Loading width="32" height="32" />}
                >
                    <TooltipPrompter prompt="Lowest Platinum Price">
                        <p class="text-white font-medium mr-1 text-sm">{platinum() === 99999999 ? "No price found" : platinum()}</p>
                    </TooltipPrompter>
                </Show>
                <img class="w-4 h-4 mr-2" src="warframe/platinum.webp" />
            </div>
        </div>
    )
}
