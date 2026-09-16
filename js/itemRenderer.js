import {
    getWorldItems
} from "./itemWorld.js";

import {
    getItem
} from "./items.js";


const ITEM_PICKUP_RANGE = 100;


/* =======================================================
   RENDERED ITEM ELEMENTS
   ======================================================= */

const renderedItems =
    new Map();


/* =======================================================
   ITEM VISUAL
   ======================================================= */

function getItemSymbol(
    itemDefinition
) {

    if (!itemDefinition) {
        return "?";
    }


    if (
        itemDefinition.type ===
        "weapon"
    ) {

        if (
            itemDefinition.combatDiscipline ===
            "ballistics"
        ) {
            return "⚡";
        }


        if (
            itemDefinition.combatDiscipline ===
            "flux"
        ) {
            return "✦";
        }


        return "⚔";

    }


    if (
        itemDefinition.type ===
        "armor"
    ) {
        return "◆";
    }


    if (
        itemDefinition.type ===
        "ammunition"
    ) {
        return "▣";
    }


    if (
        itemDefinition.type ===
        "resource"
    ) {
        return "◇";
    }


    if (
        itemDefinition.type ===
        "consumable"
    ) {
        return "+";
    }


    return "•";

}


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


    /* ---------------------------------------------------
       POSITION
       --------------------------------------------------- */

    element.style.position =
        "absolute";

    element.style.left =
        `${worldItem.position.x}px`;

    element.style.top =
        `${worldItem.position.y}px`;


    element.style.width =
        "52px";

    element.style.height =
        "52px";


    element.style.transform =
        "translate(-50%, -50%)";


    /* ---------------------------------------------------
       DISPLAY
       --------------------------------------------------- */

    element.style.display =
        "flex";

    element.style.flexDirection =
        "column";

    element.style.alignItems =
        "center";

    element.style.justifyContent =
        "center";


    /* ---------------------------------------------------
       VISIBILITY
       --------------------------------------------------- */

    element.style.visibility =
        "visible";

    element.style.opacity =
        "1";

    element.style.pointerEvents =
        "auto";


    /* ---------------------------------------------------
       VISUAL
       --------------------------------------------------- */

    element.style.background =
        "rgba(8, 20, 30, 0.96)";


    element.style.border =
        "3px solid #00dcff";


    element.style.borderRadius =
        "10px";


    element.style.boxShadow =
        "0 0 8px #00dcff, 0 0 20px rgba(0, 220, 255, 0.7)";


    element.style.color =
        "#ffffff";


    element.style.fontSize =
        "25px";


    element.style.fontWeight =
        "900";


    element.style.lineHeight =
        "1";


    element.style.textAlign =
        "center";


    element.style.cursor =
        "pointer";


    element.style.zIndex =
        "200";


    element.style.userSelect =
        "none";


    /* ---------------------------------------------------
       SYMBOL
       --------------------------------------------------- */

    const symbol =
        document.createElement("div");


    symbol.textContent =
        getItemSymbol(
            itemDefinition
        );


    symbol.style.width =
        "100%";

    symbol.style.height =
        "28px";

    symbol.style.display =
        "flex";

    symbol.style.alignItems =
        "center";

    symbol.style.justifyContent =
        "center";


    symbol.style.pointerEvents =
        "none";


    element.appendChild(
        symbol
    );


    /* ---------------------------------------------------
       ITEM NAME
       --------------------------------------------------- */

    const label =
        document.createElement("div");


    label.textContent =
        itemDefinition
            ? itemDefinition.name
            : worldItem.itemId;


    label.style.position =
        "absolute";


    label.style.top =
        "56px";


    label.style.left =
        "50%";


    label.style.transform =
        "translateX(-50%)";


    label.style.whiteSpace =
        "nowrap";


    label.style.color =
        "#ffffff";


    label.style.fontFamily =
        "Arial, sans-serif";


    label.style.fontSize =
        "12px";


    label.style.fontWeight =
        "bold";


    label.style.textShadow =
        "0 2px 4px #000000";


    label.style.pointerEvents =
        "none";


    element.appendChild(
        label
    );


    /* ---------------------------------------------------
       QUANTITY
       --------------------------------------------------- */

    if (
        Number.isFinite(
            worldItem.quantity
        ) &&
        worldItem.quantity > 1
    ) {

        const quantity =
            document.createElement("div");


        quantity.textContent =
            `x${worldItem.quantity}`;


        quantity.style.position =
            "absolute";


        quantity.style.right =
            "-7px";


        quantity.style.top =
            "-7px";


        quantity.style.minWidth =
            "24px";


        quantity.style.height =
            "24px";


        quantity.style.padding =
            "2px 5px";


        quantity.style.display =
            "flex";


        quantity.style.alignItems =
            "center";


        quantity.style.justifyContent =
            "center";


        quantity.style.background =
            "#101820";


        quantity.style.border =
            "2px solid #ffffff";


        quantity.style.borderRadius =
            "12px";


        quantity.style.color =
            "#ffffff";


        quantity.style.fontSize =
            "10px";


        quantity.style.fontWeight =
            "bold";


        quantity.style.pointerEvents =
            "none";


        element.appendChild(
            quantity
        );

    }


    return element;

}


/* =======================================================
   RENDER WORLD ITEMS
   ======================================================= */

export function renderWorldItems() {

    const world =
        document.getElementById(
            "world"
        );


    if (!world) {

        console.warn(
            "renderWorldItems(): #world was not found."
        );

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

        if (!worldItem) {
            continue;
        }


        if (!worldItem.position) {
            continue;
        }


        activeIds.add(
            worldItem.id
        );


        let element =
            renderedItems.get(
                worldItem.id
            );


        /* ------------------------------------------------
           CREATE
           ------------------------------------------------ */

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


            console.log(
                "WORLD ITEM RENDERED:",
                itemDefinition
                    ? itemDefinition.name
                    : worldItem.itemId,
                worldItem.position
            );

        }


        /* ------------------------------------------------
           UPDATE POSITION
           ------------------------------------------------ */

        element.style.left =
            `${worldItem.position.x}px`;


        element.style.top =
            `${worldItem.position.y}px`;


        element.style.display =
            "flex";


        element.style.visibility =
            "visible";


        element.style.opacity =
            "1";

    }


    /* ===================================================
       REMOVE ITEMS NO LONGER IN WORLD
       =================================================== */

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


    /* ===================================================
       DEBUG
       =================================================== */

    if (
        currentItems.length > 0
    ) {

        console.log(
            `World items active: ${currentItems.length}`
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
        !worldItem ||
        !player.position ||
        !worldItem.position
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