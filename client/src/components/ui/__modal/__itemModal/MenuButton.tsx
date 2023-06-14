import { Motion } from "@motionone/solid"
import { Component, Match, Switch } from "solid-js"

type Props = {
    text: string,
    img: string,
    onClick: (e: MouseEvent & { currentTarget: HTMLButtonElement; target: Element; }) => void,
    selected: boolean
}

export const MenuButton: Component<Props> = (props) => {
    return (
        <Switch>
            <Match when={props.selected}>
                <Motion.button
                    class={`h-full w-fit bg-[var(--c2)] overflow-hidden flex flex-row justify-start items-center px-1`}
                >
                    <img class="h-4 w-4" src={props.img} />
                    <p class="text-white font-light text-left ml-1 text-sm">
                        {props.text}
                    </p>
                </Motion.button>
            </Match>
            <Match when={!props.selected}>
                <Motion.button
                    onClick={props.onClick}
                    class={`h-full w-fit bg-[var(--c3)] hover:bg-[var(--c1)] transition-colors duration-300 overflow-hidden flex flex-row justify-start items-center px-1`}

                >
                    <img class="h-4 w-4" src={props.img} />
                    <p class="text-white font-light text-left ml-1 text-sm">
                        {props.text}
                    </p>
                </Motion.button>
            </Match>
        </Switch>
    )
}
