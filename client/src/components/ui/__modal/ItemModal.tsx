import {
    Component as SComponent,
    Match,
    Switch
} from "solid-js"

import {
    determineItemPicture,
    isItemWithoutDescription,
    Item,

    ProductCategory
} from "../../../scripts/inventory";

import {
    ItemDisplayPage,
    itemDisplay,
    setItemDisplay
} from "../../../stores/itemModal"

import './ItemModal.scss'
import { TabButton } from "./__itemModal/TabButton";
import { Orders } from "./__itemModal/__views/Orders";
import { Stock } from "./__itemModal/__views/Stock";

export const ItemModal: SComponent = () => {
    return (
        <>
            <article class="w-full flex justify-start items-center pt-4">
                <img
                    class={`${itemDisplay.item.category == ProductCategory.MOD ? "w-24" : "w-32"} h-32 rounded-2xl ml-4`}
                    src={determineItemPicture(itemDisplay.item)}
                />
                <div class="h-28 flex flex-col items-start justify-start pl-4 pr-4">
                    <h1 class="text-white inline-block text-3xl font-bold">{itemDisplay.item.name}</h1>
                    <Switch fallback={
                        <p class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2">
                            {itemDisplay.item.description}
                        </p>
                    }>
                        <Match when={isItemWithoutDescription(itemDisplay.item)}>
                            <p class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2">
                                {getModLastStat(itemDisplay.item)}
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
                        onClick={() => setItemDisplay("page", ItemDisplayPage.STOCK)}
                        selected={itemDisplay.page == ItemDisplayPage.STOCK}
                    />
                    <TabButton
                        text="Orders"
                        img="dashboard/section-bar/market-logo.svg"
                        onClick={() => setItemDisplay("page", ItemDisplayPage.ORDERS)}
                        selected={itemDisplay.page == ItemDisplayPage.ORDERS}
                    />
                    {/*<TabButton
                                text="Drops"
                                img="dashboard/section-bar/drop-arrow.svg"
                                onClick={() => setModalPage(ModalPage.DROPS)}
                                selected={modalPage() == ModalPage.DROPS}
                            />*/}
                </ul>
                <Switch>
                    <Match when={itemDisplay.page == ItemDisplayPage.STOCK}>
                        <Stock />
                    </Match>
                    <Match when={itemDisplay.page == ItemDisplayPage.ORDERS}>
                        <Orders />
                    </Match>
                </Switch>
            </div>
        </>
    )
}

const getModLastStat = (item: Item): string => {
    return item.levelStats[item.levelStats.length - 1].stats[0] as string;
}
