import { Component, createEffect, createSignal, For, Match, Show, Switch } from "solid-js"
import { cleanComponentName, determineItemPicture, getMarketQuery, getStrictComponentPicture, isItemWithoutComponents, Order } from "../../../../scripts/inventory"
import { getOrdersFromType, OrderType } from "../../../../scripts/orders"
import { itemShownOnModal } from "../../../../stores/itemModal"
import { orderType, setOrderType } from "../../../../stores/orders"
import { MenuButton } from "../MenuButton"
import { TabButton } from "../TabButton"
import { OrderButton } from "./__orders/OrderButton"

export const Orders: Component = () => {
    const [currentComponent, setCurrentComponent] = createSignal(itemShownOnModal().uniqueName);
    const [orderList, setOrderList] = createSignal<Order[]>([])

    createEffect(() => {
        currentComponent();
        setOrderList(getOrdersFromType(orderType(), currentComponent()));
    })

    return (
        <>
            <Switch fallback={
                <>
                    <div class="h-6 flex flex-row w-128 bg-[var(--c5)]">
                        <ul class="flex flex-row justify-start w-full">
                            <TabButton
                                text="Set"
                                img={determineItemPicture(itemShownOnModal())}
                                onClick={() => setCurrentComponent(itemShownOnModal().uniqueName)}
                                selected={currentComponent() == itemShownOnModal().uniqueName}
                            />
                            <For each={itemShownOnModal().components}>{(component) => (
                                <Show when={component.tradable}>
                                    <TabButton
                                        text={cleanComponentName(component.name)}
                                        img={getStrictComponentPicture(component)}
                                        onClick={() => setCurrentComponent(component.uniqueName)}
                                        selected={currentComponent() == component.uniqueName}
                                    />
                                </Show>
                            )}</For>
                        </ul>
                    </div>
                    <div class="h-6 flex flex-row w-128">
                        <ul class="h-full flex flex-row justify-end w-full">
                            <MenuButton
                                text="Sellers"
                                img="dashboard/orders/order-type.svg"
                                onClick={() => setOrderType(OrderType.SELLERS)}
                                selected={orderType() == OrderType.SELLERS}
                            />
                            <MenuButton
                                text="Buyers"
                                img="dashboard/orders/order-type.svg"
                                onClick={() => setOrderType(OrderType.BUYERS)}
                                selected={orderType() == OrderType.BUYERS}
                            />
                        </ul>
                    </div>
                </>
            }>
                <Match when={isItemWithoutComponents(itemShownOnModal())}>
                    <div class="h-6 flex flex-row w-128">
                        <ul class="h-full flex flex-row justify-end w-full">
                            <MenuButton
                                text="Sellers"
                                img="dashboard/orders/order-type.svg"
                                onClick={() => setOrderType(OrderType.SELLERS)}
                                selected={orderType() == OrderType.SELLERS}
                            />
                            <MenuButton
                                text="Buyers"
                                img="dashboard/orders/order-type.svg"
                                onClick={() => setOrderType(OrderType.BUYERS)}
                                selected={orderType() == OrderType.BUYERS}
                            />
                        </ul>
                    </div>
                </Match>
            </Switch>
            <ul class="w-128 h-52 bg-[var(--c5)] overflow-y-scroll order-button-scrollbar">
                <For each={orderList()}>{(order, index) => (
                    <OrderButton order={order} index={index()} />
                )}</For>
            </ul>
        </>
    )
}
