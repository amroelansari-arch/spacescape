import {
    getWorldItems
} from "./itemWorld.js";

import {
    getItem
} from "./items.js";


const ITEM_PICKUP_RANGE = 100;


/* =======================================================
   ITEM ELEMENTS
   ======================================================= */

const renderedItems =
    new Map();


/* =======================================================
   CREATE ITEM ELEMENT
   ======================================================= */

function createItemElement(
    worldItem,
    itemDefinition
) {

    const element =
        document.createElement("div");

    element.className =
        "world-item";

    element.dataset.worldItemId =
        worldItem.id;

    element.style.position =
        "absolute";

    element.style.left =
        worldItem.position.x + "px";

    element.style.top =
        worldItem.position.y + "px";

    element.style.width =
        "42px";

    element.style.height =
        "42px";

    element.style.transform =
        "translate(-50%, -50%)";

    element.style.display =
        "flex";

    element.style.alignItems =
        "center";

    element.style.justifyContent =
        "center";

    element.style.border =
        "2px solid rgba(0, 220, 255, 0.9)";

    element.style.borderRadius =
        "8px";

    element.style.background =
        "rgba(0, 40, 65, 0.92)";

    element.style.boxShadow =
        "0 0 14px rgba(0, 220, 255, 0.65)";

    element.style.color =
        "#ffffff";

    element.style.fontSize =
        "22px";

    element.style.fontWeight =
        "bold";

    element.style.cursor =
        "pointer";

    element.style.zIndex =
        "150";


    /*
     * Simple visual representation.
     * We can replace this with proper item
     * artwork later.
     */
    if (
        itemDefinition &&
        itemDefinition.type ===
        "weapon"
    ) {

        element.textContent =
            "⚡";

    } else {

        element.textContent =
            "◆";

    }


    const label =
        document.createElement("div");

    label.textContent =
        itemDefinition
            ? itemDefinition.name
            : worldItem.itemId;

    label.style.position =
        "absolute";

    label.style.top =
        "44px";

    label.style.left =
        "50%";

    label.style.transform =
        "translateX(-50%)";

    label.style.whiteSpace =
        "nowrap";

    label.style.fontSize =
        "11px";

    label.style.fontFamily =
        "Arial, sans-serif";

    label.style.fontWeight =
        "bold";

    label.style.color =
        "#ffffff";

    label.style.textShadow =
        "0 1px 3px #000000";

    label.style.pointerEvents =
        "none";


    element.appendChild(
        label
    );


    return element;

}


/* =======================================================
   RENDER
   ======================================================= */

export function renderWorldItems() {

    const world =
        document.getElementById(
            "world"
        );

    if (!world) {
        return;
    }

    const currentItems =
        getWorldItems();

    const activeIds =
        new Set();


    for (
        const worldItem
        of currentItems
    ) {

        activeIds.add(
            worldItem.id
        );

        let element =
            renderedItems.get(
                worldItem.id
            );


        if (!element) {

            const itemDefinition =
                getItem(
                    worldItem.itemId
                );

            element =
                createItemElement(
                    worldItem,
                    itemDefinition
                );

            renderedItems.set(
                worldItem.id,
                element
            );

            world.appendChild(
                element
            );

        }


        element.style.left =
            worldItem.position.x +
            "px";

        element.style.top =
            worldItem.position.y +
            "px";

    }


    /*
     * Remove DOM elements for items
     * that no longer exist in the world.
     */

    for (
        const [
            worldItemId,
            element
        ]
        of renderedItems
    ) {

        if (
            activeIds.has(
                worldItemId
            )
        ) {
            continue;
        }

        element.remove();

        renderedItems.delete(
            worldItemId
        );

    }

}


/* =======================================================
   PICKUP RANGE
   ======================================================= */

export function isWithinItemPickupRange(
    player,
    worldItem
) {

    if (
        !player ||
        !worldItem
    ) {
        return false;
    }

    const dx =
        player.position.x -
        worldItem.position.x;

    const dy =
        player.position.y -
        worldItem.position.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    return (
        distance <=
        ITEM_PICKUP_RANGE
    );

}