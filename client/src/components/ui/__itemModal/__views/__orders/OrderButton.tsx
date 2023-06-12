import { Motion } from "@motionone/solid"
import { Component, createSignal, Show } from "solid-js"
import { Order } from "../../../../../scripts/inventory"
import { getColourFromStatus, OrderType } from "../../../../../scripts/orders"
import { orderType } from "../../../../../stores/orders"
import TooltipPrompter from "../../../../../window/__tooltip/TooltipPrompter"
import '../Orders.scss'

type Props = {
    order: Order
    index: number,
}

export const OrderButton: Component<Props> = (props) => {
    const colour = getColourFromStatus(props.order.user.status)
    const [hovering, setHovering] = createSignal(false);
    const itemName = props.order.query?.replaceAll("_", " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    const action = orderType() == OrderType.SELLERS ? "buy" : "sell";
    const clipboardMessage = `/w ${props.order.user.ingameName} Hi! I want to ${action}: "${itemName}" for ${props.order.platinum} platinum. (warframe.market)`;

    return (
        <Motion.li
            class={`w-full h-9 bg-[var(--c3)] flex flex-row ${props.index > 0 ? "mt-[2px]" : ""} relative`}
            hover={{ height: "asdasd" }}
            onHoverStart={() => {
                setHovering(true);
            }}
            onHoverEnd={() => {
                setHovering(false);
            }}
        >
            <div class="h-full w-[52%] flex flex-row items-center justify-start">
                <p class="text-white font-normal ml-2 text-sm">{props.order.user.ingameName}</p>
            </div>
            <div class="w-[22%] h-full flex flex-row items-center justify-start">
                <p
                    class="font-normal ml-2 text-sm tracking-wider"
                    style={{ color: colour }}
                >{capitaliseWord(props.order.user.status)}</p>
            </div>
            <div class="h-full w-[13%] flex flex-row justify-end items-center">
                <TooltipPrompter prompt="Quantity">
                    <p class="text-white font-medium mr-1 text-sm">{props.order.quantity}</p>
                </TooltipPrompter>
                <img class="w-5 h-5 mr-2" src="dashboard/orders/quantity.svg" />
            </div>
            <div class="h-full w-[13%] flex flex-row items-center justify-end">
                <p class="text-white font-medium mr-1 text-sm">{props.order.platinum}</p>
                <img class="w-4 h-4 mr-2" src="warframe/platinum.webp" />
            </div>
            <Show when={hovering()}>
                <button 
                    class="absolute top-0 left-0 bg-[var(--c1)] w-full h-full flex flex-row items-center justify-start cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(clipboardMessage)}
                >
                    <p class="text-white text-sm ml-2">{`Copy message to ${action} item`}</p>
                </button>
            </Show>
        </Motion.li>
    )
}

const capitaliseWord = (word: string) => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}
