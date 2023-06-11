import { Component, JSX, mergeProps } from "solid-js"
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
    onKeyUp?: (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; })  => any,
    value?: string
}

const InputField: Component<Props> = (props) => {
    const merged = mergeProps({value: ""}, props)
    return (
        <input 
            ref={props.ref}
            name={props.name}
            placeholder={props.placeholder}
            type={props.type}
            class={"focus-shadow w-72 h-10 bg-[var(--c5)] rounded-lg px-2 text-white " + props.class}
            maxLength={props.maxLength} 
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            value={merged.value}
        />
    )
}

export default InputField;
