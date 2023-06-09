import { invoke } from "@tauri-apps/api";
import { createStore } from "solid-js/store";
import { Component, Item, Order } from "../scripts/inventory";
import unwrapPromise from "../scripts/utils/unwrapPromise";
import { createInWindowNotification } from "../window/__notification/Manager";

const CACHE_UPDATE_TIME = 300;

export const [parts, setParts] = createStore<PartCache>();

export type PartInfo = {
    quantity: number,
    platinum: number,
    lastPlatinumUpdate: number,
    lastQuantityUpdate: number,
}

export type PartCache = {
    [key: string]: PartInfo
}

// If we already have the part platinum price, then we don't need to do another request
// Unless its been 5 minutes
const shouldUpdatePlatinum = (uniqueName: string) => {
    if (typeof parts[uniqueName] == "undefined") {
        return true;
    }

    if (parts[uniqueName].platinum == 0) {
        return true;
    }

    if (parts[uniqueName].lastPlatinumUpdate + CACHE_UPDATE_TIME > Date.now() / 1000) {
        return false;
    }

    console.log("Cache updated due to invalidation", uniqueName)
    return true;
}

// If we already have the part platinum price, then we don't need to do another request
// Unless its been 5 minutes
const shouldUpdateQuantity = (uniqueName: string) => {
    if (typeof parts[uniqueName] == "undefined") {
        return true;
    }

    if (parts[uniqueName].lastQuantityUpdate + CACHE_UPDATE_TIME > Date.now() / 1000) {
        return false;
    }

    console.log("Cache updated due to invalidation", uniqueName)
    return true;
}

// Gets the platinum price of a single tradable item
export const getSingleItemPlatinumPrice = async (item: Item) => {
    if (!shouldUpdatePlatinum(item.uniqueName)) {
        return
    }

    let marketQueryString = item.name.replaceAll(" ", "_").toLowerCase();
    const { err, result } = await unwrapPromise<Order, String>(invoke("get_order", { itemName: marketQueryString }));
    if (err || !result) {
        return;
    }

    setParts(item.uniqueName, "platinum", result.platinum);
    setParts(item.uniqueName, "lastPlatinumUpdate", Date.now() / 1000); // Current Unix Time
}

// Gets the plat price of a component apart of a weapon set
export const getComponentPlatinumPrice = async (item: Item, component: Component) => {
    if (!shouldUpdatePlatinum(component.uniqueName)) {
        return
    }

    let partMarketName = "";

    // If it has a product category then it must be another set
    if (typeof component.productCategory == "undefined") {
        partMarketName = item.name + " " + component.name;
    } else {
        partMarketName = component.name + "_set";
    }

    let marketQueryString = partMarketName.replaceAll(" ", "_").toLowerCase();
    let { err, result } = await unwrapPromise<Order, string>(invoke("get_order", { itemName: marketQueryString }));
    if (err || !result) {
        return
    }

    setParts(component.uniqueName, "platinum", result.platinum);
    setParts(component.uniqueName, "lastPlatinumUpdate", Date.now() / 1000); // Current Unix Time
}

export const updateQuantityOfPart = async (uniqueName: string, quantity: number) => {
    let { err } = await unwrapPromise<Order, string>(invoke("add_item", { uniqueName: uniqueName, quantity: quantity }));
    if (err) {
        createInWindowNotification({
            text: err,
            lengthInSeconds: 5,
        })
        return;
    }

    setParts(uniqueName, "quantity", quantity);
}

export const grabQuantitiesFromComponents = async (uniqueNames: Array<string>) => {
    let suitableComponents: string[] = []
    uniqueNames.forEach((uniqueName) => {
        if (shouldUpdateQuantity(uniqueName)) {
            suitableComponents.push(uniqueName);
        }
    })

    if (suitableComponents.length == 0) {
        return;
    }

    let { err, result } = await unwrapPromise<{[key: string]: number}, string>(invoke("get_components", { components:suitableComponents }));
    if (err || !result) {
        return;
    }

    for (let i = 0; i < suitableComponents.length; i++) {
        const uniqueName = suitableComponents[i];

        setParts(uniqueName, "quantity", result[uniqueName]);
        setParts(uniqueName, "lastQuantityUpdate", Date.now() / 1000); // Current Unix Time
    }
}
