import { invoke } from "@tauri-apps/api"
import { Component as SComponent, createEffect, createSignal } from "solid-js"
import createTask from "../../../hooks/createTask"
import { Component, Item } from "../../../views/__dashboard/Inventory"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import InputField from "../../inputs/InputField"

type Props = {
    item: Item,
    component: Component,
}

type Order = {
    quanity: number,
    orderType: String,
    platinum: number
}

export const PartShowcase: SComponent<Props> = (props) => {
    let partFullName = props.item.name + "_" + props.component.name
    let marketQueryString = partFullName.replace(" ", "_").toLowerCase();
    const task = createTask<Order, String>(invoke("get_order", { itemName: marketQueryString }));
    const [platinum, setPlatinum] = createSignal<number>(0)

    createEffect(() => {
        if (task.isLoading || !task.response) {
            return;
        }

        setPlatinum(task.response.platinum);
    })

    return (
        <div class="bg-[var(--c3)] rounded-md w-72 flex flex-row">
            <TooltipPrompter prompt="Quantity">
                <InputField class="!w-16 !h-8" />
            </TooltipPrompter>
            <p class="ml-2 text-white text-xl">{props.component.name}</p>
            <div class="w-full h-full flex flex-row justify-end items-center pt-1">
                {platinum()}
            </div>
        </div>
    )
}
