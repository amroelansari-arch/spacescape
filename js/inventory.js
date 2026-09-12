export function createInventory() {

    return {

        items: [],

        capacity: 20

    };

}


/* =======================================================
   INVENTORY CAPACITY
   ======================================================= */

export function getInventoryUsedSlots(inventory) {

    if (!inventory || !Array.isArray(inventory.items)) {
        return 0;
    }

    return inventory.items.length;
}


export function getInventoryRemainingSlots(inventory) {

    if (!inventory) {
        return 0;
    }

    return Math.max(
        0,
        inventory.capacity -
        getInventoryUsedSlots(inventory)
    );
}


export function isInventoryFull(inventory) {

    return (
        getInventoryRemainingSlots(inventory) <= 0
    );
}


/* =======================================================
   FIND ITEM
   ======================================================= */

export function findInventoryItem(
    inventory,
    itemId
) {

    if (
        !inventory ||
        !Array.isArray(inventory.items)
    ) {
        return null;
    }

    return (
        inventory.items.find(
            item => item.id === itemId
        ) || null
    );
}


/* =======================================================
   ITEM QUANTITY
   ======================================================= */

export function getItemQuantity(
    inventory,
    itemId
) {

    const item =
        findInventoryItem(
            inventory,
            itemId
        );

    if (!item) {
        return 0;
    }

    return item.quantity;
}


/* =======================================================
   ADD ITEM
   ======================================================= */

export function addItem(
    inventory,
    itemId,
    quantity = 1
) {

    if (
        !inventory ||
        !itemId ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        return false;
    }

    const existingItem =
        findInventoryItem(
            inventory,
            itemId
        );

    if (existingItem) {

        existingItem.quantity += quantity;

        return true;
    }

    if (isInventoryFull(inventory)) {
        return false;
    }

    inventory.items.push({

        id: itemId,

        quantity: quantity

    });

    return true;
}


/* =======================================================
   REMOVE ITEM
   ======================================================= */

export function removeItem(
    inventory,
    itemId,
    quantity = 1
) {

    if (
        !inventory ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        return false;
    }

    const item =
        findInventoryItem(
            inventory,
            itemId
        );

    if (!item) {
        return false;
    }

    if (item.quantity < quantity) {
        return false;
    }

    item.quantity -= quantity;

    if (item.quantity === 0) {

        inventory.items =
            inventory.items.filter(
                currentItem =>
                    currentItem.id !== itemId
            );
    }

    return true;
}


/* =======================================================
   CLEAR INVENTORY
   ======================================================= */

export function clearInventory(inventory) {

    if (!inventory) {
        return;
    }

    inventory.items = [];
}