import { Component, Match, Show, Switch } from "solid-js"
import { itemDetails, itemModal, setItemModal } from "../../stores/itemModal"
import { cleanWikiaThumbnail } from "../../views/__dashboard/__inventory/Card";
import './ItemModal.scss'

export const ItemModal: Component = () => {
    return (
        <Show when={itemModal()}>
            <div class="absolute top-6 bg-[#0000009E] h-full w-screen z-[990]">
                <div class="absolute top-1/2 left-1/2 z-[991] w-[40rem] h-[28rem] bg-[var(--c4)] -mx-[20rem] -my-[14rem]">
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
                    <div class="w-full flex justify-start items-center pt-4">
                        <Switch>
                            <Match when={itemDetails.category !== "Mods"}>
                                <img class="w-32 h-32 bg-[var(--c5)] rounded-2xl ml-4" src={cleanWikiaThumbnail(itemDetails.wikiaThumbnail)} />
                            </Match>
                            <Match when={itemDetails.category == "Mods"}>
                                <img class="w-24 h-32 rounded-2xl ml-4" src={cleanWikiaThumbnail(itemDetails.wikiaThumbnail)} />
                            </Match>
                        </Switch>
                        <div class="h-28 flex flex-col items-start justify-start pl-4 pr-4">
                            <h1 class="text-white inline-block text-3xl font-bold">{itemDetails.name}</h1>
                            <Switch>
                                <Match when={itemDetails.category !== "Mods"}>
                                    <p class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2">{itemDetails.description}</p>
                                </Match>
                                <Match when={itemDetails.category == "Mods"}>
                                    <p
                                        class="text-white text-lg font-light leading-6 max-h-32 overflow-y-scroll description-scrollbar pr-2"
                                    >
                                        {itemDetails.levelStats[itemDetails.levelStats.length - 1].stats[0]}
                                    </p>
                                </Match>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    )
}
