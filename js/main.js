import {
    setCharacterInterfaceAvailability
} from "./characterInterface.js";

import {
    player,
    updatePlayerMovement,
    drawPlayer,
    updatePlayerHUD,
    respawnPlayer,
    setMovementTarget,
    getMovementTarget,
    clearMovementTarget
} from "./player.js";

import {
    updateCamera,
    WORLD_WIDTH,
    WORLD_HEIGHT
} from "./world.js";

import {
    getNearbyInteractable,
    updateInteractionPrompt,
    createDialogueController,
    getInteractables
} from "./npc.js";

import {
    spawnWorldEnemy,
    getEnemyCollection,
    updateEnemyRespawns
} from "./enemyWorld.js";

import {
    renderEnemies
} from "./enemyRenderer.js";

import {
    startCombat,
    stopCombat,
    updateCombat,
    getCombatState
} from "./combatSystem.js";

import {
    createWorldItem,
    findWorldItemById,
    removeWorldItem
} from "./itemWorld.js";

import {
    renderWorldItems
} from "./itemRenderer.js";

import {
    getItem
} from "./items.js";

import {
    addItem
} from "./inventory.js";

import {
    findPath
} from "./pathfinding.js";

import {
    createWorldObject,
    getWorldObjects,
    getWorldObjectById,
    getNearbyWorldObject,
    getDistanceToWorldObject
} from "./worldObjects.js";

import {
    renderWorldObjects
} from "./worldObjectRenderer.js";

import {
    openWorldObjectUI,
    closeWorldObjectUI,
    isWorldObjectUIOpen
} from "./worldObjectUI.js";


/* =======================================================
   DOM ELEMENTS
   ======================================================= */

const titleScreen =
    document.getElementById("title-screen");

const gameScreen =
    document.getElementById("game-screen");

const playButton =
    document.getElementById("play-button");

const world =
    document.getElementById("world");

const interactionPrompt =
    document.getElementById("interaction-prompt");

const dialogueWindow =
    document.getElementById("dialogue");

const dialogueText =
    document.getElementById("dialogue-text");

const continueButton =
    document.getElementById("dialogue-next");

const closeButton =
    document.getElementById("dialogue-close");


/* =======================================================
   KEYBOARD
   ======================================================= */

const keys = {};


/* =======================================================
   DIALOGUE
   ======================================================= */

const dialogueController =
    createDialogueController({
        dialogueWindow,
        dialogueText,
        continueButton
    });


/* =======================================================
   CLICK MARKER
   ======================================================= */

let clickMarker = null;

let clickMarkerTimer = null;


function createClickMarker() {

    if (clickMarker) {
        return;
    }

    clickMarker =
        document.createElement("div");

    clickMarker.id =
        "spacescape-click-marker";

    clickMarker.style.position =
        "absolute";

    clickMarker.style.width =
        "18px";

    clickMarker.style.height =
        "18px";

    clickMarker.style.pointerEvents =
        "none";

    clickMarker.style.zIndex =
        "5000";

    clickMarker.style.transform =
        "translate(-50%, -50%)";

    clickMarker.style.opacity =
        "0";

    clickMarker.style.transition =
        "opacity 0.15s ease";


    const lineOne =
        document.createElement("div");

    const lineTwo =
        document.createElement("div");


    for (
        const line
        of [lineOne, lineTwo]
    ) {

        line.style.position =
            "absolute";

        line.style.left =
            "8px";

        line.style.top =
            "1px";

        line.style.width =
            "2px";

        line.style.height =
            "16px";

        line.style.background =
            "#ffffff";

        line.style.boxShadow =
            "0 0 3px #000000";

        line.style.borderRadius =
            "2px";

    }


    lineOne.style.transform =
        "rotate(45deg)";

    lineTwo.style.transform =
        "rotate(-45deg)";


    clickMarker.appendChild(
        lineOne
    );

    clickMarker.appendChild(
        lineTwo
    );


    world.appendChild(
        clickMarker
    );

}


