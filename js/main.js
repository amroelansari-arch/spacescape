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
    createDialogueController
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


/* =======================================================
   DOM ELEMENTS
   ======================================================= */

const titleScreen =
    document.getElementById(
        "title-screen"
    );

const gameScreen =
    document.getElementById(
        "game-screen"
    );

const playButton =
    document.getElementById(
        "play-button"
    );

const world =
    document.getElementById(
        "world"
    );

const interactionPrompt =
    document.getElementById(
        "interaction-prompt"
    );

const dialogueWindow =
    document.getElementById(
        "dialogue"
    );

const dialogueText =
    document.getElementById(
        "dialogue-text"
    );

const continueButton =
    document.getElementById(
        "dialogue-next"
    );

const closeButton =
    document.getElementById(
        "dialogue-close"
    );


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
   ENEMY CLICK
   ======================================================= */

function handleEnemyClick(
    event
) {

    if (player.isDead) {
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


    /*
     * Ask the pathfinder for the shortest
     * collision-safe route.
     */

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


    /*
     * Ground movement now follows the
     * calculated waypoint path.
     */

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


    if (
        dialogueController.isOpen()
    ) {
        return;
    }


    const interactable =
        getNearbyInteractable(
            player
        );


    if (!interactable) {
        return;
    }


    dialogueController.openDialogue(
        interactable
    );

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


    updateCombatSystem();


    updateEnemyRespawns();


    drawPlayer();


    renderEnemies();


    renderWorldItems();


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


        if (
            event.key === "e" ||
            event.key === "E"
        ) {

            event.preventDefault();


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


gameLoop();