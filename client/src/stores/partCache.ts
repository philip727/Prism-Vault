import { invoke } from "@tauri-apps/api";
import { createStore } from "solid-js/store";
import { Component, Item, Order } from "../scripts/inventory";
import unwrapPromise from "../scripts/utils/unwrapPromise";

const CACHE_UPDATE_TIME = 300;

export const [parts, setParts] = createStore<PartCache>();

export type PartInfo = {
    quantity: number,
    platinum: number,
    lastPlatinumUpdate: number,
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
