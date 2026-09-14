const ITEM_DEFINITIONS = {

    /* ===================================================
       MEDKIT
       =================================================== */

    medkit: {
        id: "medkit",
        name: "Medkit",
        type: "consumable",

        effect: {
            type: "heal",
            amount: 25
        }
    },


    /* ===================================================
       LASER RIFLE
       =================================================== */

    laser_rifle: {
        id: "laser_rifle",
        name: "Laser Rifle",
        type: "weapon",
        slot: "weapon"
    },


    /* ===================================================
       XENIUM ORE
       =================================================== */

    xenium_ore: {
        id: "xenium_ore",
        name: "Xenium Ore",
        type: "resource",
        resourceType: "ore"
    }

};


/* =======================================================
   GET ITEM
   ======================================================= */

export function getItem(itemId) {

    if (!itemId) {
        return null;
    }

    return (
        ITEM_DEFINITIONS[itemId] ||
        null
    );

}


/* =======================================================
   ITEM EXISTS
   ======================================================= */

export function itemExists(itemId) {

    return getItem(itemId) !== null;

}


/* =======================================================
   GET ALL ITEMS
   ======================================================= */

export function getAllItems() {

    return Object.values(
        ITEM_DEFINITIONS
    );

}


/* =======================================================
   USE ITEM
   ======================================================= */

export function useItem(
    player,
    inventory,
    itemId
) {

    if (
        !player ||
        !inventory ||
        !itemId
    ) {
        return false;
    }


    const item =
        getItem(itemId);


    if (!item) {
        return false;
    }


    if (
        item.type !== "consumable"
    ) {
        return false;
    }


    if (
        !Array.isArray(
            inventory.items
        )
    ) {
        return false;
    }


    const inventoryItem =
        inventory.items.find(
            currentItem =>
                currentItem.id ===
                itemId
        );


    if (!inventoryItem) {
        return false;
    }


    if (
        inventoryItem.quantity <= 0
    ) {
        return false;
    }


    if (
        item.effect &&
        item.effect.type === "heal"
    ) {

        player.health.current =
            Math.min(
                player.health.maximum,
                player.health.current +
                item.effect.amount
            );

    }


    inventoryItem.quantity--;


    if (
        inventoryItem.quantity === 0
    ) {

        inventory.items =
            inventory.items.filter(
                currentItem =>
                    currentItem.id !==
                    itemId
            );

    }


    return true;

}