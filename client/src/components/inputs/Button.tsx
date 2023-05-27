import { Motion } from "@motionone/solid"
import { Component, JSX } from "solid-js"
import "./Inputs.scss"

export enum ButtonType {
    STANDOUT = "STAND-OUT",
    BACKING = "BACKING",
}

type Props = {
    colourType: ButtonType,
    type?: "button" | "reset" | "submit",
    children?: JSX.Element,
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>,
}

const Button: Component<Props> = (props) => {
    const colours = {
        backgroundClass: "--g1",
    }

    // Different types of buttons and their colours
    switch (props.colourType) {
        case ButtonType.BACKING:
            colours.backgroundClass = "--g1";
            break;
        case ButtonType.STANDOUT:
            colours.backgroundClass = "--c1";
            break;
    }

    return (
        <Motion.button
            class={`w-[8.5rem] h-10 rounded-lg focus-shadow hover-shadow`}
            style={{ "background-color": `var(${colours.backgroundClass})` }}
            press={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={props.onClick}
            type={props.type}
        >
            {props.children}
        </Motion.button>
    )
}


export default Button;
