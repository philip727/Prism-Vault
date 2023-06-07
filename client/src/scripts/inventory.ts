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

export const isItemTradableOrHasTradableParts = (item: Item): boolean => {
    return item.tradable || itemHasTradableParts(item);
}

const PART_PICTURES: { [key: string]: { [key: string]: string } } = {
    BARREL: {
        PRIME: "https://static.wikia.nocookie.net/warframe/images/2/2f/GenericGunPrimeBarrel.png",
        NORMAL: "https://static.wikia.nocookie.net/warframe/images/a/a1/Barrel.png",
    },
    RECEIVER: {
        PRIME: "https://static.wikia.nocookie.net/warframe/images/0/03/GenericGunPrimeReceiver.png",
        NORMAL: "https://static.wikia.nocookie.net/warframe/images/b/bc/Receiver.png",
    },
    STOCK: {
        PRIME: "https://static.wikia.nocookie.net/warframe/images/6/66/GenericGunPrimeStock.png",
        NORMAL: "https://static.wikia.nocookie.net/warframe/images/c/c7/Stock.png",
    },
    BLADE: {
        PRIME: "https://static.wikia.nocookie.net/warframe/images/f/f8/GenericWeaponPrimeBlade.png",
        NORMAL: "https://static.wikia.nocookie.net/warframe/images/f/f8/GenericWeaponPrimeBlade.png",
    },
    HILT: {
        PRIME: "https://static.wikia.nocookie.net/warframe/images/e/ea/GenericWeaponPrimeHilt.png",
        NORMAL: "https://static.wikia.nocookie.net/warframe/images/e/ea/GenericWeaponPrimeHilt.png",
    },
    LATCH: {
        PRIME: "https://static.wikia.nocookie.net/warframe/images/f/ff/GenericComponentPrimeLatch.png",
        NORMAL: "https://static.wikia.nocookie.net/warframe/images/f/ff/GenericComponentPrimeLatch.png"
    },
    PLUG: {
        PRIME: "https://static.wikia.nocookie.net/warframe/images/b/b3/GenericComponentPrimePlug.png",
        NORMAL: "https://static.wikia.nocookie.net/warframe/images/b/b3/GenericComponentPrimePlug.png",
    }
}

export const getComponentPicture = (item: Item, component: Component): string => {
    if (component.productCategory === "Pistols") {
        return cleanWikiaThumbnail(component.wikiaThumbnail as string);
    }


    let type = "NORMAL"
    if (item.isPrime) {
        type = "PRIME";
    }

    switch (component.name) {
        case "Head":
            return PART_PICTURES.BLADE[type];
        case "Barrel":
            return PART_PICTURES.BARREL[type];
        case "Receiver":
            return PART_PICTURES.RECEIVER[type];
        case "Stock":
            return PART_PICTURES.STOCK[type];
        case "Blade":
            return PART_PICTURES.BLADE[type];
        case "Hilt":
            return PART_PICTURES.HILT[type];
        case "Handle":
            if (item.category == "Melee") {
                return PART_PICTURES.HILT[type]
            }
            return PART_PICTURES.LATCH[type];
        case "Lower Limb":
            return PART_PICTURES.BLADE[type]
        case "Upper Limb":
            return PART_PICTURES.BLADE[type]
        case "Grip":
            return PART_PICTURES.LATCH[type]
        case "String":
            return PART_PICTURES.STOCK[type]
        case "Link":
            return PART_PICTURES.PLUG[type]
        case "Blueprint":
            return cleanWikiaThumbnail(item.wikiaThumbnail);
        default:
            return "logos/wf-comp-logo.svg"
    }

}

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

export const isItemWithoutDescription = (item: Item): boolean => {
    return item.category === ProductCategory.MOD || item.category === ProductCategory.ARCANE
}

export const isItemWithoutComponents = (item: Item): boolean => {
    console.log(item);
    return item.category === ProductCategory.MOD || item.category === ProductCategory.ARCANE || item.category === ProductCategory.RELIC || typeof item.components == "undefined";
}

