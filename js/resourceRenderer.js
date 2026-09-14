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


    /*
     * Make the resource node deliberately
     * large and unmistakable during development.
     */

    element.style.width =
        "56px";


    element.style.height =
        "56px";


    element.style.borderRadius =
        "50%";


    element.style.background =
        "radial-gradient(circle, #ecfeff 0%, #67e8f9 25%, #06b6d4 55%, #164e63 100%)";


    element.style.border =
        "3px solid #cffafe";


    element.style.boxShadow =
        "0 0 12px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.85)";


    element.style.display =
        "flex";


    element.style.alignItems =
        "center";


    element.style.justifyContent =
        "center";


    element.style.color =
        "#ffffff";


    element.style.fontSize =
        "30px";


    element.style.fontWeight =
        "900";


    element.style.cursor =
        "pointer";


    /*
     * Keep the node above other world
     * decorations and objects.
     */

    element.style.zIndex =
        "500";


    element.style.userSelect =
        "none";


    element.style.pointerEvents =
        "auto";


    element.style.textShadow =
        "0 0 5px #000000";


    element.textContent =
        "◆";


    /*
     * Resource name.
     */

    const label =
        document.createElement("div");


    label.style.position =
        "absolute";


    label.style.top =
        "62px";


    label.style.left =
        "50%";


    label.style.transform =
        "translateX(-50%)";


    label.style.whiteSpace =
        "nowrap";


    label.style.fontSize =
        "12px";


    label.style.fontWeight =
        "bold";


    label.style.color =
        "#cffafe";


    label.style.textShadow =
        "0 1px 4px #000000";


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