/* =======================================================
   WORLD OBJECT INTERACTION UI
   ======================================================= */

let interactionWindow = null;

let interactionTitle = null;

let interactionType = null;

let interactionDescription = null;

let interactionCloseButton = null;

let currentWorldObject = null;


/* =======================================================
   CREATE UI
   ======================================================= */

function createWorldObjectUI() {

    if (interactionWindow) {
        return;
    }


    interactionWindow =
        document.createElement("div");


    interactionWindow.id =
        "world-object-interaction";


    interactionWindow.style.position =
        "fixed";


    interactionWindow.style.left =
        "50%";


    interactionWindow.style.top =
        "50%";


    interactionWindow.style.transform =
        "translate(-50%, -50%)";


    interactionWindow.style.width =
        "360px";


    interactionWindow.style.minHeight =
        "190px";


    interactionWindow.style.padding =
        "20px";


    interactionWindow.style.boxSizing =
        "border-box";


    interactionWindow.style.background =
        "rgba(8, 15, 30, 0.97)";


    interactionWindow.style.border =
        "1px solid #38bdf8";


    interactionWindow.style.borderRadius =
        "8px";


    interactionWindow.style.boxShadow =
        "0 0 30px rgba(56, 189, 248, 0.35)";


    interactionWindow.style.color =
        "#ffffff";


    interactionWindow.style.zIndex =
        "15000";


    interactionWindow.style.display =
        "none";


    interactionWindow.style.flexDirection =
        "column";


    interactionWindow.style.fontFamily =
        "Arial, sans-serif";


    interactionWindow.style.userSelect =
        "none";


    /* ===================================================
       HEADER
       =================================================== */

    const header =
        document.createElement("div");


    header.style.display =
        "flex";


    header.style.justifyContent =
        "space-between";


    header.style.alignItems =
        "center";


    header.style.marginBottom =
        "14px";


    interactionTitle =
        document.createElement("div");


    interactionTitle.style.fontSize =
        "20px";


    interactionTitle.style.fontWeight =
        "bold";


    interactionTitle.style.color =
        "#7dd3fc";


    interactionType =
        document.createElement("div");


    interactionType.style.fontSize =
        "11px";


    interactionType.style.color =
        "#94a3b8";


    interactionType.style.textTransform =
        "uppercase";


    header.appendChild(
        interactionTitle
    );


    header.appendChild(
        interactionType
    );


    /* ===================================================
       DIVIDER
       =================================================== */

    const divider =
        document.createElement("div");


    divider.style.height =
        "1px";


    divider.style.background =
        "rgba(125, 211, 252, 0.25)";


    divider.style.marginBottom =
        "16px";


    /* ===================================================
       DESCRIPTION
       =================================================== */

    interactionDescription =
        document.createElement("div");


    interactionDescription.style.fontSize =
        "14px";


    interactionDescription.style.lineHeight =
        "1.5";


    interactionDescription.style.color =
        "#dbeafe";


    interactionDescription.style.flex =
        "1";


    interactionDescription.style.marginBottom =
        "20px";


    /* ===================================================
       FOOTER
       =================================================== */

    const footer =
        document.createElement("div");


    footer.style.display =
        "flex";


    footer.style.justifyContent =
        "flex-end";


    interactionCloseButton =
        document.createElement("button");


    interactionCloseButton.textContent =
        "Close";


    interactionCloseButton.style.padding =
        "7px 18px";


    interactionCloseButton.style.background =
        "#0f172a";


    interactionCloseButton.style.border =
        "1px solid #38bdf8";


    interactionCloseButton.style.borderRadius =
        "4px";


    interactionCloseButton.style.color =
        "#ffffff";


    interactionCloseButton.style.cursor =
        "pointer";


    interactionCloseButton.style.fontWeight =
        "bold";


    interactionCloseButton.addEventListener(
        "click",
        closeWorldObjectUI
    );


    footer.appendChild(
        interactionCloseButton
    );


    /* ===================================================
       BUILD WINDOW
       =================================================== */

    interactionWindow.appendChild(
        header
    );


    interactionWindow.appendChild(
        divider
    );


    interactionWindow.appendChild(
        interactionDescription
    );


    interactionWindow.appendChild(
        footer
    );


    document.body.appendChild(
        interactionWindow
    );

}


/* =======================================================
   GET DESCRIPTION
   ======================================================= */

function getWorldObjectDescription(
    worldObject
) {

    if (!worldObject) {
        return "";
    }


    if (
        worldObject.interactionType ===
        "terminal"
    ) {

        return (
            "A colony terminal used to access " +
            "local communications, colony systems, " +
            "and available network information."
        );

    }


    return (
        `${worldObject.name} can be interacted with.`
    );

}


/* =======================================================
   OPEN UI
   ======================================================= */

export function openWorldObjectUI(
    worldObject
) {

    if (!worldObject) {
        return;
    }


    createWorldObjectUI();


    currentWorldObject =
        worldObject;


    interactionTitle.textContent =
        worldObject.name;


    interactionType.textContent =
        worldObject.interactionType;


    interactionDescription.textContent =
        getWorldObjectDescription(
            worldObject
        );


    interactionWindow.style.display =
        "flex";


    return true;

}


/* =======================================================
   CLOSE UI
   ======================================================= */

export function closeWorldObjectUI() {

    if (!interactionWindow) {
        return;
    }


    interactionWindow.style.display =
        "none";


    currentWorldObject =
        null;

}


/* =======================================================
   UI OPEN STATE
   ======================================================= */

export function isWorldObjectUIOpen() {

    return Boolean(
        interactionWindow &&
        interactionWindow.style.display !==
            "none"
    );

}


/* =======================================================
   CURRENT OBJECT
   ======================================================= */

export function getCurrentWorldObjectUIObject() {

    return currentWorldObject;

}