const ITEM_DEFINITIONS = {
    medkit: {
        id: "medkit",
        name: "Medkit",
        type: "consumable"
    },

    laser_rifle: {
        id: "laser_rifle",
        name: "Laser Rifle",
        type: "weapon"
    }
};


/* =======================================================
   GET ITEM
   ======================================================= */

export function getItem(itemId) {
    if (!itemId) {
        return null;
    }

    return ITEM_DEFINITIONS[itemId] || null;
}


/* =======================================================
   CHECK ITEM
   ======================================================= */

export function itemExists(itemId) {
    return getItem(itemId) !== null;
}


/* =======================================================
   GET ALL ITEMS
   ======================================================= */

export function getAllItems() {
    return Object.values(ITEM_DEFINITIONS);
}