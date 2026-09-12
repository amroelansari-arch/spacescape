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

export const kaelDialogue = [
    "Commander Kael: You're finally here. We've been waiting for someone capable enough to investigate what happened outside the colony.",
    "Commander Kael: Three miners disappeared near the Xenium fields yesterday. Their transport came back empty.",
    "Commander Kael: I need someone to find out what happened. Be careful. Whatever took them may still be out there.",
    "Commander Kael: Talk to me again when you're ready. This could be your first real assignment."
];

const interactables = [
    commanderKaelData
];

export function getInteractables() {
    return interactables;
}

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

export function getNearbyInteractable(player) {
    let closestInteractable = null;
    let closestDistance = Infinity;

    for (const interactable of interactables) {
        const distance =
            getDistanceBetweenPlayerAndInteractable(
                player,
                interactable
            );

        if (
            distance <= interactable.interactionDistance &&
            distance < closestDistance
        ) {
            closestInteractable = interactable;
            closestDistance = distance;
        }
    }

    return closestInteractable;
}

export function canInteractWithKael(player) {
    return Boolean(
        getNearbyInteractable(player)?.id ===
        commanderKaelData.id
    );
}

export function updateInteractionPrompt(
    player,
    dialogueOpen,
    interactionPrompt
) {
    if (dialogueOpen) {
        interactionPrompt.style.display = "none";
        return null;
    }

    const interactable =
        getNearbyInteractable(player);

    if (!interactable) {
        interactionPrompt.style.display = "none";
        return null;
    }

    interactionPrompt.textContent =
        `Press E to interact with ${interactable.name}`;

    interactionPrompt.style.display = "block";

    return interactable;
}

export function createDialogueController(elements) {
    let currentDialogueIndex = 0;
    let dialogueOpen = false;

    function isOpen() {
        return dialogueOpen;
    }

    function updateDialogue() {
        elements.dialogueText.textContent =
            kaelDialogue[currentDialogueIndex];

        if (
            currentDialogueIndex >=
            kaelDialogue.length - 1
        ) {
            elements.continueButton.textContent =
                "Close";
        } else {
            elements.continueButton.textContent =
                "Continue";
        }
    }

    function openDialogue(interactable) {
        if (!interactable) {
            return;
        }

        if (interactable.id !== commanderKaelData.id) {
            return;
        }

        currentDialogueIndex = 0;
        dialogueOpen = true;

        elements.dialogueWindow.style.display =
            "block";

        updateDialogue();
    }

    function nextDialogue() {
        if (!dialogueOpen) {
            return;
        }

        if (
            currentDialogueIndex <
            kaelDialogue.length - 1
        ) {
            currentDialogueIndex++;
            updateDialogue();
        } else {
            closeDialogue();
        }
    }

    function closeDialogue() {
        dialogueOpen = false;

        elements.dialogueWindow.style.display =
            "none";

        currentDialogueIndex = 0;
    }

    return {
        isOpen,
        openDialogue,
        nextDialogue,
        closeDialogue
    };
}