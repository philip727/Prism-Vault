import { invoke } from "@tauri-apps/api"
import { Component as SComponent, createEffect, createSignal } from "solid-js"
import createTask from "../../../hooks/createTask"
import { Component, getComponentPicture, Item } from "../../../scripts/inventory"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import InputField from "../../inputs/InputField"

type Props = {
    item: Item,
    component: Component,
}

type Order = {
    quanity: number,
    orderType: string,
    platinum: number
}

export const PartShowcase: SComponent<Props> = (props) => {
    let partFullName = props.item.name + " " + props.component.name
    let marketQueryString = partFullName.replaceAll(" ", "_").toLowerCase();
    console.log(marketQueryString);
    const task = createTask<Order, String>(invoke("get_order", { itemName: marketQueryString }));
    const [platinum, setPlatinum] = createSignal<number>(0)

    createEffect(() => {
        if (task.isLoading || !task.response) {
            return;
        }

        setPlatinum(task.response.platinum);
    })

    return (
        <div class="bg-[var(--c3)] rounded-md w-96 flex flex-row items-center">
            <TooltipPrompter prompt="Quantity">
                <InputField value="0" type="number" class="!w-16 !h-8" />
            </TooltipPrompter>
            <img class="h-8 w-8 ml-2" src={getComponentPicture(props.item, props.component)} />
            <p class="ml-2 text-white text-lg font-light w-60">{props.component.name}</p>
            <div class="w-full h-full flex flex-row justify-end items-center">
                <TooltipPrompter prompt="Lowest Platinum Price">
                    <p class="text-white font-medium mr-2">{platinum()}</p>
                </TooltipPrompter>
                <img class="w-4 h-4 mr-2" src="warframe/platinum.webp" />
            </div>
        </div>
    )
}
