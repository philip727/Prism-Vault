import { Component as SComponent, For, Match, Show, Switch } from "solid-js"
import { createStore } from "solid-js/store";
import { cleanWikiaThumbnail, isItemWithoutComponents, isItemWithoutDescription, itemHasTradableParts, ProductCategory } from "../../scripts/inventory";
import { itemDetails, itemModal, setItemModal } from "../../stores/itemModal"
import './ItemModal.scss'
import { PartShowcase } from "./__itemModal/PartShowcase";
import { SellShowcase } from "./__itemModal/SellShowcase";

type Part = {
    quantity: number,
    platinum: number
}

export const ItemModal: SComponent = () => {
    const [parts, setParts] = createStore<{ [key: string]: Part }>();

    const handleUpdate = (componentName: string, componentPrice: number, componentQuantity: number) => {
        setParts(componentName, { quantity: componentQuantity, platinum: componentPrice });

        console.log(parts);
    }

    return (
        <Show when={itemModal()}>
            <div class="absolute top-6 bg-[#0000009E] h-full w-screen z-[990]">
                <div class="absolute top-1/2 left-1/2 z-[991] w-[44rem] h-[32rem] bg-[var(--c4)] -mx-[22rem] -my-[16rem]">
                    <div class="w-full h-6 bg-[var(--c3)] flex items-center">
                        <div class="w-1/3" />
                        <div class="w-1/3 flex justify-center items-center" />
                        <div class="w-1/3 flex justify-end items-center">
                            <button class="toolbar-icon px-2 h-6" onClick={() => {
                                setItemModal(false);
                            }}>
                                <p class="text-white">{"->"}</p>
                            </button>
                        </div>
                    </div>
                    <article class="w-full flex justify-start items-center pt-4">
                        <Switch fallback={
                            <img class="w-32 h-32 bg-[var(--c5)] rounded-2xl ml-4" src={cleanWikiaThumbnail(itemDetails().wikiaThumbnail)} />
                        }>
                            <Match when={itemDetails().category == ProductCategory.MOD}>
                                <img class="w-24 h-32 rounded-2xl ml-4" src={cleanWikiaThumbnail(itemDetails().wikiaThumbnail)} />
                            </Match>
                        </Switch>
                        <div class="h-28 flex flex-col items-start justify-start pl-4 pr-4">
                            <h1 class="text-white inline-block text-3xl font-bold">{itemDetails().name}</h1>
                            <Switch fallback={
                                <p class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2">{itemDetails().description}</p>
                            }>
                                <Match when={isItemWithoutDescription(itemDetails())}>
                                    <p
                                        class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2"
                                    >
                                        {itemDetails().levelStats[itemDetails().levelStats.length - 1].stats[0]}
                                    </p>
                                </Match>
                            </Switch>
                        </div>
                    </article>
                    <div class="w-full flex flex-col gap-2 mt-4 ml-4">
                        <h1 class="text-white text-2xl font-semibold">Your Stock</h1>
                        <Switch>
                            <Match when={isItemWithoutComponents(itemDetails())}>
                                <SellShowcase item={itemDetails()} /> 
                            </Match>
                            <Match when={itemHasTradableParts(itemDetails())}>
                                <For each={itemDetails().components}>{(component) => (
                                    <Show when={component.tradable}>
                                        <PartShowcase item={itemDetails()} component={component} handleUpdate={handleUpdate} />
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
