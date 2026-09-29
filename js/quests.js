/* =======================================================
   QUEST SYSTEM
   ======================================================= */


/* =======================================================
   QUEST STATUS
   ======================================================= */

export const QUEST_STATUS = {

    NOT_STARTED: "not_started",

    IN_PROGRESS: "in_progress",

    COMPLETED: "completed"

};


/* =======================================================
   QUEST DEFINITIONS
   ======================================================= */

export const QUESTS = {

    MISSING_MINERS: {

        id: "missing_miners",

        name: "The Missing Miners",

        giverId: "commander_kael",

        description:
            "Three miners disappeared near the Xenium fields. " +
            "Their transport returned to Aurelia Colony empty. " +
            "Find out what happened to them.",

        objectives: [

            {
                id: "investigate_xenium_fields",

                description:
                    "Investigate the Xenium fields.",

                current: 0,

                required: 1,

                completed: false

            }

        ],

        rewards: {

            credits: 100,

            experience: 250

        }

    }

};


/* =======================================================
   PLAYER QUEST STATE
   ======================================================= */

const questState = {};


/* =======================================================
   INITIALIZE QUESTS
   ======================================================= */

function initializeQuestState() {

    for (
        const questId
        of Object.keys(QUESTS)
    ) {

        questState[questId] = {

            status:
                QUEST_STATUS.NOT_STARTED,

            objectives:
                QUESTS[questId].objectives.map(
                    objective => ({

                        id:
                            objective.id,

                        current:
                            0,

                        required:
                            objective.required,

                        completed:
                            false

                    })
                )

        };

    }

}


/* =======================================================
   START QUEST
   ======================================================= */

export function startQuest(
    questId
) {

    const quest =
        QUESTS[questId];

    if (!quest) {

        console.warn(
            `Unknown quest: ${questId}`
        );

        return false;

    }


    const state =
        questState[questId];

    if (!state) {

        return false;

    }


    if (
        state.status !==
        QUEST_STATUS.NOT_STARTED
    ) {

        return false;

    }


    state.status =
        QUEST_STATUS.IN_PROGRESS;


    console.log(
        `Quest started: ${quest.name}`
    );


    return true;

}


/* =======================================================
   GET QUEST
   ======================================================= */

export function getQuest(
    questId
) {

    return QUESTS[questId] || null;

}


/* =======================================================
   GET QUEST STATE
   ======================================================= */

export function getQuestState(
    questId
) {

    return questState[questId] || null;

}


/* =======================================================
   GET ALL QUEST STATES
   ======================================================= */

export function getAllQuestStates() {

    return questState;

}


/* =======================================================
   IS QUEST ACTIVE
   ======================================================= */

export function isQuestInProgress(
    questId
) {

    return (
        questState[questId]?.status ===
        QUEST_STATUS.IN_PROGRESS
    );

}


/* =======================================================
   IS QUEST COMPLETED
   ======================================================= */

export function isQuestCompleted(
    questId
) {

    return (
        questState[questId]?.status ===
        QUEST_STATUS.COMPLETED
    );

}


/* =======================================================
   COMPLETE OBJECTIVE
   ======================================================= */

export function completeQuestObjective(
    questId,
    objectiveId
) {

    const quest =
        QUESTS[questId];

    const state =
        questState[questId];

    if (
        !quest ||
        !state
    ) {

        return false;

    }


    if (
        state.status !==
        QUEST_STATUS.IN_PROGRESS
    ) {

        return false;

    }


    const objective =
        state.objectives.find(
            currentObjective =>
                currentObjective.id ===
                objectiveId
        );

    if (!objective) {

        return false;

    }


    objective.current =
        objective.required;

    objective.completed =
        true;


    checkQuestCompletion(
        questId
    );


    console.log(
        `Quest objective completed: ${objectiveId}`
    );


    return true;

}


/* =======================================================
   CHECK QUEST COMPLETION
   ======================================================= */

function checkQuestCompletion(
    questId
) {

    const state =
        questState[questId];

    if (!state) {

        return false;

    }


    const allObjectivesCompleted =
        state.objectives.every(
            objective =>
                objective.completed
        );


    if (!allObjectivesCompleted) {

        return false;

    }


    state.status =
        QUEST_STATUS.COMPLETED;


    const quest =
        QUESTS[questId];


    console.log(
        `Quest completed: ${quest.name}`
    );


    return true;

}


/* =======================================================
   GET QUEST OBJECTIVES
   ======================================================= */

export function getQuestObjectives(
    questId
) {

    const state =
        questState[questId];

    if (!state) {

        return [];

    }


    return state.objectives;

}


/* =======================================================
   QUEST GIVER CHECK
   ======================================================= */

export function getAvailableQuestForNPC(
    npcId
) {

    for (
        const questId
        of Object.keys(QUESTS)
    ) {

        const quest =
            QUESTS[questId];

        const state =
            questState[questId];

        if (
            quest.giverId !==
            npcId
        ) {

            continue;

        }


        if (
            state.status ===
            QUEST_STATUS.NOT_STARTED
        ) {

            return quest;

        }

    }


    return null;

}


/* =======================================================
   QUEST COMPLETION CHECK FOR NPC
   ======================================================= */

export function getCompletableQuestForNPC(
    npcId
) {

    for (
        const questId
        of Object.keys(QUESTS)
    ) {

        const quest =
            QUESTS[questId];

        const state =
            questState[questId];

        if (
            quest.giverId !==
            npcId
        ) {

            continue;

        }


        if (
            state.status ===
            QUEST_STATUS.COMPLETED
        ) {

            return quest;

        }

    }


    return null;

}


/* =======================================================
   INITIALIZE
   ======================================================= */

initializeQuestState();