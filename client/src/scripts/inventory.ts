export enum ProductCategory {
    MOD = "Mods",
    RELIC = "Relics",
    ARCANE = "Arcanes"
}


export type Item = {
    name: string,
    description: string,
    isPrime: boolean,
    category: string,
    uniqueName: string,
    tradable: boolean,
    components: Array<Component>
    imageName: string,
    wikiaThumbnail: string,
    [key: string]: any,
}

export const newItem = (): Item => {
    return {
        name: "Default",
        description: "",
        isPrime: false,
        category: "Unknown",
        uniqueName: "Unknown",
        tradable: false,
        imageName: "",
        components: [],
        wikiaThumbnail: ""
    }
}

// type guard
export function isItem(item: Item | object): item is Item {
    return (item as Item).name !== undefined;
}

export type Component = {
    name: string,
    tradable: boolean,
    uniqueName: string,
    drops: Array<Drop>,
    productCategory?: string,
    wikiaThumbnail?: string,
    imageName: string,
    [key: string]: any,
}

export type Drop = {
    chance: number,
    location: string,
    rarity: string,
    type: string,
}

export type Order = {
    quanity: number,
    orderType: string,
    platinum: number
}

// Check if the item has tradable parts
export const itemHasTradableParts = (item: Item): boolean => {
    if (!item.components || typeof item.components == "undefined") {
        return false;
    }

    for (let i = 0; i < item.components.length; i++) {
        const component = item.components[i];
        if (component.tradable) {
            return true;
        }
    }

    return false;
}

// Make sure the item is tradable in some way
export const isItemTradableOrHasTradableParts = (item: Item): boolean => {
    return item.tradable || itemHasTradableParts(item);
}

// Gets the component picture, if it's a blue print then we just want the wikia thumbnail
export const getComponentPicture = (item: Item, component: Component): string => {
    switch (component.name) {
        case "Blueprint":
            return cleanWikiaThumbnail(item.wikiaThumbnail);
        default:
            return `https://cdn.warframestat.us/img/${component.imageName}`
    }

}

// Gets the picture of the item, the wikia thumbnails are better for mods
export const determineItemPicture = (item: Item | Component): string => {
    if (item.category == ProductCategory.MOD) {
        if (!item.wikiaThumbnail || typeof item.wikiaThumbnail == "undefined") {
            return `https://cdn.warframestat.us/img/${item.imageName}`
        }
        return cleanWikiaThumbnail(item.wikiaThumbnail);
    }

    return `https://cdn.warframestat.us/img/${item.imageName}`
}

    // Cleans the wikiathumbnail
export const cleanWikiaThumbnail = (url: string): string => {
    if (typeof url == "undefined") {
        return "./logos/wf-comp-logo.svg"
    }

    try {
        return url.split("/revision")[0];
    } catch {
        return url;
    }
}

// Mostly mods and arcanes
export const isItemWithoutDescription = (item: Item): boolean => {
    return item.category === ProductCategory.MOD || item.category === ProductCategory.ARCANE
}

// Things like mods or syndicate weapons or arcanes
export const isItemWithoutComponents = (item: Item): boolean => {
    return item.category === ProductCategory.MOD ||
        item.category === ProductCategory.ARCANE ||
        item.category === ProductCategory.RELIC ||
        typeof item.components == "undefined";
}