function showClickMarker(
    x,
    y
) {

    createClickMarker();


    clickMarker.style.left =
        `${x}px`;

    clickMarker.style.top =
        `${y}px`;

    clickMarker.style.opacity =
        "1";


    if (clickMarkerTimer) {

        clearTimeout(
            clickMarkerTimer
        );

    }


    clickMarkerTimer =
        setTimeout(
            () => {

                if (clickMarker) {

                    clickMarker.style.opacity =
                        "0";

                }

            },
            900
        );

}


/* =======================================================
   DEATH UI
   ======================================================= */

let deathOverlay = null;

let respawnButton = null;


function createDeathOverlay() {

    if (deathOverlay) {
        return;
    }


    deathOverlay =
        document.createElement("div");


    deathOverlay.id =
        "spacescape-death-overlay";


    deathOverlay.style.position =
        "fixed";

    deathOverlay.style.inset =
        "0";

    deathOverlay.style.display =
        "none";

    deathOverlay.style.alignItems =
        "center";

    deathOverlay.style.justifyContent =
        "center";

    deathOverlay.style.flexDirection =
        "column";

    deathOverlay.style.background =
        "rgba(0, 0, 0, 0.78)";

    deathOverlay.style.zIndex =
        "10000";


    const title =
        document.createElement("div");


    title.textContent =
        "YOU DIED";


    title.style.color =
        "#ffffff";

    title.style.fontSize =
        "48px";

    title.style.fontWeight =
        "900";

    title.style.marginBottom =
        "20px";


    respawnButton =
        document.createElement("button");


    respawnButton.textContent =
        "RESPAWN";


    respawnButton.style.padding =
        "12px 28px";

    respawnButton.style.fontSize =
        "16px";

    respawnButton.style.fontWeight =
        "bold";

    respawnButton.style.cursor =
        "pointer";


    respawnButton.addEventListener(
        "click",
        handleRespawn
    );


    deathOverlay.appendChild(
        title
    );

    deathOverlay.appendChild(
        respawnButton
    );


    document.body.appendChild(
        deathOverlay
    );

}


function showDeathScreen() {

    createDeathOverlay();


    deathOverlay.style.display =
        "flex";

}


function hideDeathScreen() {

    if (!deathOverlay) {
        return;
    }


    deathOverlay.style.display =
        "none";

}


/* =======================================================
   RESPAWN
   ======================================================= */

function handleRespawn() {

    if (!player.isDead) {
        return;
    }


    respawnPlayer();


    hideDeathScreen();


    drawPlayer();


    updatePlayerHUD();


    updateGame();

}


/* =======================================================
   INITIALIZE ENEMIES
   ======================================================= */

function initializeEnemies() {

    spawnWorldEnemy(
        "Test Enemy",
        1,
        50,
        12,
        2,
        1500,
        900
    );


    spawnWorldEnemy(
        "Test Enemy",
        1,
        50,
        12,
        2,
        1800,
        1100
    );


    spawnWorldEnemy(
        "Test Enemy",
        2,
        75,
        16,
        3,
        2200,
        1400
    );

}


/* =======================================================
   INITIALIZE WORLD ITEMS
   ======================================================= */

function initializeWorldItems() {

    createWorldItem(
        "laser_rifle",
        1500,
        900,
        1
    );

}


/* =======================================================
   INITIALIZE WORLD OBJECTS
   ======================================================= */

function initializeWorldObjects() {

    createWorldObject({
        id: "colony_terminal_01",
        type: "terminal",
        name: "Colony Terminal",
        x: 1150,
        y: 800,
        interactionDistance: 85,
        interactionType: "terminal"
    });

}


/* =======================================================
   WORLD OBJECT INTERACTION
   ======================================================= */

function interactWithWorldObject(
    worldObject
) {

    if (!worldObject) {
        return;
    }


    openWorldObjectUI(
        worldObject
    );


    console.log(
        `${worldObject.name}: Interaction opened.`
    );

}


/* =======================================================
   WORLD OBJECT CLICK
   ======================================================= */

