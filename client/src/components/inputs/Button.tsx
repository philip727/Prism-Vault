import { Motion } from "@motionone/solid"
import { Component, createEffect, JSX, mergeProps } from "solid-js"
import { createStore } from "solid-js/store"
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
    const merged = mergeProps(props)
    const [colours, setColours] = createStore({backgroundClass: "--g1"})

    // Different types of buttons and their colours
    const updateColour = (colour: ButtonType) => {
        switch (colour) {
            case ButtonType.BACKING:
                setColours("backgroundClass", "--g1");
                break;
            case ButtonType.STANDOUT:
                setColours("backgroundClass", "--c1");
                break;
        }
    }

    createEffect(() => {
        updateColour(merged.colourType);
    })

    updateColour(merged.colourType);

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
