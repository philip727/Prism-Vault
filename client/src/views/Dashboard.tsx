import { createSignal, Match, Switch } from "solid-js";
import { Inventory } from "./__dashboard/Inventory";
import { Tabs } from "./__dashboard/Tabs";

export enum DashboardViews {
    INVENTORY = "INVENTORY",
    MARKET = "MARKET"
}

const Dashboard = () => {
    let [view, setView] = createSignal<DashboardViews>(DashboardViews.INVENTORY);

    return (
        <div>
            <Tabs setView={setView} />
            <Switch>
                <Match when={view() === DashboardViews.INVENTORY}>
                    <Inventory />
                </Match>
                <Match when={view() === DashboardViews.MARKET}>

                </Match>
            </Switch>
        </div>
    )
}

export default Dashboard;
