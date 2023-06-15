import { Motion } from "@motionone/solid";
import { Component, createSignal, JSX, mergeProps } from "solid-js"
import { Prompt } from "../ui/Prompt";
import "./Inputs.scss"

type Props = {
    ref?: HTMLInputElement,
    placeholder?: string,
    name?: string,
    type?: string,
    class?: string,
    maxLength?: number,
    showPrompt?: boolean,
    promptDetails?: string[],
    onChange?: (e: Event & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => void,
    onKeyUp?: (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }) => any,
    value?: string
    prompt?: {
        enabled: boolean,
        text: string[]
    }
}

const InputField: Component<Props> = (props) => {
    const [focused, setFocused] = createSignal(false);
    const merged = mergeProps({ value: "" }, props);

    return (
        <div class="relative">
            <Motion.input
                ref={props.ref}
                name={props.name}
                placeholder={props.placeholder}
                type={props.type}
                class={"focus-shadow w-72 h-10 bg-[var(--c5)] rounded-lg px-2 text-white" + " " + props.class}
                maxLength={props.maxLength}
                onChange={props.onChange}
                onKeyUp={props.onKeyUp}
                value={merged.value}
                onFocusIn={() => {
                    setFocused(true);
                }}
                onFocusOut={() => {
                    setFocused(false);
                }}
            />
            <Prompt when={props.prompt?.enabled && focused()} text={props.prompt?.text} />
        </div>
    )
}

export default InputField;
