import { createSignal } from "solid-js";

export const [showTooltip, setShowTooltip] = createSignal(false);
export const [tooltipText, setTooltipText] = createSignal("");
