import { Component, createEffect, createSignal, For, Match, Show, Switch } from "solid-js"
import { cleanComponentName, determineItemPicture, getStrictComponentPicture, isItemWithoutComponents, Order } from "../../../../scripts/inventory"
import { getOrdersFromType, OrderType } from "../../../../scripts/orders"
import { itemDisplay, setItemDisplay } from "../../../../stores/itemModal"
import { MenuButton } from "../MenuButton"
import { TabButton } from "../TabButton"
import { OrderButton } from "./__orders/OrderButton"

export const Orders: Component = () => {
    const [currentComponent, setCurrentComponent] = createSignal(itemDisplay.item.uniqueName);
    const [orderList, setOrderList] = createSignal<Order[]>([])

    createEffect(() => {
        currentComponent();
        setOrderList(getOrdersFromType(itemDisplay.orderSettings.type, currentComponent()));
    })

    return (
        <>
            <Switch fallback={
                <>
                    <div class="h-6 flex flex-row w-128 bg-[var(--c5)]">
                        <ul class="flex flex-row justify-start w-full">
                            <TabButton
                                text="Set"
                                img={determineItemPicture(itemDisplay.item)}
                                onClick={() => setCurrentComponent(itemDisplay.item.uniqueName)}
                                selected={currentComponent() == itemDisplay.item.uniqueName}
                            />
                            <For each={itemDisplay.item.components}>{(component) => (
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
                                onClick={() => setItemDisplay("orderSettings", "type", OrderType.SELLERS)}
                                selected={itemDisplay.orderSettings.type == OrderType.SELLERS}
                            />
                            <MenuButton
                                text="Buyers"
                                img="dashboard/orders/order-type.svg"
                                onClick={() => setItemDisplay("orderSettings", "type", OrderType.BUYERS)}
                                selected={itemDisplay.orderSettings.type == OrderType.BUYERS}
                            />
                        </ul>
                    </div>
                </>
            }>
                <Match when={isItemWithoutComponents(itemDisplay.item)}>
                    <div class="h-6 flex flex-row w-128">
                        <ul class="h-full flex flex-row justify-end w-full">
                            <MenuButton
                                text="Sellers"
                                img="dashboard/orders/order-type.svg"
                                onClick={() => setItemDisplay("orderSettings", "type", OrderType.SELLERS)}
                                selected={itemDisplay.orderSettings.type == OrderType.SELLERS}
                            />
                            <MenuButton
                                text="Buyers"
                                img="dashboard/orders/order-type.svg"
                                onClick={() => setItemDisplay("orderSettings", "type", OrderType.BUYERS)}
                                selected={itemDisplay.orderSettings.type == OrderType.BUYERS}
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
