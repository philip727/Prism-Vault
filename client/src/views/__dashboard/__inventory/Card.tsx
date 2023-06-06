import { Component } from "solid-js"
import { Item } from "../Inventory"

type Props = {
    item: Item
}

export const Card: Component<Props> = (props) => {
    return (
        <li class="w-fit h-16 bg-[var(--c5)] flex flex-row items-center justify-center rounded-md">
            <div class="w-12">

            </div>
            <div class="w-48 bg-[var(--c3)] h-full flex justify-evenly items-center">
                <img class="w-14 h-14" src={cleanWikiaThumbnail(props.item.wikiaThumbnail)} />
                <p class="text-white font-medium text-center">{props.item.name}</p>
            </div>
            <div class="w-12">

            </div>
        </li>
    )
}

const cleanWikiaThumbnail = (url: string): string => {
    try {
        return url.split("/revision")[0];
    } catch {
        return url;
    }
}
