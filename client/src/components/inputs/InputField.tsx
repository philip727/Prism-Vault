import { Component } from "solid-js"
import "./Inputs.scss"

type Props = {
    placeholder?: string,
    name?: string,
    type?: string,
    class?: string,
    maxLength?: number,
    showPrompt?: boolean,
    promptDetails?: string[],
    onChange?: (e: Event & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => void,
}

const InputField: Component<Props> = (props) => {
    return (
        <input 
            name={props.name}
            placeholder={props.placeholder}
            type={props.type}
            class={"focus-shadow w-72 h-10 bg-[var(--c5)] rounded-lg px-2 text-white " + props.class}
            maxLength={props.maxLength} 
            onChange={props.onChange}
        >

        </input>
    )
}

export default InputField;
