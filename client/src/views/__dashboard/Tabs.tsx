import { Motion } from "@motionone/solid";
import { Component, Setter } from "solid-js";
import TooltipPrompter from "../../window/__tooltip/TooltipPrompter";
import { DashboardViews } from "../Dashboard";

type Props = {
    setView: Setter<DashboardViews>
}

export const Tabs: Component<Props> = (props) => {
    return (
        <div class="flex flex-row mt-6">
            <div class="w-1/3 h-12 flex flex-row gap-6" />
            <div class="w-1/3 h-16 flex flex-row justify-center items-center gap-6 pl-4">
                <TooltipPrompter prompt="Part Collection">
                    <Motion.img
                        class="h-8 w-8"
                        src="/dashboard/section-bar/inventory-logo.svg"
                        hover={{ scale: 1.1 }}
                        press={{ scale: 0.95 }}
                        alt="Part Collection Logo"
                        onClick={() => {
                            props.setView(DashboardViews.INVENTORY);
                        }}
                    />
                </TooltipPrompter>
                <TooltipPrompter prompt="Market">
                    <Motion.img
                        class="h-8 w-8"
                        src="/dashboard/section-bar/market-logo.svg"
                        hover={{ scale: 1.1 }}
                        press={{ scale: 0.95 }}
                        alt="Market Logo"
                        onClick={() => {
                            props.setView(DashboardViews.MARKET);
                        }}
                    />
                </TooltipPrompter>
            </div>
        </div>
    )
}
