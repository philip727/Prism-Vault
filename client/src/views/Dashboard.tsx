import { createSignal, Match, Switch } from "solid-js";
import { Inventory } from "./__dashboard/Inventory";
import { Settings } from "./__dashboard/Settings";
import { Tabs } from "./__dashboard/Tabs";

export enum DashboardViews {
    INVENTORY = "INVENTORY",
    SETTINGS = "SETTINGS",
}

const Dashboard = () => {
    let [view, setView] = createSignal<DashboardViews>(DashboardViews.INVENTORY);

    return (
        <>
            <Tabs setView={setView} />
            <Switch>
                <Match when={view() === DashboardViews.INVENTORY}>
                    <Inventory />
                </Match>
                <Match when={view() === DashboardViews.SETTINGS}>
                    <Settings />
                </Match>
            </Switch>
        </>
    )
}

export default Dashboard;
