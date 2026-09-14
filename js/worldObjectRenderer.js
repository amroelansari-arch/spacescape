import {
    getWorldObjects
} from "./worldObjects.js";


/* =======================================================
   WORLD OBJECT RENDERER
   ======================================================= */

const renderedWorldObjects =
    new Map();


/* =======================================================
   CREATE OBJECT ELEMENT
   ======================================================= */

function createWorldObjectElement(
    worldObject
) {

    const element =
        document.createElement("div");


    element.className =
        "world-object";


    element.dataset.worldObjectId =
        worldObject.id;


    element.style.position =
        "absolute";


    element.style.left =
        `${worldObject.position.x}px`;


    element.style.top =
        `${worldObject.position.y}px`;


    element.style.width =
        "54px";


    element.style.height =
        "72px";


    element.style.transform =
        "translate(-50%, -50%)";


    element.style.pointerEvents =
        "auto";


    element.style.cursor =
        "pointer";


    element.style.zIndex =
        "100";


    element.style.display =
        "flex";


    element.style.flexDirection =
        "column";


    element.style.alignItems =
        "center";


    element.style.justifyContent =
        "flex-start";


    element.style.userSelect =
        "none";


    /*
     * Terminal body.
     */

    const terminal =
        document.createElement("div");


    terminal.style.width =
        "38px";


    terminal.style.height =
        "48px";


    terminal.style.marginTop =
        "4px";


    terminal.style.border =
        "2px solid #7dd3fc";


    terminal.style.borderRadius =
        "5px";


    terminal.style.background =
        "linear-gradient(#164e63, #082f49)";


    terminal.style.boxShadow =
        "0 0 10px rgba(56, 189, 248, 0.65)";


    terminal.style.position =
        "relative";


    /*
     * Terminal screen.
     */

    const screen =
        document.createElement("div");


    screen.style.position =
        "absolute";


    screen.style.left =
        "6px";


    screen.style.top =
        "6px";


    screen.style.width =
        "22px";


    screen.style.height =
        "15px";


    screen.style.background =
        "#67e8f9";


    screen.style.border =
        "1px solid #cffafe";


    screen.style.boxShadow =
        "0 0 7px rgba(103, 232, 249, 0.9)";


    /*
     * Terminal base.
     */

    const base =
        document.createElement("div");


    base.style.position =
        "absolute";


    base.style.left =
        "9px";


    base.style.bottom =
        "-7px";


    base.style.width =
        "20px";


    base.style.height =
        "7px";


    base.style.background =
        "#334155";


    base.style.borderRadius =
        "2px";


    terminal.appendChild(
        screen
    );


    terminal.appendChild(
        base
    );


    /*
     * Object label.
     */

    const label =
        document.createElement("div");


    label.textContent =
        worldObject.name;


    label.style.marginTop =
        "7px";


    label.style.whiteSpace =
        "nowrap";


    label.style.fontSize =
        "11px";


    label.style.fontWeight =
        "bold";


    label.style.color =
        "#ffffff";


    label.style.textShadow =
        "0 1px 3px #000000";


    element.appendChild(
        terminal
    );


    element.appendChild(
        label
    );


    return element;

}


/* =======================================================
   RENDER WORLD OBJECTS
   ======================================================= */

export function renderWorldObjects(
    world
) {

    if (!world) {
        return;
    }


    const worldObjects =
        getWorldObjects();


    const activeIds =
        new Set();


    for (
        const worldObject
        of worldObjects
    ) {

        activeIds.add(
            worldObject.id
        );


        let element =
            renderedWorldObjects.get(
                worldObject.id
            );


        if (!element) {

            element =
                createWorldObjectElement(
                    worldObject
                );


            world.appendChild(
                element
            );


            renderedWorldObjects.set(
                worldObject.id,
                element
            );

        }


        element.style.left =
            `${worldObject.position.x}px`;


        element.style.top =
            `${worldObject.position.y}px`;

    }


    /*
     * Remove objects that no longer
     * exist in the world-object collection.
     */

    for (
        const [
            objectId,
            element
        ]
        of renderedWorldObjects
    ) {

        if (
            !activeIds.has(
                objectId
            )
        ) {

            element.remove();


            renderedWorldObjects.delete(
                objectId
            );

        }

    }

}


/* =======================================================
   CLEAR RENDERED OBJECTS
   ======================================================= */

export function clearRenderedWorldObjects() {

    for (
        const element
        of renderedWorldObjects.values()
    ) {

        element.remove();

    }


    renderedWorldObjects.clear();

}