import { invoke } from "@tauri-apps/api"
import { Component as SComponent, createEffect, createSignal, Show } from "solid-js"
import { Loading } from "../../../assets/Loading"
import createTask from "../../../hooks/createTask"
import { Component, getComponentPicture, Item, Order } from "../../../scripts/inventory"
import unwrapPromise from "../../../scripts/utils/unwrapPromise"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import InputField from "../../inputs/InputField"

type Props = {
    item: Item,
    component: Component,
    handleUpdate: (n: string, p: number, q: number) => void,
}

export const PartShowcase: SComponent<Props> = (props) => {
    const [platinum, setPlatinum] = createSignal<number>(0)

    let partFullName = "";
    // If it has a product category then it must be another set
    if (typeof props.component.productCategory == "undefined") {
        partFullName = props.item.name + " " + props.component.name
    } else {
        partFullName = props.component.name + "_set"
    }

    let marketQueryString = partFullName.replaceAll(" ", "_").toLowerCase();
    const orderTask = createTask<Order, String>(invoke("get_order", { itemName: marketQueryString }));

    createEffect(async () => {
        if (orderTask.isLoading || !orderTask.response) {
            return;
        }

        props.handleUpdate(props.component.name, orderTask.response.platinum, 0);
        setPlatinum(orderTask.response.platinum);
    })


    const handleQuantityUpdate = async (e: Event & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => {
        if (!e.currentTarget.value) {
            return;
        }

        const { err, result } = await unwrapPromise(invoke("add_item", { uniqueName: props.component.uniqueName, quantity: parseInt(e.currentTarget.value, 10) }));
        if (err) {
            console.log(err);
            return;
        }
    }

    return (
        <div class="bg-[var(--c3)] rounded-md w-96 flex flex-row items-center">
            <TooltipPrompter prompt="Quantity">
                <InputField
                    value="0"
                    type="number"
                    class="!w-16 !h-8"
                    onChange={handleQuantityUpdate}
                    onKeyUp={(e) => {
                        props.handleUpdate(props.component.name, platinum(), parseInt(e.currentTarget.value))
                    }}
                />
            </TooltipPrompter>
            <img class="h-7 w-7 ml-2" src={getComponentPicture(props.item, props.component)} />
            <p class="ml-2 text-white text-base font-light w-72">{props.component.name}</p>
            <div class="w-full h-full flex flex-row justify-end items-center">
                <Show when={!orderTask.isLoading && orderTask.response}
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
