import {
    setCharacterInterfaceAvailability
} from "./characterInterface.js";

import {
    player,
    updatePlayerMovement,
    drawPlayer,
    updatePlayerHUD,
    respawnPlayer
} from "./player.js";

import {
    updateCamera
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
    getWorldItems,
    findWorldItemById,
    removeWorldItem,
    getDistanceToWorldItem
} from "./itemWorld.js";

import {
    renderWorldItems,
    isWithinItemPickupRange
} from "./itemRenderer.js";

import {
    getItem
} from "./items.js";

import {
    addItem
} from "./inventory.js";


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

const playerElement =
    document.getElementById(
        "player"
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

    deathOverlay.style.fontFamily =
        "Arial, sans-serif";


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

    title.style.textShadow =
        "0 3px 8px #000000";


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

    /*
     * First real world item.
     *
     * This is intentionally placed close enough
     * to the starting player position to make
     * the acquisition system easy to test.
     */

    createWorldItem(
        "laser_rifle",
        1300,
        900,
        1
    );

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


    /*
     * The player must actually be near
     * the item to pick it up.
     */

    if (
        !isWithinItemPickupRange(
            player,
            worldItem
        )
    ) {

        console.log(
            "Move closer to pick up this item."
        );

        return;

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

        return;

    }


    /*
     * Attempt to add the item to inventory.
     *
     * If the inventory is full,
     * addItem() returns false and
     * the world item remains.
     */

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

        return;

    }


    /*
     * Inventory acquisition succeeded.
     * Remove the item from the world.
     */

    removeWorldItem(
        worldItem
    );


    console.log(
        `${itemDefinition.name} picked up.`
    );

    console.log(
        "Inventory:",
        player.inventory
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

    startCombat(
        player,
        enemy
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

        updatePlayerMovement(
            keys,
            dialogueController.isOpen()
        );

    } else {

        player.movement.moving =
            false;

    }


    updateCombatSystem();


    /*
     * Dead enemies are removed and their
     * spawn points begin their respawn timers.
     */

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


    /*
     * Character becomes available only
     * after the player enters the game.
     */

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
 * World clicks are deliberately checked
 * for items first.
 *
 * If the click is not an item,
 * enemy targeting continues to work.
 */

world.addEventListener(
    "click",
    handleWorldItemClick
);

world.addEventListener(
    "click",
    handleEnemyClick
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