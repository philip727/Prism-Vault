import { invoke } from "@tauri-apps/api";
import { createSignal } from "solid-js";
import { Component, getMarketQuery, Item, newItem, Order } from "../scripts/inventory";
import unwrapPromise from "../scripts/utils/unwrapPromise";

export const [isItemModalOpen, setIsItemModalOpen] = createSignal(false);

export const [itemShownOnModal, setItemShownOnModal] = createSignal(newItem());

export const updateItemDetailsOnModal = (item: Item) => {
    setItemShownOnModal(item);
}

export const [totalPiecePlatinumCount, setTotalPiecePlatinumCount] = createSignal(0);

export enum ModalPage {
    STOCK = "STOCK",
    ORDERS = "ORDERS",
    DROPS = "DROPS",
}

export const [modalPage, setModalPage] = createSignal(ModalPage.STOCK)

export const [itemOrders, setItemOrders] = createSignal<{ [key: string]: Array<Order> }>({})

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

    setItemOrders(order);
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

    setItemOrders(orders);
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
