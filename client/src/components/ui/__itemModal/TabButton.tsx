import { Motion } from "@motionone/solid"
import { Component, createEffect, createSignal, Match, Show, Switch } from "solid-js"
import { modalPage, setModalPage } from "../../../stores/itemModal";
import './TabButton.scss'

type Props = {
    text: string,
    img: string,
    page: ModalPage,
}

const DEFAULT_BUTTON_WIDTH = 24;
const DEFAULT_PADDING_WIDTH = 4;


export const TabButton: Component<Props> = (props) => {
    let [textElement, setTextElement] = createSignal<HTMLParagraphElement>();
    let [width, setWidth] = createSignal(0);

    createEffect(() => {
        const localText = textElement();
        if (typeof localText == "undefined" || !localText) {
            return
        }

        updateWidth(localText.offsetWidth + DEFAULT_PADDING_WIDTH + DEFAULT_BUTTON_WIDTH)
    })

    const updateWidth = (textWidth: number) => {
        setWidth(textWidth);
    }

    return (
        <Switch fallback={
            <Motion.button
                class={`h-full w-6 bg-[var(--c3)] hover:bg-[var(--c1)] overflow-hidden flex flex-row justify-start items-center px-1`}
                initial={{ width: `${width()}px` }}
                animate={{ width: "1.5rem" }}
                hover={{ width: `${width()}px` }}
                transition={{ duration: 0.3 }}
                onClick={() => setModalPage(props.page)}
            >
                <img class="h-4 w-4" src={props.img} />
                <p ref={(el) => setTextElement(el)} class="text-white font-light text-left ml-1">
                    {props.text}
                </p>
            </Motion.button>
        }>
            <Match when={modalPage() == props.page}>
                <Motion.button
                    class={`h-full w-6 bg-[var(--c2)] overflow-hidden flex flex-row justify-start items-center px-1`}
                    style={{ width: `${width()}px` }}
                >
                    <img class="h-4 w-4" src={props.img} />
                    <p ref={(el) => setTextElement(el)} class="text-white font-light text-left ml-1">
                        {props.text}
                    </p>
                </Motion.button>
            </Match>
        </Switch>
    )
}
