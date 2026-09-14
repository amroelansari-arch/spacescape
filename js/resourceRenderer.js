/* =======================================================
   RESOURCE NODE RENDERER
   ======================================================= */

import {
    getResourceNodes
} from "./resourceNodes.js";


const renderedResourceNodes =
    new Map();


/* =======================================================
   CREATE RESOURCE ELEMENT
   ======================================================= */

function createResourceElement(
    resourceNode
) {

    const element =
        document.createElement("div");


    element.className =
        "resource-node";


    element.dataset.resourceNodeId =
        resourceNode.id;


    element.style.position =
        "absolute";


    element.style.left =
        `${resourceNode.position.x}px`;


    element.style.top =
        `${resourceNode.position.y}px`;


    element.style.transform =
        "translate(-50%, -50%)";


    element.style.width =
        "52px";


    element.style.height =
        "52px";


    element.style.borderRadius =
        "50%";


    element.style.background =
        "radial-gradient(circle, #67e8f9 0%, #0891b2 45%, #164e63 100%)";


    element.style.border =
        "2px solid #a5f3fc";


    element.style.boxShadow =
        "0 0 18px rgba(34, 211, 238, 0.65)";


    element.style.display =
        "flex";


    element.style.alignItems =
        "center";


    element.style.justifyContent =
        "center";


    element.style.color =
        "#ffffff";


    element.style.fontSize =
        "24px";


    element.style.fontWeight =
        "bold";


    element.style.cursor =
        "pointer";


    element.style.zIndex =
        "50";


    element.style.userSelect =
        "none";


    element.style.pointerEvents =
        "auto";


    element.textContent =
        "◆";


    const label =
        document.createElement("div");


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


    label.style.fontSize =
        "11px";


    label.style.fontWeight =
        "bold";


    label.style.color =
        "#a5f3fc";


    label.style.textShadow =
        "0 1px 3px #000000";


    label.style.pointerEvents =
        "none";


    label.textContent =
        resourceNode.name;


    element.appendChild(
        label
    );


    return element;

}


/* =======================================================
   RENDER RESOURCE NODES
   ======================================================= */

export function renderResourceNodes(
    world
) {

    if (!world) {
        return;
    }


    const resourceNodes =
        getResourceNodes();


    const activeIds =
        new Set();


    for (
        const resourceNode
        of resourceNodes
    ) {

        activeIds.add(
            resourceNode.id
        );


        let element =
            renderedResourceNodes.get(
                resourceNode.id
            );


        if (!element) {

            element =
                createResourceElement(
                    resourceNode
                );


            world.appendChild(
                element
            );


            renderedResourceNodes.set(
                resourceNode.id,
                element
            );

        }


        element.style.left =
            `${resourceNode.position.x}px`;


        element.style.top =
            `${resourceNode.position.y}px`;


        if (
            resourceNode.depleted
        ) {

            element.style.display =
                "none";

        } else {

            element.style.display =
                "flex";

        }

    }


    /*
     * Remove DOM elements for resource
     * nodes that no longer exist.
     */

    for (
        const [
            resourceNodeId,
            element
        ]
        of renderedResourceNodes
    ) {

        if (
            activeIds.has(
                resourceNodeId
            )
        ) {
            continue;
        }


        element.remove();


        renderedResourceNodes.delete(
            resourceNodeId
        );

    }

}


/* =======================================================
   CLEAR RENDERED RESOURCE NODES
   ======================================================= */

export function clearRenderedResourceNodes() {

    for (
        const element
        of renderedResourceNodes.values()
    ) {

        element.remove();

    }


    renderedResourceNodes.clear();

}