function handleWorldObjectClick(
    event
) {

    if (player.isDead) {
        return;
    }


    /*
     * Do not allow world interaction while
     * an object UI is already open.
     */

    if (isWorldObjectUIOpen()) {
        return;
    }


    if (
        dialogueController.isOpen()
    ) {
        return;
    }


    const objectElement =
        event.target.closest(
            ".world-object"
        );


    let clickedObject = null;


    /*
     * First try the actual rendered
     * world-object element.
     */

    if (objectElement) {

        const worldObjectId =
            objectElement.dataset.worldObjectId;


        if (worldObjectId) {

            clickedObject =
                getWorldObjectById(
                    worldObjectId
                );

        }

    }


    /*
     * Fallback to world-coordinate
     * detection.
     */

    if (!clickedObject) {

        const worldRect =
            world.getBoundingClientRect();


        const clickX =
            event.clientX -
            worldRect.left;


        const clickY =
            event.clientY -
            worldRect.top;


        const worldObjects =
            getWorldObjects();


        for (
            const worldObject
            of worldObjects
        ) {

            const distance =
                Math.sqrt(
                    Math.pow(
                        clickX -
                        worldObject.position.x,
                        2
                    ) +
                    Math.pow(
                        clickY -
                        worldObject.position.y,
                        2
                    )
                );


            if (
                distance <= 60
            ) {

                clickedObject =
                    worldObject;

                break;

            }

        }

    }


    if (!clickedObject) {
        return;
    }


    /*
     * This click belongs to the
     * world object.
     */

    event.stopImmediatePropagation();


    showClickMarker(
        clickedObject.position.x,
        clickedObject.position.y
    );


    const distanceToObject =
        getDistanceToWorldObject(
            player,
            clickedObject
        );


    /*
     * Already close enough:
     * interact immediately.
     */

    if (
        distanceToObject <=
        clickedObject.interactionDistance
    ) {

        clearMovementTarget();


        interactWithWorldObject(
            clickedObject
        );


        return;

    }


    const path =
        findPath(
            player.position.x,
            player.position.y,
            clickedObject.position.x,
            clickedObject.position.y
        );


    if (!path) {

        console.warn(
            `Unable to find a route to ${clickedObject.name}.`
        );

        return;

    }


    stopCombat();

    clearMovementTarget();


    /*
     * Arrival distance is deliberately 0.
     * updateWorldObjectTarget() handles the
     * interaction radius itself.
     */

    setMovementTarget(
        "world_object",
        clickedObject.id,
        clickedObject.position.x,
        clickedObject.position.y,
        0,
        path
    );


    console.log(
        `Walking to ${clickedObject.name}.`
    );

}


/* =======================================================
   WORLD OBJECT TARGET
   ======================================================= */

function updateWorldObjectTarget() {

    if (player.isDead) {
        return;
    }


    const target =
        getMovementTarget();


    if (
        !target ||
        target.type !== "world_object"
    ) {
        return;
    }


    const worldObject =
        getWorldObjectById(
            target.id
        );


    if (!worldObject) {

        clearMovementTarget();

        return;

    }


    target.x =
        worldObject.position.x;

    target.y =
        worldObject.position.y;


    const distance =
        getDistanceToWorldObject(
            player,
            worldObject
        );


    if (
        distance <=
        worldObject.interactionDistance
    ) {

        clearMovementTarget();


        interactWithWorldObject(
            worldObject
        );

    }

}


/* =======================================================
   HOVER CURSOR
   ======================================================= */

function updateInteractionCursor(
    event
) {

    if (player.isDead) {

        world.style.cursor =
            "default";

        return;

    }


    if (
        dialogueController.isOpen()
    ) {

        world.style.cursor =
            "default";

        return;

    }


    if (isWorldObjectUIOpen()) {

        world.style.cursor =
            "default";

        return;

    }


    const worldRect =
        world.getBoundingClientRect();


    const mouseX =
        event.clientX -
        worldRect.left;


    const mouseY =
        event.clientY -
        worldRect.top;


    /*
     * Check NPCs.
     */

    const interactables =
        getInteractables();


    for (
        const interactable
        of interactables
    ) {

        const distance =
            Math.sqrt(
                Math.pow(
                    mouseX -
                    interactable.position.x,
                    2
                ) +
                Math.pow(
                    mouseY -
                    interactable.position.y,
                    2
                )
            );


        if (
            distance <= 60
        ) {

            world.style.cursor =
                "pointer";

            return;

        }

    }


    /*
     * Check world objects.
     */

    const worldObjects =
        getWorldObjects();


    for (
        const worldObject
        of worldObjects
    ) {

        const distance =
            Math.sqrt(
                Math.pow(
                    mouseX -
                    worldObject.position.x,
                    2
                ) +
                Math.pow(
                    mouseY -
                    worldObject.position.y,
                    2
                )
            );


        if (
            distance <= 60
        ) {

            world.style.cursor =
                "pointer";

            return;

        }

    }


    /*
     * Nothing interactive under
     * the mouse.
     */

    world.style.cursor =
        "default";

}


