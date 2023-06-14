import { itemDisplay } from "../stores/itemModal"
import { Order } from "./inventory";

export enum OrderType {
    SELLERS = "SELL",
    BUYERS = "BUY",
}

enum Status {
    INGAME = "ingame",
    OFFLINE = "offline",
    ONLINE = "online"
}

const statusPrecedence = (status: Status | string): number => {
    switch (status) {
        case Status.INGAME:
            return 3;
        case Status.ONLINE:
            return 2;
        case Status.OFFLINE:
            return 1;
        default:
            return 0;
    }
}

const orderByPlatinumAndStatus = (a: Order, b: Order): number => {
    const statusPrecedenceA = statusPrecedence(a.user.status);
    const statusPrecedenceB = statusPrecedence(b.user.status);

    if (statusPrecedenceA > statusPrecedenceB) {
        return -1;
    } else if (statusPrecedenceA < statusPrecedenceB) {
        return 1;
    }

    // If the statuses are the same, compare by platinum
    if (statusPrecedenceA === statusPrecedenceB) {
        if (a.platinum < b.platinum) {
            return -1;
        } else if (a.platinum > b.platinum) {
            return 1;
        }
    }

    return 0; // If statuses and platinum are equal or both are offline, maintain the original order
}

export const getOrdersFromType = (orderType: OrderType, uniqueName: string): Order[] => {
    let sortedFromType: Order[] = [];
    let items = itemDisplay.orders[uniqueName]
    if (typeof items == "undefined") {
        return sortedFromType;
    }

    items.forEach(order => {
        // Not sure why but this one time it serialized the order with snake case?
        if (order.orderType.toUpperCase() == orderType) {
            sortedFromType.push(order);
        }
    })

    sortedFromType.sort(orderByPlatinumAndStatus);
    return sortedFromType;
}

export const getColourFromStatus = (status: Status | string): string => {
    switch (status) {
        case Status.INGAME:
            return "#52f2c5";
        case Status.ONLINE:
            return "#008c23";
        case Status.OFFLINE:
            return "#8c0015";
    }

    return "#8c0015";
}
