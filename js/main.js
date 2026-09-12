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
    updateInteractionPrompt,
    createDialogueController
} from "./npc.js";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const playButton =
    document.getElementById(
        "play-button"
    );


const titleScreen =
    document.getElementById(
        "title-screen"
    );


const gameScreen =
    document.getElementById(
        "game-screen"
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


const dialogue =
    document.getElementById(
        "dialogue"
    );


const dialogueName =
    document.getElementById(
        "dialogue-name"
    );


const dialogueText =
    document.getElementById(
        "dialogue-text"
    );


const dialogueNext =
    document.getElementById(
        "dialogue-next"
    );


const dialogueClose =
    document.getElementById(
        "dialogue-close"
    );


const hudElements = {

    level:
        document.getElementById(
            "level"
        ),

    health:
        document.getElementById(
            "health"
        ),

    energy:
        document.getElementById(
            "energy"
        ),

    xp:
        document.getElementById(
            "xp"
        ),

    healthBar:
        document.getElementById(
            "health-bar"
        ),

    energyBar:
        document.getElementById(
            "energy-bar"
        )

};


const dialogueController =
    createDialogueController({

        dialogue,

        dialogueName,

        dialogueText,

        dialogueNext,

        interactionPrompt

    });


/* =========================================================
   INPUT
   ========================================================= */

const keys = {};


/* =========================================================
   GAME LOOP
   ========================================================= */

function gameLoop() {

    updatePlayerMovement(
        keys,
        dialogueController.isOpen()
    );


    drawPlayer(
        playerElement
    );


    updatePlayerHUD(
        hudElements
    );


    updateInteractionPrompt(
        player,
        dialogueController.isOpen(),
        interactionPrompt
    );


    updateCamera(
        player,
        world
    );


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   PLAY BUTTON
   ========================================================= */

playButton.addEventListener(
    "click",
    function() {

        titleScreen.style.display =
            "none";

        gameScreen.style.display =
            "block";


        drawPlayer(
            playerElement
        );


        updatePlayerHUD(
            hudElements
        );


        updateCamera(
            player,
            world
        );


        updateInteractionPrompt(
            player,
            dialogueController.isOpen(),
            interactionPrompt

        );

    }
);


/* =========================================================
   KEYBOARD DOWN
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        keys[key] =
            true;


        if (
            key === "e" &&
            !event.repeat
        ) {

            if (
                dialogueController.isOpen()
            ) {

                dialogueController.nextDialogue();

            } else {

                dialogueController.openDialogue(
                    player
                );

            }

        }


        if (
            key === "escape"
        ) {

            if (
                dialogueController.isOpen()
            ) {

                dialogueController.closeDialogue();

            }

        }

    }
);


/* =========================================================
   KEYBOARD UP
   ========================================================= */

document.addEventListener(
    "keyup",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   DIALOGUE BUTTONS
   ========================================================= */

dialogueNext.addEventListener(
    "click",
    function() {

        dialogueController.nextDialogue();

    }
);


dialogueClose.addEventListener(
    "click",
    function() {

        dialogueController.closeDialogue();

    }
);


/* =========================================================
   WINDOW RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    function() {

        updateCamera(
            player,
            world
        );

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

drawPlayer(
    playerElement
);


updatePlayerHUD(
    hudElements
);


/* =========================================================
   START GAME
   ========================================================= */

gameLoop();