/* =======================================================
   ITEM PICKUP
   ======================================================= */

function attemptWorldItemPickup(
    worldItem
) {

    if (!worldItem) {
        return false;
    }


    if (player.isDead) {
        return false;
    }


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                worldItem.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                worldItem.position.y,
                2
            )
        );


    if (distance > 10) {
        return false;
    }


    const itemDefinition =
        getItem(
            worldItem.itemId
        );


    if (!itemDefinition) {

        console.warn(
            "Unknown world item:",
            worldItem.itemId
        );

        clearMovementTarget();

        return false;

    }


    const added =
        addItem(
            player.inventory,
            worldItem.itemId,
            worldItem.quantity
        );


    if (!added) {

        console.log(
            "Inventory is full. Item remains in the world."
        );

        clearMovementTarget();

        return false;

    }


    removeWorldItem(
        worldItem
    );


    clearMovementTarget();


    console.log(
        `${itemDefinition.name} picked up.`
    );


    console.log(
        "Inventory:",
        player.inventory
    );


    return true;

}


/* =======================================================
   ITEM TARGET
   ======================================================= */

function updateWorldItemTarget() {

    if (player.isDead) {
        return;
    }


    const target =
        getMovementTarget();


    if (
        !target ||
        target.type !== "item"
    ) {
        return;
    }


    const worldItem =
        findWorldItemById(
            target.id
        );


    if (!worldItem) {

        clearMovementTarget();

        return;

    }


    target.x =
        worldItem.position.x;

    target.y =
        worldItem.position.y;


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                worldItem.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                worldItem.position.y,
                2
            )
        );


    if (distance <= 10) {

        player.position.x =
            worldItem.position.x;

        player.position.y =
            worldItem.position.y;


        attemptWorldItemPickup(
            worldItem
        );

    }

}


/* =======================================================
   ITEM CLICK
   ======================================================= */

function handleWorldItemClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    const itemElement =
        event.target.closest(
            ".world-item"
        );


    if (!itemElement) {
        return;
    }


    const worldItemId =
        itemElement.dataset.worldItemId;


    if (!worldItemId) {
        return;
    }


    const worldItem =
        findWorldItemById(
            worldItemId
        );


    if (!worldItem) {
        return;
    }


    if (
        dialogueController.isOpen()
    ) {
        return;
    }


    showClickMarker(
        worldItem.position.x,
        worldItem.position.y
    );


    const path =
        findPath(
            player.position.x,
            player.position.y,
            worldItem.position.x,
            worldItem.position.y
        );


    if (!path) {

        console.warn(
            "Unable to find a route to item."
        );

        return;

    }


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                worldItem.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                worldItem.position.y,
                2
            )
        );


    if (distance <= 10) {

        attemptWorldItemPickup(
            worldItem
        );

        return;

    }


    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "item",
        worldItem.id,
        worldItem.position.x,
        worldItem.position.y,
        0,
        path
    );

}


/* =======================================================
   NPC CLICK
   ======================================================= */

function handleNPCClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    if (
        dialogueController.isOpen()
    ) {
        return;
    }


    const worldRect =
        world.getBoundingClientRect();


    const clickX =
        event.clientX -
        worldRect.left;


    const clickY =
        event.clientY -
        worldRect.top;


    const interactables =
        getInteractables();


    let clickedInteractable = null;


    for (
        const interactable
        of interactables
    ) {

        const distance =
            Math.sqrt(
                Math.pow(
                    clickX -
                    interactable.position.x,
                    2
                ) +
                Math.pow(
                    clickY -
                    interactable.position.y,
                    2
                )
            );


        if (
            distance <= 60
        ) {

            clickedInteractable =
                interactable;

            break;

        }

    }


    if (!clickedInteractable) {
        return;
    }


    event.stopImmediatePropagation();


    const npc =
        clickedInteractable;


    showClickMarker(
        npc.position.x,
        npc.position.y
    );


    const distanceToNPC =
        Math.sqrt(
            Math.pow(
                player.position.x -
                npc.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                npc.position.y,
                2
            )
        );


    if (
        distanceToNPC <=
        npc.interactionDistance
    ) {

        clearMovementTarget();

        handleInteraction();

        return;

    }


    const path =
        findPath(
            player.position.x,
            player.position.y,
            npc.position.x,
            npc.position.y
        );


    if (!path) {

        console.warn(
            `Unable to find a route to ${npc.name}.`
        );

        return;

    }


    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "npc",
        npc.id,
        npc.position.x,
        npc.position.y,
        npc.interactionDistance,
        path
    );


    console.log(
        `Walking to ${npc.name}.`
    );

}


/* =======================================================
   NPC TARGET
   ======================================================= */

function updateNPCTarget() {

    if (player.isDead) {
        return;
    }


    const target =
        getMovementTarget();


    if (
        !target ||
        target.type !== "npc"
    ) {
        return;
    }


    const interactables =
        getInteractables();


    const npc =
        interactables.find(
            interactable =>
                interactable.id ===
                target.id
        );


    if (!npc) {

        clearMovementTarget();

        return;

    }


    target.x =
        npc.position.x;

    target.y =
        npc.position.y;


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                npc.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                npc.position.y,
                2
            )
        );


    if (
        distance <=
        npc.interactionDistance
    ) {

        clearMovementTarget();

        handleInteraction();

    }

}


/* =======================================================
   ENEMY CLICK
   ======================================================= */

function handleEnemyClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    const enemyElement =
        event.target.closest(
            ".enemy"
        );


    if (!enemyElement) {
        return;
    }


    const enemyId =
        enemyElement.dataset.enemyId;


    if (!enemyId) {
        return;
    }


    const enemies =
        getEnemyCollection();


    const enemy =
        enemies.find(
            currentEnemy =>
                currentEnemy.id ===
                enemyId
        );


    if (!enemy) {
        return;
    }


    if (
        dialogueController.isOpen()
    ) {
        return;
    }


    if (enemy.position) {

        showClickMarker(
            enemy.position.x,
            enemy.position.y
        );

    }


    clearMovementTarget();


    startCombat(
        player,
        enemy
    );

}


/* =======================================================
   GROUND CLICK-TO-MOVE
   ======================================================= */

function handleGroundClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    if (
        dialogueController.isOpen()
    ) {
        return;
    }


    const itemElement =
        event.target.closest(
            ".world-item"
        );


    if (itemElement) {
        return;
    }


    const enemyElement =
        event.target.closest(
            ".enemy"
        );


    if (enemyElement) {
        return;
    }


    const worldObjectElement =
        event.target.closest(
            ".world-object"
        );


    if (worldObjectElement) {
        return;
    }


    const worldRect =
        world.getBoundingClientRect();


    let targetX =
        event.clientX -
        worldRect.left;


    let targetY =
        event.clientY -
        worldRect.top;


    targetX =
        Math.max(
            0,
            Math.min(
                WORLD_WIDTH,
                targetX
            )
        );


    targetY =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT,
                targetY
            )
        );


    showClickMarker(
        targetX,
        targetY
    );


    const path =
        findPath(
            player.position.x,
            player.position.y,
            targetX,
            targetY
        );


    if (!path) {

        console.warn(
            "No valid route to clicked location."
        );

        return;

    }


    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "ground",
        null,
        targetX,
        targetY,
        0,
        path
    );


    console.log(
        `Path found: ${path.length} waypoint(s).`
    );


    console.log(
        `Moving to ${Math.round(targetX)}, ${Math.round(targetY)}`
    );

}


/* =======================================================
   INTERACTION
   ======================================================= */

function updateInteraction() {

    /*
     * Hide the normal interaction prompt
     * while a world-object window is open.
     */

    if (isWorldObjectUIOpen()) {

        if (interactionPrompt) {

            interactionPrompt.style.display =
                "none";

        }

        return;

    }


    if (player.isDead) {

        if (interactionPrompt) {

            interactionPrompt.style.display =
                "none";

        }

        return;

    }


    return updateInteractionPrompt(
        player,
        dialogueController.isOpen(),
        interactionPrompt
    );

}


