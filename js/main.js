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

const levelElement =
    document.getElementById(
        "level"
    );

const xpElement =
    document.getElementById(
        "xp"
    );

const healthCurrentElement =
    document.getElementById(
        "health"
    );

const healthMaximumElement = {
    textContent: "100"
};

const healthFillElement =
    document.getElementById(
        "health-bar"
    );

const energyCurrentElement =
    document.getElementById(
        "energy"
    );

const energyMaximumElement = {
    textContent: "100"
};

const energyFillElement =
    document.getElementById(
        "energy-bar"
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
   RESPawn
   ======================================================= */

function handleRespawn() {

    if (!player.isDead) {
        return;
    }

    respawnPlayer();

    hideDeathScreen();

    drawPlayer(
        playerElement
    );

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
        5,
        2,
        1500,
        900
    );

    spawnWorldEnemy(
        "Test Enemy",
        1,
        50,
        5,
        2,
        1800,
        1100
    );

    spawnWorldEnemy(
        "Test Enemy",
        2,
        75,
        8,
        3,
        2200,
        1400
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


    drawPlayer(
        playerElement
    );

    renderEnemies();

    updatePlayerHUD({
        levelElement,
        xpElement,
        healthCurrentElement,
        healthMaximumElement,
        healthFillElement,
        energyCurrentElement,
        energyMaximumElement,
        energyFillElement
    });

    updateInteraction();

    updateCamera(
        player,
        world
    );


    if (
        player.isDead
    ) {

        showDeathScreen();

    }

}


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

    drawPlayer(
        playerElement
    );

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

createDeathOverlay();

initializeEnemies();

gameLoop();