import { Motion } from "@motionone/solid";
import { Component, Setter } from "solid-js";
import TooltipPrompter from "../../window/__tooltip/TooltipPrompter";
import { DashboardViews } from "../Dashboard";

type Props = {
    setView: Setter<DashboardViews>
}

export const Tabs: Component<Props> = (props) => {
    return (
        <nav class="flex flex-row mt-6">
            <div class="w-1/3 h-12 flex flex-row gap-6" />
            <div class="w-1/3 h-16 flex flex-row justify-center items-center gap-6">
                <TooltipPrompter prompt="Your Collection">
                    <Motion.button
                        hover={{ scale: 1.1 }}
                        press={{ scale: 0.95 }}
                        onClick={() => {
                            props.setView(DashboardViews.INVENTORY);
                        }}
                    >
                        <img
                            class="h-8 w-8"
                            src="/dashboard/section-bar/inventory-logo.svg"
                            alt="Part Collection Logo"
                        />
                    </Motion.button>
                </TooltipPrompter>
            </div>
            <div class="w-1/3 h-16 flex flex-row justify-end items-center gap-6 pr-6">
                <TooltipPrompter prompt="Settings">
                    <Motion.button
                        hover={{ scale: 1.1 }}
                        press={{ scale: 0.95 }}
                        onClick={() => {
                            props.setView(DashboardViews.SETTINGS);
                        }}
                    >
                        <img
                            class="h-8 w-8"
                            src="/dashboard/section-bar/settings-logo.svg"
                            alt="Part Collection Logo"
                        />
                    </Motion.button>
                </TooltipPrompter>
            </div>
        </nav>
    )
}