function handleInteraction() {

    if (player.isDead) {
        return;
    }


    /*
     * If the world-object UI is already
     * open, E should not trigger another
     * interaction.
     */

    if (isWorldObjectUIOpen()) {
        return;
    }


    if (
        dialogueController.isOpen()
    ) {
        return;
    }


    /*
     * NPC interaction has priority.
     */

    const interactable =
        getNearbyInteractable(
            player
        );


    if (interactable) {

        dialogueController.openDialogue(
            interactable
        );

        return;

    }


    /*
     * Then check world objects.
     */

    const worldObject =
        getNearbyWorldObject(
            player
        );


    if (worldObject) {

        interactWithWorldObject(
            worldObject
        );

    }

}


/* =======================================================
   COMBAT
   ======================================================= */

function updateCombatSystem() {

    updateCombat(
        player
    );


    const combatState =
        getCombatState();


    if (!combatState.active) {

        if (player.isDead) {
            showDeathScreen();
        }

        return;

    }

}


/* =======================================================
   GAME UPDATE
   ======================================================= */

function updateGame() {

    if (!player.isDead) {

        updatePlayerMovement();

    } else {

        player.movement.moving =
            false;

    }


    updateWorldItemTarget();


    updateWorldObjectTarget();


    updateNPCTarget();


    updateCombatSystem();


    updateEnemyRespawns();


    drawPlayer();


    renderEnemies();


    renderWorldItems();


    renderWorldObjects(
        world
    );


    updatePlayerHUD();


    updateInteraction();


    updateCamera(
        player,
        world
    );


    if (player.isDead) {

        showDeathScreen();

    }

}


/* =======================================================
   GAME LOOP
   ======================================================= */

function gameLoop() {

    updateGame();


    requestAnimationFrame(
        gameLoop
    );

}


/* =======================================================
   START GAME
   ======================================================= */

function startGame() {

    titleScreen.style.display =
        "none";


    gameScreen.style.display =
        "block";


    setCharacterInterfaceAvailability(
        true
    );


    drawPlayer();


    updateGame();

}


/* =======================================================
   EVENT LISTENERS
   ======================================================= */

playButton.addEventListener(
    "click",
    startGame
);


/*
 * World objects are checked first.
 */

world.addEventListener(
    "click",
    handleWorldObjectClick
);


/*
 * NPCs are checked next.
 */

world.addEventListener(
    "click",
    handleNPCClick
);


/*
 * Unified interaction cursor.
 */

world.addEventListener(
    "mousemove",
    updateInteractionCursor
);


world.addEventListener(
    "click",
    handleWorldItemClick
);


world.addEventListener(
    "click",
    handleEnemyClick
);


world.addEventListener(
    "click",
    handleGroundClick
);


window.addEventListener(
    "keydown",
    event => {

        keys[event.key] = true;


        /*
         * Escape closes the world-object
         * interaction window.
         */

        if (
            event.key === "Escape"
        ) {

            if (
                isWorldObjectUIOpen()
            ) {

                closeWorldObjectUI();

                return;

            }

        }


        /*
         * E interacts with the nearest
         * available object or NPC.
         */

        if (
            event.key === "e" ||
            event.key === "E"
        ) {

            event.preventDefault();


            if (
                isWorldObjectUIOpen()
            ) {

                return;

            }


            handleInteraction();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.key] = false;

    }
);


continueButton.addEventListener(
    "click",
    () => {

        dialogueController.nextDialogue();

    }
);


closeButton.addEventListener(
    "click",
    () => {

        dialogueController.closeDialogue();

    }
);


window.addEventListener(
    "resize",
    () => {

        updateGame();

    }
);


/* =======================================================
   INITIAL STATE
   ======================================================= */

dialogueWindow.style.display =
    "none";


gameScreen.style.display =
    "none";


setCharacterInterfaceAvailability(
    false
);


createDeathOverlay();


initializeEnemies();


initializeWorldItems();


initializeWorldObjects();


gameLoop();