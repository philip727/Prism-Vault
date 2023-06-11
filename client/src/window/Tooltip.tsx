import { Motion } from "@motionone/solid";
import { Component } from "solid-js"
import { showTooltip, tooltipText } from "./__tooltip/Manager"

export const Tooltip: Component = () => {
    let DISTANCE_BELOW_MOUSE = 30;
    let tooltip!: HTMLDivElement;
    let text!: HTMLHeadingElement;
    onmousemove = handleMouseMove

    function handleMouseMove(event: MouseEvent) {
        if (!showTooltip() || !tooltip || !text) return;

        tooltip.style.left = event.clientX - (text.clientWidth / 2) + 'px';
        tooltip.style.top = event.clientY + DISTANCE_BELOW_MOUSE + 'px';
    }

    return (
        <Motion.div
            ref={tooltip}
            class="absolute bg-[var(--c1)] px-2 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h1 ref={text} class="text-base text-white font-medium m-auto text-center max-w-[18rem]">{tooltipText()}</h1>
        </Motion.div>
    )
}
