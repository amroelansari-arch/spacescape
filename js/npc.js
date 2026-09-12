export const commanderKaelData = {

    id: "commander_kael",

    name: "Commander Kael",

    position: {

        x: 1050,

        y: 650

    },

    interactionDistance: 85

};


export const kaelDialogue = [

    "Commander Kael: You're finally here. We've been waiting for someone capable enough to investigate what happened outside the colony.",

    "Commander Kael: Three miners disappeared near the Xenium fields yesterday. Their transport came back empty.",

    "Commander Kael: I need someone to find out what happened. Be careful. Whatever took them may still be out there.",

    "Commander Kael: Talk to me again when you're ready. This could be your first real assignment."

];


export function getDistanceToKael(
    player
) {

    const dx =
        player.position.x -
        commanderKaelData.position.x;

    const dy =
        player.position.y -
        commanderKaelData.position.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


export function canInteractWithKael(
    player
) {

    return (
        getDistanceToKael(player) <=
        commanderKaelData.interactionDistance
    );

}


export function updateInteractionPrompt(
    player,
    dialogueOpen,
    interactionPrompt
) {

    if (dialogueOpen) {

        interactionPrompt.style.display =
            "none";

        return;

    }


    if (
        canInteractWithKael(player)
    ) {

        interactionPrompt.style.display =
            "block";

    } else {

        interactionPrompt.style.display =
            "none";

    }

}


export function createDialogueController(
    elements
) {

    let dialogueOpen =
        false;

    let dialogueIndex =
        0;


    function updateDialogue() {

        elements.dialogueName.textContent =
            commanderKaelData.name;


        elements.dialogueText.textContent =
            kaelDialogue[dialogueIndex];


        if (
            dialogueIndex >=
            kaelDialogue.length - 1
        ) {

            elements.dialogueNext.textContent =
                "Finish";

        } else {

            elements.dialogueNext.textContent =
                "Continue";

        }

    }


    function openDialogue(player) {

        if (
            !canInteractWithKael(player)
        ) {

            return;

        }


        dialogueOpen =
            true;

        dialogueIndex =
            0;


        elements.dialogue.style.display =
            "block";


        elements.interactionPrompt.style.display =
            "none";


        updateDialogue();

    }


    function nextDialogue() {

        if (!dialogueOpen) {

            return;

        }


        if (
            dialogueIndex <
            kaelDialogue.length - 1
        ) {

            dialogueIndex++;

            updateDialogue();

        } else {

            closeDialogue();

        }

    }


    function closeDialogue() {

        dialogueOpen =
            false;

        elements.dialogue.style.display =
            "none";

    }


    return {

        isOpen() {

            return dialogueOpen;

        },

        openDialogue,

        nextDialogue,

        closeDialogue

    };

}