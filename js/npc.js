import {
    getQuestState,
    startQuest,
    isQuestInProgress,
    isQuestCompleted
} from "./quests.js";


/* =======================================================
   COMMANDER KAEL
   ======================================================= */

export const commanderKaelData = {

    id: "commander_kael",

    type: "npc",

    name: "Commander Kael",

    position: {
        x: 1050,
        y: 650
    },

    interactionDistance: 85

};


/* =======================================================
   QUEST
   ======================================================= */

const MISSING_MINERS_QUEST_ID =
    "missing_miners";


/* =======================================================
   KAE​​L DIALOGUE
   ======================================================= */

const kaelDialogueNotStarted = [

    "Commander Kael: You're finally here. We've been waiting for someone capable enough to investigate what happened outside the colony.",

    "Commander Kael: Three miners disappeared near the Xenium fields yesterday. Their transport came back empty.",

    "Commander Kael: I need someone to find out what happened. Be careful. Whatever took them may still be out there.",

    "Commander Kael: Talk to me again when you're ready. This could be your first real assignment."

];


const kaelDialogueInProgress = [

    "Commander Kael: You're working on the missing miners investigation.",

    "Commander Kael: Three miners disappeared near the Xenium fields. Their transport returned empty.",

    "Commander Kael: Investigate the Xenium fields and find out what happened to them.",

    "Commander Kael: Come back to me when you have found something."

];


const kaelDialogueCompleted = [

    "Commander Kael: You found out what happened to the missing miners.",

    "Commander Kael: Good work. That investigation was exactly what I needed.",

    "Commander Kael: You've completed your first assignment. Keep your eyes open out there."

];


/* =======================================================
   GET CURRENT KAE​​L DIALOGUE
   ======================================================= */

function getCurrentKaelDialogue() {

    if (
        isQuestCompleted(
            MISSING_MINERS_QUEST_ID
        )
    ) {

        return kaelDialogueCompleted;

    }


    if (
        isQuestInProgress(
            MISSING_MINERS_QUEST_ID
        )
    ) {

        return kaelDialogueInProgress;

    }


    return kaelDialogueNotStarted;

}


/* =======================================================
   INTERACTABLES
   ======================================================= */

const interactables = [

    commanderKaelData

];


export function getInteractables() {

    return interactables;

}


/* =======================================================
   DISTANCE
   ======================================================= */

export function getDistanceBetweenPlayerAndInteractable(
    player,
    interactable
) {

    const dx =
        player.position.x -
        interactable.position.x;

    const dy =
        player.position.y -
        interactable.position.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =======================================================
   NEARBY INTERACTABLE
   ======================================================= */

export function getNearbyInteractable(
    player
) {

    let closestInteractable =
        null;

    let closestDistance =
        Infinity;


    for (
        const interactable
        of interactables
    ) {

        const distance =
            getDistanceBetweenPlayerAndInteractable(
                player,
                interactable
            );


        if (
            distance <=
                interactable.interactionDistance &&
            distance <
                closestDistance
        ) {

            closestInteractable =
                interactable;

            closestDistance =
                distance;

        }

    }


    return closestInteractable;

}


/* =======================================================
   KAE​​L INTERACTION CHECK
   ======================================================= */

export function canInteractWithKael(
    player
) {

    return Boolean(

        getNearbyInteractable(
            player
        )?.id ===
        commanderKaelData.id

    );

}


/* =======================================================
   INTERACTION PROMPT
   ======================================================= */

export function updateInteractionPrompt(
    player,
    dialogueOpen,
    interactionPrompt
) {

    if (dialogueOpen) {

        interactionPrompt.style.display =
            "none";

        return null;

    }


    const interactable =
        getNearbyInteractable(
            player
        );


    if (!interactable) {

        interactionPrompt.style.display =
            "none";

        return null;

    }


    interactionPrompt.textContent =
        `Press E to interact with ${interactable.name}`;


    interactionPrompt.style.display =
        "block";


    return interactable;

}


/* =======================================================
   DIALOGUE CONTROLLER
   ======================================================= */

export function createDialogueController(
    elements
) {

    let currentDialogueIndex =
        0;

    let dialogueOpen =
        false;

    let currentDialogue =
        kaelDialogueNotStarted;


    /* ===================================================
       IS OPEN
       =================================================== */

    function isOpen() {

        return dialogueOpen;

    }


    /* ===================================================
       UPDATE DIALOGUE
       =================================================== */

    function updateDialogue() {

        if (
            !currentDialogue ||
            currentDialogue.length === 0
        ) {

            return;

        }


        elements.dialogueText.textContent =
            currentDialogue[
                currentDialogueIndex
            ];


        if (
            currentDialogueIndex >=
            currentDialogue.length - 1
        ) {

            elements.continueButton.textContent =
                "Close";

        } else {

            elements.continueButton.textContent =
                "Continue";

        }

    }


    /* ===================================================
       OPEN DIALOGUE
       =================================================== */

    function openDialogue(
        interactable
    ) {

        if (!interactable) {

            return;

        }


        if (
            interactable.id !==
            commanderKaelData.id
        ) {

            return;

        }


        /*
         * Determine the current quest state
         * before opening the conversation.
         */

        const questState =
            getQuestState(
                MISSING_MINERS_QUEST_ID
            );


        /*
         * First conversation:
         *
         * Start the quest immediately when
         * the player begins talking to Kael.
         *
         * This makes quest progression independent
         * of how the dialogue window is closed.
         */

        if (
            questState &&
            questState.status ===
                "not_started"
        ) {

            const started =
                startQuest(
                    MISSING_MINERS_QUEST_ID
                );


            if (started) {

                console.log(
                    "The Missing Miners quest started."
                );

            }


            /*
             * Keep the introductory dialogue
             * for this first conversation.
             */

            currentDialogue =
                kaelDialogueNotStarted;

        } else {

            /*
             * Existing quest:
             *
             * Select the appropriate dialogue
             * based on the current quest state.
             */

            currentDialogue =
                getCurrentKaelDialogue();

        }


        currentDialogueIndex =
            0;

        dialogueOpen =
            true;


        elements.dialogueWindow.style.display =
            "block";


        updateDialogue();

    }


    /* ===================================================
       NEXT DIALOGUE
       =================================================== */

    function nextDialogue() {

        if (!dialogueOpen) {

            return;

        }


        if (
            currentDialogueIndex <
            currentDialogue.length - 1
        ) {

            currentDialogueIndex++;

            updateDialogue();

            return;

        }


        closeDialogue();

    }


    /* ===================================================
       CLOSE DIALOGUE
       =================================================== */

    function closeDialogue() {

        dialogueOpen =
            false;


        elements.dialogueWindow.style.display =
            "none";


        currentDialogueIndex =
            0;


        currentDialogue =
            getCurrentKaelDialogue();

    }


    return {

        isOpen,

        openDialogue,

        nextDialogue,

        closeDialogue

    };

}