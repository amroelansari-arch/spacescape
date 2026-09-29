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

                id:
                    "investigate_xenium_fields",

                description:
                    "Investigate the Xenium fields.",

                current:
                    0,

                required:
                    1,

                completed:
                    false

            }

        ],

        rewards: {

            credits:
                100,

            experience:
                250

        }

    }

};


/* =======================================================
   GLOBAL QUEST STATE
   ======================================================= */

/*
 * Store the quest state on globalThis.
 *
 * This guarantees that every module using the quest
 * system references the same state object.
 */

const QUEST_STATE_KEY =
    "__SPACESCAPE_QUEST_STATE__";


function createInitialQuestState() {

    const state = {};

    for (
        const questId
        of Object.keys(QUESTS)
    ) {

        state[questId] = {

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

    return state;

}


/* =======================================================
   LOAD SAVED QUEST STATE
   ======================================================= */

function loadQuestState() {

    /*
     * First check the global application state.
     */

    if (
        globalThis[QUEST_STATE_KEY]
    ) {

        return globalThis[
            QUEST_STATE_KEY
        ];

    }


    /*
     * Then attempt to restore the state
     * from localStorage.
     */

    try {

        const savedState =
            localStorage.getItem(
                QUEST_STATE_KEY
            );


        if (savedState) {

            const parsedState =
                JSON.parse(
                    savedState
                );


            if (parsedState) {

                globalThis[
                    QUEST_STATE_KEY
                ] = parsedState;


                return parsedState;

            }

        }

    } catch (error) {

        console.warn(
            "Unable to load saved quest state.",
            error
        );

    }


    /*
     * Nothing exists yet.
     * Create a fresh quest state.
     */

    const initialState =
        createInitialQuestState();


    globalThis[
        QUEST_STATE_KEY
    ] = initialState;


    return initialState;

}


const questState =
    loadQuestState();


/* =======================================================
   SAVE QUEST STATE
   ======================================================= */

function saveQuestState() {

    try {

        localStorage.setItem(

            QUEST_STATE_KEY,

            JSON.stringify(
                questState
            )

        );

    } catch (error) {

        console.warn(
            "Unable to save quest state.",
            error
        );

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

        console.warn(
            `No quest state found: ${questId}`
        );

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


    saveQuestState();


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

    return (
        QUESTS[questId] ||
        null
    );

}


/* =======================================================
   GET QUEST STATE
   ======================================================= */

export function getQuestState(
    questId
) {

    return (
        questState[questId] ||
        null
    );

}


/* =======================================================
   GET ALL QUEST STATES
   ======================================================= */

export function getAllQuestStates() {

    return questState;

}


/* =======================================================
   IS QUEST IN PROGRESS
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


    saveQuestState();


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


    saveQuestState();


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
   GET AVAILABLE QUEST FOR NPC
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
   GET COMPLETABLE QUEST FOR NPC
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
   DEBUG
   ======================================================= */

export function resetQuestState(
    questId
) {

    if (
        !QUESTS[questId]
    ) {

        return false;

    }


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


    saveQuestState();


    console.log(
        `Quest reset: ${QUESTS[questId].name}`
    );


    return true;

}


/* =======================================================
   INITIAL SAVE
   ======================================================= */

saveQuestState();