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

const titleScreen =
    document.getElementById("titleScreen");

const gameScreen =
    document.getElementById("gameScreen");

const playButton =
    document.getElementById("playButton");

const world =
    document.getElementById("world");

const playerElement =
    document.getElementById("player");

const interactionPrompt =
    document.getElementById("interactionPrompt");

const dialogueWindow =
    document.getElementById("dialogueWindow");

const dialogueText =
    document.getElementById("dialogueText");

const continueButton =
    document.getElementById("continueButton");

const closeButton =
    document.getElementById("closeButton");

const levelElement =
    document.getElementById("level");

const xpElement =
    document.getElementById("xp");

const healthCurrentElement =
    document.getElementById("healthCurrent");

const healthMaximumElement =
    document.getElementById("healthMaximum");

const healthFillElement =
    document.getElementById("healthFill");

const energyCurrentElement =
    document.getElementById("energyCurrent");

const energyMaximumElement =
    document.getElementById("energyMaximum");

const energyFillElement =
    document.getElementById("energyFill");

const keys = {};

const dialogueController =
    createDialogueController({
        dialogueWindow,
        dialogueText,
        continueButton
    });

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

function updateGame() {
    updatePlayerMovement(
        keys,
        dialogueController.isOpen()
    );

    drawPlayer(playerElement);

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

function gameLoop() {
    updateGame();

    requestAnimationFrame(
        gameLoop
    );
}

function startGame() {
    titleScreen.style.display =
        "none";

    gameScreen.style.display =
        "block";

    drawPlayer(playerElement);

    updateGame();
}

playButton.addEventListener(
    "click",
    startGame
);

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

window.addEventListener(
    "keyup",
    (event) => {
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

dialogueWindow.style.display =
    "none";

gameScreen.style.display =
    "none";

gameLoop();