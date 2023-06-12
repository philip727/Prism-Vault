import { createSignal } from "solid-js";
import { OrderType } from "../scripts/orders";

export const [orderType, setOrderType] = createSignal(OrderType.SELLERS);
