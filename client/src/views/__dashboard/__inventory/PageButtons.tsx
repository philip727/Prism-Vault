import { Component, For, Show } from "solid-js"
import { ButtonType } from "../../../components/inputs/Button";
import DynamicButton from "../../../components/inputs/DynamicButton";
import { getPageSearches, inventory, pageOffset, setPageOffset } from "../../../stores/inventory";

const MAX_PAGE_BUTTONS = 6;

export const PageButtons: Component = () => {
    return (
        <ol class="flex w-full gap-6 justify-center mt-6">
            <Show
                when={inventory.maxPage > MAX_PAGE_BUTTONS && pageOffset() > 0}
                fallback={
                    <div class="w-[107px] " />
                }
            >
                <DynamicButton
                    colourType={ButtonType.STANDOUT}
                    onClick={() => setPageOffset(prev => prev - 1)}
                >
                    <div class="w-[75px] h-full flex items-center justify-center">
                        <p class="text-white text-center select-none">{"<- Prev"}</p>
                    </div>
                </DynamicButton>
            </Show>
            <For each={getButtons(inventory.maxPage, pageOffset())}>{(num) => (
                <DynamicButton
                    colourType={inventory.page === num ? ButtonType.STANDOUT : ButtonType.BACKING}
                    onClick={() => {
                        getPageSearches(num);
                    }}
                >
                    <div class="w-full h-full flex items-center justify-center">
                        <div class="w-[12px] flex items-center justify-center">
                            <p class={`${inventory.page === num ? "text-white" : "text-black"} select-none`}>{num}</p>
                        </div>
                    </div>
                </DynamicButton>
            )}
            </For>
            <Show
                when={inventory.maxPage > MAX_PAGE_BUTTONS && pageOffset() + MAX_PAGE_BUTTONS < inventory.maxPage}
                fallback={
                    <div class="w-[107px] " />
                }
            >
                <DynamicButton
                    colourType={ButtonType.STANDOUT}
                    onClick={() => setPageOffset(prev => prev + 1)}
                >
                    <div class="w-[75px] h-full flex items-center justify-center">
                        <p class="text-white text-center select-none">{"Next ->"}</p>
                    </div>
                </DynamicButton>
            </Show>
        </ol>
    )
}

const getButtons = (pages: number, offset: number): Array<number> => {
    let buttons = [];
    for (let i = 0; i < pages; i++) {
        if (i == MAX_PAGE_BUTTONS) {
            break;
        }
        buttons.push(i + 1 + offset);
    }

    return buttons;
}

