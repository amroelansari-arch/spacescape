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
   DIALOGUE CONTROLLER
   ======================================================= */

const dialogueController =
    createDialogueController({
        dialogueWindow,
        dialogueText,
        continueButton
    });


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

    if (dialogueController.isOpen()) {
        return;
    }

    const interactable =
        getNearbyInteractable(player);

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
   START LOOP
   ======================================================= */

gameLoop();