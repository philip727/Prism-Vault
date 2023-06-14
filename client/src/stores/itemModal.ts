import { invoke } from "@tauri-apps/api";
import { createStore } from "solid-js/store";
import { Component, getMarketQuery, isItemWithoutComponents, Item, newItem, Order } from "../scripts/inventory";
import { OrderType } from "../scripts/orders";
import unwrapPromise from "../scripts/utils/unwrapPromise";
import { getComponentPlatinumPrice, getItemPlatinumPrice, getItemQuantity, parts, setParts } from "./partCache";

export enum ItemDisplayPage {
    STOCK = "STOCK",
        ORDERS = "ORDERS",
        DROPS = "DROPS",
}

type ItemDisplay = {
    item: Item,
    partPlatinumTotal: number,
    page: ItemDisplayPage,
    orders: { [key: string]: Array<Order> },
    orderSettings: {
        type: OrderType
    }
}

export const [itemDisplay, setItemDisplay] = createStore<ItemDisplay>({
    item: newItem(),
    partPlatinumTotal: 0,
    page: ItemDisplayPage.STOCK,
    orders: {},
    orderSettings: {
        type: OrderType.SELLERS
    }
})

export const updateItemDisplay = (item: Item) => {
    setItemDisplay("item", item);
}

export const updateOrdersWithQueryString = (orders: Array<Order>, query: string): Array<Order> => {
    for (let i = 0; i < orders.length; i++) {
        orders[i].query = query;
    }

    return orders;
}

// Gets the orders of a single item
export const getItemOrderWithNoComponents = async (item: Item) => {
    let order: { [key: string]: Array<Order> } = {};

    // Gets the query string of a component with no components
    let marketQuery = getMarketQuery(item);
    let { err, result } = await unwrapPromise<Array<Order>, string>(invoke("get_orders", { itemName: marketQuery }));
    if (err || !result) {
        return;
    }

    order[item.uniqueName] = updateOrdersWithQueryString(result, marketQuery);

    setItemDisplay("orders", order);
}

// Gets the order of each component on an item and its set
export const getItemOrdersWithComponents = async (item: Item) => {
    let orders: { [key: string]: Array<Order> } = {};

    // Gets the query string of a set
    let marketQuery = getMarketQuery(item);

    let { err, result } = await unwrapPromise<Array<Order>, string>(invoke("get_orders", { itemName: marketQuery }));
    if (!err && result) {
        orders[item.uniqueName] = updateOrdersWithQueryString(result, marketQuery);
    }

    // Gets the platinum price of each components
    for (let i = 0; i < item.components.length; i++) {
        const component = item.components[i];
        let { err, result } = await unwrapPromise<Array<Order>, string>(getComponentOrder(item, component));
        if (err || !result) {
            continue;
        }

        // Array already has its correct queries
        orders[component.uniqueName] = result;
    }

    setItemDisplay("orders", orders);
}

// Gets the order of a component
const getComponentOrder = async (item: Item, component: Component): Promise<Array<Order>> => {
    let marketQuery = getMarketQuery(item, component);
    let { err, result } = await unwrapPromise<Array<Order>, string>(invoke("get_orders", { itemName: marketQuery }));
    return new Promise((resolve, reject) => {
        if (err) {
            return reject(err);
        }

        if (!result) {
            return reject("No orders returned");
        }

        result = updateOrdersWithQueryString(result, marketQuery)
        return resolve(result);
    })
}

export const setupItemForModalDisplay = () => {
        // Sets up the item modal stock page
        const item = itemDisplay.item;

        // An item without components, like a syndicate weapon
        if (isItemWithoutComponents(item)) {
            if (item.tradable && typeof parts[item.uniqueName] == "undefined") {
                setParts(item.uniqueName, { platinum: 0, quantity: 0, lastPlatinumUpdate: 0, lastQuantityUpdate: 0 })
            }

            getItemPlatinumPrice(item);
            getItemQuantity([item.uniqueName]);
            getItemOrderWithNoComponents(item);
            return;
        }

        // Sets up the default values of a part
        for (let i = 0; i < item.components.length; i++) {
            const component = item.components[i];

            // If we already have the part platinum price, then there is no reason to set it up again
            if (!component.tradable || typeof parts[component.uniqueName] != "undefined") {
                continue;
            }

            setParts(component.uniqueName, { platinum: 0, quantity: 0, lastPlatinumUpdate: 0, lastQuantityUpdate: 0 });
        }

        // Gets the platinum price of each components
        for (let i = 0; i < item.components.length; i++) {
            const component = item.components[i];

            getComponentPlatinumPrice(item, component);
        }

        // Gets all the unique component names
        const uniqueNames: string[] = []
        for (let i = 0; i < item.components.length; i++) {
            const component = item.components[i];
            if (component.tradable) {
                uniqueNames.push(component.uniqueName);
            }
        }

        getItemQuantity(uniqueNames);
        getItemOrdersWithComponents(item);

        // Sets the total piece plat count which is calculated afterwards
        setItemDisplay("partPlatinumTotal", 0);
    }
