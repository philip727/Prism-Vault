import {
    Component as SComponent,
    createEffect,
    For,
    Match,
    onMount,
    Show,
    Switch
} from "solid-js"

import {
    determineItemPicture,
    isItemWithoutComponents,
    isItemWithoutDescription,
    Item,
    itemHasTradableParts,
    ProductCategory
} from "../../scripts/inventory";

import {
    itemShownOnModal,
    isItemModalOpen,
    setIsItemModalOpen,
    setTotalPiecePlatinumCount,
    totalPiecePlatinumCount,
    modalPage,
    ModalPage,
    getItemOrderWithNoComponents,
    getItemOrdersWithComponents,
    itemOrders,
    setModalPage
} from "../../stores/itemModal"

import {
    getComponentPlatinumPrice,
    getItemQuantity,
    getItemPlatinumPrice,
    parts,
    setParts
} from "../../stores/partCache";

import './ItemModal.scss'
import { PartShowcase } from "./__itemModal/PartShowcase";
import { SellShowcase } from "./__itemModal/SellShowcase";
import { TabButton } from "./__itemModal/TabButton";
import { Orders } from "./__itemModal/__views/Orders";
import { Stock } from "./__itemModal/__views/Stock";

export const ItemModal: SComponent = () => {
    onMount(() => {
        // Sets up the item modal stock page
        const item = itemShownOnModal();

        // An item without components, like a syndicate weapon
        if (isItemWithoutComponents(item)) {
            if (item.tradable && typeof parts[item.uniqueName] == "undefined") {
                setParts(item.uniqueName, { platinum: 0, quantity: 0, lastPlatinumUpdate: 0, lastQuantityUpdate: 0 })
            }

            getItemPlatinumPrice(item);
            getItemQuantity([item.uniqueName]);
            getItemOrderWithNoComponents(item);
            return;
        }

        // Sets up the default values of a part
        for (let i = 0; i < item.components.length; i++) {
            const component = item.components[i];

            // If we already have the part platinum price, then there is no reason to set it up again
            if (!component.tradable || typeof parts[component.uniqueName] != "undefined") {
                continue;
            }

            setParts(component.uniqueName, { platinum: 0, quantity: 0, lastPlatinumUpdate: 0, lastQuantityUpdate: 0 });
        }

        // Gets the platinum price of each components
        for (let i = 0; i < item.components.length; i++) {
            const component = item.components[i];

            getComponentPlatinumPrice(item, component);
        }

        // Gets all the unique component names
        const uniqueNames: string[] = []
        for (let i = 0; i < item.components.length; i++) {
            const component = item.components[i];
            if (component.tradable) {
                uniqueNames.push(component.uniqueName);
            }
        }

        getItemQuantity(uniqueNames);
        getItemOrdersWithComponents(item);

        // Sets the total piece plat count which is calculated afterwards
        setTotalPiecePlatinumCount(0);
    })

    createEffect(() => {
        modalPage(); // the dependency 
        setTotalPiecePlatinumCount(0);
    })

    createEffect(() => {
        console.log(itemOrders());
    })

    return (
        <Show when={isItemModalOpen()}>
            <div class="absolute top-6 bg-[#0000009E] h-full w-screen z-[990]">
                <div class="absolute top-1/2 left-1/2 z-[991] w-[44rem] h-[32rem] bg-[var(--c4)] -mx-[22rem] -my-[16rem]">
                    <div class="w-full h-6 bg-[var(--c3)] flex items-center">
                        <div class="w-1/3" />
                        <div class="w-1/3 flex justify-center items-center" />
                        <div class="w-1/3 flex justify-end items-center">
                            <button class="toolbar-icon px-2 h-6" onClick={() => {
                                setIsItemModalOpen(false);
                            }}>
                                <p class="text-white select-none">{"->"}</p>
                            </button>
                        </div>
                    </div>
                    <article class="w-full flex justify-start items-center pt-4">
                        <img
                            class={`${itemShownOnModal().category == ProductCategory.MOD ? "w-24" : "w-32"} h-32 rounded-2xl ml-4`}
                            src={determineItemPicture(itemShownOnModal())}
                        />
                        <div class="h-28 flex flex-col items-start justify-start pl-4 pr-4">
                            <h1 class="text-white inline-block text-3xl font-bold">{itemShownOnModal().name}</h1>
                            <Switch fallback={
                                <p class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2">
                                    {itemShownOnModal().description}
                                </p>
                            }>
                                <Match when={isItemWithoutDescription(itemShownOnModal())}>
                                    <p class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2">
                                        {getModLastStat(itemShownOnModal())}
                                    </p>
                                </Match>
                            </Switch>
                        </div>
                    </article>
                    <div class="w-full flex flex-col gap-2 mt-4 ml-4">
                        <ul class="h-6 flex flex-row bg-[var(--c5)] w-128">
                            <TabButton
                                text="Stock"
                                img="dashboard/section-bar/inventory-logo.svg"
                                onClick={() => setModalPage(ModalPage.STOCK)}
                                selected={modalPage() == ModalPage.STOCK}
                            />
                            <TabButton
                                text="Orders"
                                img="dashboard/section-bar/market-logo.svg"
                                onClick={() => setModalPage(ModalPage.ORDERS)}
                                selected={modalPage() == ModalPage.ORDERS}
                            />
                            <TabButton
                                text="Drops"
                                img="dashboard/section-bar/drop-arrow.svg"
                                onClick={() => setModalPage(ModalPage.DROPS)}
                                selected={modalPage() == ModalPage.DROPS}
                            />
                        </ul>
                        <Switch>
                            <Match when={modalPage() == ModalPage.STOCK}>
                                <Stock />
                            </Match>
                            <Match when={modalPage() == ModalPage.ORDERS}>
                                <Orders />
                            </Match>
                        </Switch>
                    </div>
                </div>
            </div>
        </Show>
    )
}

const getModLastStat = (item: Item): string => {
    return item.levelStats[item.levelStats.length - 1].stats[0] as string;
}
