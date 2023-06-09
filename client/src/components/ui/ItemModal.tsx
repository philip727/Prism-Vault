import { Component as SComponent, createEffect, For, Match, Show, Switch } from "solid-js"
import { cleanWikiaThumbnail, isItemWithoutComponents, isItemWithoutDescription, Item, itemHasTradableParts, ProductCategory } from "../../scripts/inventory";
import { itemShownOnModal, isItemModalOpen, setIsItemModalOpen } from "../../stores/itemModal"
import { getComponentPlatinumPrice, getSingleItemPlatinumPrice, parts, setParts } from "../../stores/partCache";
import './ItemModal.scss'
import { PartShowcase } from "./__itemModal/PartShowcase";
import { SellShowcase } from "./__itemModal/SellShowcase";

export const ItemModal: SComponent = () => {
    createEffect(() => {
        if (!isItemModalOpen()) {
            return;
        }

        // An item without components, like a syndicate weapon
        if (isItemWithoutComponents(itemShownOnModal())) {
            setupSingleItemOnOpen(itemShownOnModal());
            getSingleItemOnOpen(itemShownOnModal());
            return;
        }

        // 90% of these are prime parts 
        setupPartsOnOpen(itemShownOnModal());
        getPartDetailsOnOpen(itemShownOnModal());
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
                                <p class="text-white">{"->"}</p>
                            </button>
                        </div>
                    </div>
                    <article class="w-full flex justify-start items-center pt-4">
                        <Switch fallback={
                            <img class="w-32 h-32 bg-[var(--c5)] rounded-2xl ml-4" src={cleanWikiaThumbnail(itemShownOnModal().wikiaThumbnail)} />
                        }>
                            <Match when={itemShownOnModal().category == ProductCategory.MOD}>
                                <img class="w-24 h-32 rounded-2xl ml-4" src={cleanWikiaThumbnail(itemShownOnModal().wikiaThumbnail)} />
                            </Match>
                        </Switch>
                        <div class="h-28 flex flex-col items-start justify-start pl-4 pr-4">
                            <h1 class="text-white inline-block text-3xl font-bold">{itemShownOnModal().name}</h1>
                            <Switch fallback={
                                <p class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2">{itemShownOnModal().description}</p>
                            }>
                                <Match when={isItemWithoutDescription(itemShownOnModal())}>
                                    <p
                                        class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2"
                                    >
                                        {getModLastStat(itemShownOnModal())}
                                    </p>
                                </Match>
                            </Switch>
                        </div>
                    </article>
                    <div class="w-full flex flex-col gap-2 mt-4 ml-4">
                        <h1 class="text-white text-2xl font-semibold">Your Stock</h1>
                        <Switch>
                            <Match when={isItemWithoutComponents(itemShownOnModal())}>
                                <SellShowcase item={itemShownOnModal()} />
                            </Match>
                            <Match when={itemHasTradableParts(itemShownOnModal())}>
                                <For each={itemShownOnModal().components}>{(component) => (
                                    <Show when={component.tradable}>
                                        <PartShowcase item={itemShownOnModal()} component={component} />
                                    </Show>
                                )}</For>
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


// Sets up a single item with its unique name in the part store
const setupSingleItemOnOpen = (item: Item) => {
    // If we already have the part platinum price, then there is no reason to set it up again
    if (!item.tradable || typeof parts[item.uniqueName] != "undefined") {
        return;
    }

    setParts(item.uniqueName, { platinum: 0, quantity: 0, lastPlatinumUpdate: 0 })
}

// Sets up the components of an item in the part store by the components unique name
const setupPartsOnOpen = (item: Item) => {
    for (let i = 0; i < item.components.length; i++) {
        const component = item.components[i];

        // If we already have the part platinum price, then there is no reason to set it up again
        if (!component.tradable || typeof parts[component.uniqueName] != "undefined") {
            continue;
        }

        setParts(component.uniqueName, { platinum: 0, quantity: 0, lastPlatinumUpdate: 0 });
    }
}

// Gets the single item details when modal details is opened
const getSingleItemOnOpen = async (item: Item) => {
    getSingleItemPlatinumPrice(item);
}

const getPartDetailsOnOpen = async (item: Item) => {
    for (let i = 0; i < item.components.length; i++) {
        const component = item.components[i];

        getComponentPlatinumPrice(item, component);
    }
}

