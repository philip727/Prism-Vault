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
    excludeFromCodex: boolean,
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
        excludeFromCodex: false,
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
    quantity: number,
    orderType: string,
    platinum: number,
    user: User,
    platform: string,
    id: string,
    query?: string,
    [key: string]: any,
}

export type User = {
    status: string,
    reputation: number,
    region: string,
    ingameName: string,
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

// Gets the component picture no matter what it is, it uses the warframe market blue print picture
export const getStrictComponentPicture = (component: Component): string => {
    return `https://cdn.warframestat.us/img/${component.imageName}`
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

// Gets the search query for warframe market api
export const getMarketQuery = (item: Item, component?: Component): string => {
    // If we have a component, then we are trying to get a component order
    if (typeof component != "undefined") {
        let componentQueryString = "";

        // If it has a product category then it must be another set
        if (typeof component.productCategory == "undefined") {
            componentQueryString = item.name + " " + component.name;
        } else {
            componentQueryString = component.name + "_set";
        }
        return componentQueryString.replaceAll(" ", "_").toLowerCase();
    }

    // Gets the query string of a component with no components
    if (isItemWithoutComponents(item)) {
        return item.name.replaceAll(" ", "_").toLowerCase();
    }

    return item.name.replaceAll(" ", "_").toLowerCase() + "_set";
}

// clean the component name
export const cleanComponentName = (name: string) => {
    return name.replace("Upper", "U").replace("Lower", "L"); 
}
