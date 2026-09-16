const itemWorld = {
    items: []
};


/* =======================================================
   VALIDATION
   ======================================================= */

function isValidWorldItem(item) {

    return !!(
        item &&
        typeof item.id === "string" &&
        typeof item.itemId === "string" &&
        item.position &&
        Number.isFinite(item.position.x) &&
        Number.isFinite(item.position.y) &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
    );

}


/* =======================================================
   CREATE WORLD ITEM
   ======================================================= */

export function createWorldItem(
    itemId,
    x,
    y,
    quantity = 1
) {

    if (
        typeof itemId !== "string" ||
        !itemId ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        return null;
    }


    const worldItem = {

        id:
            crypto.randomUUID(),

        itemId,

        quantity,

        position: {
            x,
            y
        }

    };


    itemWorld.items.push(
        worldItem
    );


    return worldItem;

}


/* =======================================================
   GET ITEMS
   ======================================================= */

export function getWorldItems() {

    return itemWorld.items;

}


/* =======================================================
   FIND ITEM
   ======================================================= */

export function findWorldItemById(
    worldItemId
) {

    return (
        itemWorld.items.find(
            item =>
                item.id ===
                worldItemId
        ) || null
    );

}


/* =======================================================
   REMOVE ITEM
   ======================================================= */

export function removeWorldItem(
    worldItem
) {

    if (
        !isValidWorldItem(
            worldItem
        )
    ) {
        return false;
    }


    const index =
        itemWorld.items.indexOf(
            worldItem
        );


    if (index === -1) {
        return false;
    }


    itemWorld.items.splice(
        index,
        1
    );


    return true;

}


/* =======================================================
   DISTANCE
   ======================================================= */

export function getDistanceToWorldItem(
    player,
    worldItem
) {

    if (
        !player ||
        !worldItem ||
        !player.position ||
        !worldItem.position
    ) {
        return Infinity;
    }


    const dx =
        player.position.x -
        worldItem.position.x;


    const dy =
        player.position.y -
        worldItem.position.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =======================================================
   CLEAR
   ======================================================= */

export function clearWorldItems() {

    itemWorld.items.length = 0;

}