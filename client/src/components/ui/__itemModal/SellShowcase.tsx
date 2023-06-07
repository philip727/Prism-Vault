import { invoke } from "@tauri-apps/api"
import { Component, createEffect, createSignal, Show } from "solid-js"
import { Loading } from "../../../assets/Loading"
import createTask from "../../../hooks/createTask"
import { Item, Order } from "../../../scripts/inventory"
import TooltipPrompter from "../../../window/__tooltip/TooltipPrompter"
import InputField from "../../inputs/InputField"

type Props = {
    item: Item
}




export const SellShowcase: Component<Props> = (props) => {
    const [platinum, setPlatinum] = createSignal<number>(0)

    let marketQueryString = props.item.name.replaceAll(" ", "_").toLowerCase();
    console.log(marketQueryString)
    const orderTask = createTask<Order, String>(invoke("get_order", { itemName: marketQueryString }));

    createEffect(() => {
        if (orderTask.isLoading || !orderTask.response) {
            return;
        }

        setPlatinum(orderTask.response.platinum);
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
