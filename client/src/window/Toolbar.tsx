import { appWindow } from "@tauri-apps/api/window"
import { Component, createSignal, onCleanup, onMount } from "solid-js"

const Toolbar: Component = () => {
    let [focused, setFocused] = createSignal(false);
    let cleanUpFocus: null | Function = null;

    // Updates the focused signal when it's changed
    onMount(async () => {
        cleanUpFocus = await appWindow.onFocusChanged(({ payload: focused }) => {
            setFocused(focused);
        })
    })

    // Cleans up the focus change event
    onCleanup(() => {
        if (cleanUpFocus) {
            cleanUpFocus()
        }
    })

    return (
        <div
            data-tauri-drag-region
            class={`w-screen h-6 ${focused() ? "bg-[var(--c3)]" : "bg-[var(--c2)]"} absolute top-0 transition-colors duration-75
                    flex flex-row items-center justify-center z-[999]`}
        >
            <div
                data-tauri-drag-region
                class="w-1/3"
            />
            <div
                data-tauri-drag-region
                class="w-1/3"
            />
            <div
                data-tauri-drag-region
                class="w-1/3 flex flex-row items-center justify-end h-full select-none"
            >
                <button class="toolbar-icon px-2 h-full" onclick={() => appWindow.minimize()}>
                    <img class="h-3 w-3" src="toolbar/minimise.svg" />
                </button>
                <button class="toolbar-icon-important px-2 h-full" onclick={() => appWindow.close()}>
                    <img class="h-3 w-3" src="toolbar/exit.svg" />
                </button>
            </div>
        </div>
    )
}

export default Toolbar;
