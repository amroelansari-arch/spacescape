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
    startCombat,
    stopCombat,
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


/* =======================================================
   HUD ELEMENTS
   ======================================================= */

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
   INPUT
   ======================================================= */

const keys = {};


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
   ENEMY CLICK HANDLING
   ======================================================= */

function handleEnemyClick(
    event
) {

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

    const distance =
        getDistance(
            player.position.x,
            player.position.y,
            enemy.position.x,
            enemy.position.y
        );

    if (distance > 100) {

        console.log(
            "Enemy is too far away to attack."
        );

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
   COMBAT UPDATE
   ======================================================= */

function updateCombatSystem() {

    updateCombat(
        player
    );

    cleanupDeadWorldEnemies();

    const combatState =
        getCombatState();

    if (
        !combatState.active
    ) {
        return;
    }
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

    updateCombatSystem();

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
   WORLD CLICK
   ======================================================= */

world.addEventListener(
    "click",
    handleEnemyClick
);


/* =======================================================
   KEYBOARD DOWN
   ======================================================= */

window.addEventListener(
    "keydown",
    (event) => {

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