import {
    player,
    updatePlayerMovement,
    drawPlayer,
    updatePlayerHUD
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
    cleanupDeadWorldEnemies
} from "./enemyWorld.js";

import {
    renderEnemies
} from "./enemyRenderer.js";

import {
    findNearestEnemy,
    getDistance
} from "./enemies.js";

import {
    performAttack
} from "./combat.js";


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

const playerElement =
    document.getElementById("player");

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
   HUD ELEMENTS
   ======================================================= */

const levelElement =
    document.getElementById("level");

const xpElement =
    document.getElementById("xp");

const healthCurrentElement =
    document.getElementById("health");

const healthMaximumElement = {
    textContent: "100"
};

const healthFillElement =
    document.getElementById("health-bar");

const energyCurrentElement =
    document.getElementById("energy");

const energyMaximumElement = {
    textContent: "100"
};

const energyFillElement =
    document.getElementById("energy-bar");


/* =======================================================
   INPUT
   ======================================================= */

const keys = {};


/* =======================================================
   COMBAT SETTINGS
   ======================================================= */

const PLAYER_ATTACK_RANGE = 100;

const PLAYER_ATTACK_COOLDOWN = 500;

let lastPlayerAttackTime = 0;


/* =======================================================
   DIALOGUE CONTROLLER
   ======================================================= */

const dialogueController =
    createDialogueController({
        dialogueWindow,
        dialogueText,
        continueButton
    });


/* =======================================================
   ENEMY WORLD INITIALIZATION
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
   FIND ATTACK TARGET
   ======================================================= */

function getAttackTarget() {

    const enemies =
        getEnemyCollection();

    return findNearestEnemy(
        enemies,
        player.position.x,
        player.position.y
    );
}


/* =======================================================
   PLAYER ATTACK
   ======================================================= */

function playerAttack() {

    if (
        dialogueController.isOpen()
    ) {
        return;
    }

    const now =
        performance.now();

    if (
        now -
        lastPlayerAttackTime <
        PLAYER_ATTACK_COOLDOWN
    ) {
        return;
    }

    const target =
        getAttackTarget();

    if (!target) {
        return;
    }

    const distance =
        getDistance(
            player.position.x,
            player.position.y,
            target.position.x,
            target.position.y
        );

    if (
        distance >
        PLAYER_ATTACK_RANGE
    ) {
        return;
    }

    const attackSucceeded =
        performAttack(
            player,
            target,
            player.attack
        );

    if (!attackSucceeded) {
        return;
    }

    lastPlayerAttackTime =
        now;

    if (
        target.health.current <= 0
    ) {
        cleanupDeadWorldEnemies();
    }
}


/* =======================================================
   INTERACTION
   ======================================================= */

function updateInteraction() {

    return updateInteractionPrompt(
        player,
        dialogueController.isOpen(),
        interactionPrompt
    );
}


function handleInteraction() {

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
   GAME UPDATE
   ======================================================= */

function updateGame() {

    updatePlayerMovement(
        keys,
        dialogueController.isOpen()
    );

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

    drawPlayer(
        playerElement
    );

    updateGame();
}


/* =======================================================
   PLAY BUTTON
   ======================================================= */

playButton.addEventListener(
    "click",
    startGame
);


/* =======================================================
   KEYBOARD DOWN
   ======================================================= */

window.addEventListener(
    "keydown",
    (event) => {

        keys[event.key] = true;


        /* -----------------------------------------------
           INTERACTION
           ----------------------------------------------- */

        if (
            event.key === "e" ||
            event.key === "E"
        ) {

            event.preventDefault();

            handleInteraction();
        }


        /* -----------------------------------------------
           ATTACK
           ----------------------------------------------- */

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            playerAttack();
        }
    }
);


/* =======================================================
   KEYBOARD UP
   ======================================================= */

window.addEventListener(
    "keyup",
    (event) => {

        keys[event.key] = false;
    }
);


/* =======================================================
   DIALOGUE BUTTONS
   ======================================================= */

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


/* =======================================================
   RESIZE
   ======================================================= */

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


/* =======================================================
   INITIALIZE ENEMIES
   ======================================================= */

initializeEnemies();


/* =======================================================
   START LOOP
   ======================================================= */

gameLoop();