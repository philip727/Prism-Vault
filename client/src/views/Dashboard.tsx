import { createSignal, Match, Switch } from "solid-js";
import { Inventory } from "./__dashboard/Inventory";
import { Tabs } from "./__dashboard/Tabs";
import { getClient } from '@tauri-apps/api/http'
import axios from "axios";

export enum DashboardViews {
    INVENTORY = "INVENTORY",
    MARKET = "MARKET"
}

const Dashboard = () => {
    let [view, setView] = createSignal<DashboardViews>(DashboardViews.INVENTORY);


    //test();

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


const test = async () => {
    axios.post("http://127.0.0.1:8080/item/add","banana", {
        headers: {
            "Session-Token": "cfdad6987d48259bc9b31f6fa01d7b4ff16de1268cd3a590344644287f23cbd8",
            "Access-Control-Allow-Origin": "http://127.0.0.1:8080"
        }
    })
}

export default Dashboard;
