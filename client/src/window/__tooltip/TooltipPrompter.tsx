import { Motion } from "@motionone/solid"
import { Component, JSX } from "solid-js"
import { setShowTooltip, setTooltipText } from "./Manager"

type Props = {
    children?: JSX.Element
    prompt?: string
}

const TooltipPrompter: Component<Props> = (props) => {
    return (
        <Motion.div
            hover={{ scale: 1 }}
            onHoverStart={() => {
                console.log("hi");
                setShowTooltip(true);
                setTooltipText(props.prompt ? props.prompt : "")
            }}
            onHoverEnd={() => {
                setShowTooltip(false);
            }}
        >
            {props.children}
        </Motion.div>
    )
}

export default TooltipPrompter;
