import { Component, JSX } from "solid-js"
import "./Inputs.scss"

export enum ButtonType {
    STANDOUT = "STAND-OUT",
    BACKING = "BACKING",
}

type Props = {
    type: ButtonType,
    children?: JSX.Element,
}

const Button: Component<Props> = (props) => {
    const colours = {
        backgroundClass: "--g1",
    }

    switch (props.type) {
        case ButtonType.BACKING:
            colours.backgroundClass = "--g1";
            break;
        case ButtonType.STANDOUT:
            colours.backgroundClass = "--c1";
            break;
    }

    return (
        <button class={`w-[8.5rem] h-10 bg-[var(${colours.backgroundClass})] rounded-lg focus-shadow hover-shadow`}>
            {props.children}
        </button>
    )
}


export default Button;
