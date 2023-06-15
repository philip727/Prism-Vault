import { Component, For, Show } from "solid-js"

type Props = {
    text?: string[],
    when?: boolean,
}

export const Prompt: Component<Props> = (props) => {
    return (
        <Show when={props.when}>
            <div
                class="absolute w-72 top-11 flex flex-col bg-[var(--c3)] h-fit z-[99] rounded-md py-1 gap-1"
            >
                <For each={props.text}>{(text) => (
                    <div class="flex flex-row items-center justify-start gap-2 ml-2">
                        <div class="w-2 h-2 bg-[var(--c1)] rotate-45"/>
                        <p class="text-white font-light text-left max-w-[250px]">
                            {text}
                        </p>
                    </div>
                )}</For>
            </div>
        </Show>
    )
}
