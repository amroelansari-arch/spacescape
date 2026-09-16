import {
    setCharacterInterfaceAvailability,
    refreshCharacterInterface
} from "./characterInterface.js";

import {
    player,
    updatePlayerMovement,
    drawPlayer,
    updatePlayerHUD,
    respawnPlayer,
    setMovementTarget,
    getMovementTarget,
    clearMovementTarget
} from "./player.js";

import {
    updateCamera,
    WORLD_WIDTH,
    WORLD_HEIGHT
} from "./world.js";

import {
    getNearbyInteractable,
    updateInteractionPrompt,
    createDialogueController,
    getInteractables
} from "./npc.js";

import {
    spawnWorldEnemy,
    getEnemyCollection,
    updateEnemyRespawns
} from "./enemyWorld.js";

import {
    renderEnemies
} from "./enemyRenderer.js";

import {
    startCombat,
    stopCombat,
    updateCombat,
    getCombatState
} from "./combatSystem.js";

import {
    createWorldItem,
    findWorldItemById,
    removeWorldItem
} from "./itemWorld.js";

import {
    renderWorldItems
} from "./itemRenderer.js";

import {
    getItem
} from "./items.js";

import {
    addItem
} from "./inventory.js";

import {
    awardSkillXP
} from "./skills.js";

import {
    findPath
} from "./pathfinding.js";

import {
    createWorldObject,
    getWorldObjects,
    getWorldObjectById,
    getNearbyWorldObject,
    getDistanceToWorldObject
} from "./worldObjects.js";

import {
    renderWorldObjects
} from "./worldObjectRenderer.js";

import {
    openWorldObjectUI,
    closeWorldObjectUI,
    isWorldObjectUIOpen
} from "./worldObjectUI.js";

import {
    createResourceNode,
    getResourceNodes,
    getResourceNodeById,
    getDistanceToResourceNode,
    depleteResourceNode,
    updateResourceNodeRespawns
} from "./resourceNodes.js";

import {
    renderResourceNodes
} from "./resourceRenderer.js";


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
   KEYBOARD
   ======================================================= */

const keys = {};


/* =======================================================
   GAME MESSAGE
   ======================================================= */

let gameMessageElement = null;

let gameMessageTimer = null;


function createGameMessageElement() {

    if (gameMessageElement) {
        return;
    }


    gameMessageElement =
        document.createElement("div");


    gameMessageElement.id =
        "spacescape-game-message";


    gameMessageElement.style.position =
        "fixed";

    gameMessageElement.style.left =
        "50%";

    gameMessageElement.style.bottom =
        "90px";

    gameMessageElement.style.transform =
        "translateX(-50%)";

    gameMessageElement.style.padding =
        "10px 18px";

    gameMessageElement.style.background =
        "rgba(0, 0, 0, 0.85)";

    gameMessageElement.style.border =
        "1px solid rgba(255, 255, 255, 0.25)";

    gameMessageElement.style.borderRadius =
        "6px";

    gameMessageElement.style.color =
        "#ffffff";

    gameMessageElement.style.fontSize =
        "14px";

    gameMessageElement.style.fontWeight =
        "600";

    gameMessageElement.style.zIndex =
        "15000";

    gameMessageElement.style.pointerEvents =
        "none";

    gameMessageElement.style.opacity =
        "0";

    gameMessageElement.style.transition =
        "opacity 0.2s ease";


    document.body.appendChild(
        gameMessageElement
    );

}


function showGameMessage(
    message
) {

    createGameMessageElement();


    gameMessageElement.textContent =
        message;


    gameMessageElement.style.opacity =
        "1";


    if (gameMessageTimer) {

        clearTimeout(
            gameMessageTimer
        );

    }


    gameMessageTimer =
        setTimeout(
            () => {

                if (gameMessageElement) {

                    gameMessageElement.style.opacity =
                        "0";

                }

            },
            2500
        );

}


/* =======================================================
   MINING ACTION STATE
   ======================================================= */

const miningState = {
    active: false,
    resourceNodeId: null,
    startedAt: 0,
    duration: 0
};


function isMining() {

    return miningState.active;

}


function stopMining() {

    if (!miningState.active) {
        return;
    }


    miningState.active =
        false;

    miningState.resourceNodeId =
        null;

    miningState.startedAt =
        0;

    miningState.duration =
        0;


    console.log(
        "Mining stopped."
    );

}


/* =======================================================
   SALVAGING ACTION STATE
   ======================================================= */

const salvagingState = {
    active: false,
    resourceNodeId: null,
    startedAt: 0,
    duration: 0
};


function isSalvaging() {

    return salvagingState.active;

}


function stopSalvaging() {

    if (!salvagingState.active) {
        return;
    }


    salvagingState.active =
        false;

    salvagingState.resourceNodeId =
        null;

    salvagingState.startedAt =
        0;

    salvagingState.duration =
        0;


    console.log(
        "Salvaging stopped."
    );

}


/* =======================================================
   DIALOGUE
   ======================================================= */

const dialogueController =
    createDialogueController({
        dialogueWindow,
        dialogueText,
        continueButton
    });


/* =======================================================
   CLICK MARKER
   ======================================================= */

let clickMarker = null;

let clickMarkerTimer = null;


function createClickMarker() {

    if (clickMarker) {
        return;
    }


    clickMarker =
        document.createElement("div");


    clickMarker.id =
        "spacescape-click-marker";


    clickMarker.style.position =
        "absolute";

    clickMarker.style.width =
        "18px";

    clickMarker.style.height =
        "18px";

    clickMarker.style.pointerEvents =
        "none";

    clickMarker.style.zIndex =
        "5000";

    clickMarker.style.transform =
        "translate(-50%, -50%)";

    clickMarker.style.opacity =
        "0";

    clickMarker.style.transition =
        "opacity 0.15s ease";


    const lineOne =
        document.createElement("div");

    const lineTwo =
        document.createElement("div");


    for (
        const line
        of [lineOne, lineTwo]
    ) {

        line.style.position =
            "absolute";

        line.style.left =
            "8px";

        line.style.top =
            "1px";

        line.style.width =
            "2px";

        line.style.height =
            "16px";

        line.style.background =
            "#ffffff";

        line.style.boxShadow =
            "0 0 3px #000000";

        line.style.borderRadius =
            "2px";

    }


    lineOne.style.transform =
        "rotate(45deg)";

    lineTwo.style.transform =
        "rotate(-45deg)";


    clickMarker.appendChild(
        lineOne
    );

    clickMarker.appendChild(
        lineTwo
    );


    world.appendChild(
        clickMarker
    );

}


function showClickMarker(
    x,
    y
) {

    createClickMarker();


    clickMarker.style.left =
        `${x}px`;

    clickMarker.style.top =
        `${y}px`;

    clickMarker.style.opacity =
        "1";


    if (clickMarkerTimer) {

        clearTimeout(
            clickMarkerTimer
        );

    }


    clickMarkerTimer =
        setTimeout(
            () => {

                if (clickMarker) {

                    clickMarker.style.opacity =
                        "0";

                }

            },
            900
        );

}


/* =======================================================
   DEATH UI
   ======================================================= */

let deathOverlay = null;

let respawnButton = null;


function createDeathOverlay() {

    if (deathOverlay) {
        return;
    }


    deathOverlay =
        document.createElement("div");


    deathOverlay.id =
        "spacescape-death-overlay";


    deathOverlay.style.position =
        "fixed";

    deathOverlay.style.inset =
        "0";

    deathOverlay.style.display =
        "none";

    deathOverlay.style.alignItems =
        "center";

    deathOverlay.style.justifyContent =
        "center";

    deathOverlay.style.flexDirection =
        "column";

    deathOverlay.style.background =
        "rgba(0, 0, 0, 0.78)";

    deathOverlay.style.zIndex =
        "10000";


    const title =
        document.createElement("div");


    title.textContent =
        "YOU DIED";


    title.style.color =
        "#ffffff";

    title.style.fontSize =
        "48px";

    title.style.fontWeight =
        "900";

    title.style.marginBottom =
        "20px";


    respawnButton =
        document.createElement("button");


    respawnButton.textContent =
        "RESPAWN";


    respawnButton.style.padding =
        "12px 28px";

    respawnButton.style.fontSize =
        "16px";

    respawnButton.style.fontWeight =
        "bold";

    respawnButton.style.cursor =
        "pointer";


    respawnButton.addEventListener(
        "click",
        handleRespawn
    );


    deathOverlay.appendChild(
        title
    );

    deathOverlay.appendChild(
        respawnButton
    );


    document.body.appendChild(
        deathOverlay
    );

}


function showDeathScreen() {

    createDeathOverlay();


    deathOverlay.style.display =
        "flex";

}


function hideDeathScreen() {

    if (!deathOverlay) {
        return;
    }


    deathOverlay.style.display =
        "none";

}


/* =======================================================
   RESPAWN
   ======================================================= */

function handleRespawn() {

    if (!player.isDead) {
        return;
    }


    stopMining();

    stopSalvaging();

    respawnPlayer();

    hideDeathScreen();

    drawPlayer();

    updatePlayerHUD();

    updateGame();

}


/* =======================================================
   INITIALIZE ENEMIES
   ======================================================= */

function initializeEnemies() {

    spawnWorldEnemy(
        "Test Enemy",
        1,
        50,
        12,
        2,
        1500,
        900
    );


    spawnWorldEnemy(
        "Test Enemy",
        1,
        50,
        12,
        2,
        1800,
        1100
    );


    spawnWorldEnemy(
        "Test Enemy",
        2,
        75,
        16,
        3,
        2200,
        1400
    );

}


/* =======================================================
   INITIALIZE WORLD ITEMS
   ======================================================= */

function initializeWorldItems() {

    createWorldItem(
        "laser_rifle",
        1500,
        900,
        1
    );

}


/* =======================================================
   INITIALIZE WORLD OBJECTS
   ======================================================= */

function initializeWorldObjects() {

    createWorldObject({
        id: "colony_terminal_01",
        type: "terminal",
        name: "Colony Terminal",
        x: 1150,
        y: 800,
        interactionDistance: 85,
        interactionType: "terminal"
    });

}


/* =======================================================
   INITIALIZE RESOURCE NODES
   ======================================================= */

function initializeResourceNodes() {

    createResourceNode(
        "xenium_ore",
        1250,
        800
    );


    createResourceNode(
        "damaged_supply_crate",
        1350,
        800
    );


    createResourceNode(
        "dense_xenium_deposit",
        1450,
        800
    );

}


/* =======================================================
   WORLD OBJECT INTERACTION
   ======================================================= */

function interactWithWorldObject(
    worldObject
) {

    if (!worldObject) {
        return;
    }


    openWorldObjectUI(
        worldObject
    );


    console.log(
        `${worldObject.name}: Interaction opened.`
    );

}


/* =======================================================
   WORLD OBJECT CLICK
   ======================================================= */

function handleWorldObjectClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    if (dialogueController.isOpen()) {
        return;
    }


    const objectElement =
        event.target.closest(
            ".world-object"
        );


    let clickedObject = null;


    if (objectElement) {

        const worldObjectId =
            objectElement.dataset.worldObjectId;


        if (worldObjectId) {

            clickedObject =
                getWorldObjectById(
                    worldObjectId
                );

        }

    }


    if (!clickedObject) {

        const worldRect =
            world.getBoundingClientRect();


        const clickX =
            event.clientX -
            worldRect.left;


        const clickY =
            event.clientY -
            worldRect.top;


        const worldObjects =
            getWorldObjects();


        for (
            const worldObject
            of worldObjects
        ) {

            const distance =
                Math.sqrt(
                    Math.pow(
                        clickX -
                        worldObject.position.x,
                        2
                    ) +
                    Math.pow(
                        clickY -
                        worldObject.position.y,
                        2
                    )
                );


            if (distance <= 60) {

                clickedObject =
                    worldObject;

                break;

            }

        }

    }


    if (!clickedObject) {
        return;
    }


    event.stopImmediatePropagation();


    showClickMarker(
        clickedObject.position.x,
        clickedObject.position.y
    );


    const distanceToObject =
        getDistanceToWorldObject(
            player,
            clickedObject
        );


    if (
        distanceToObject <=
        clickedObject.interactionDistance
    ) {

        stopMining();

        stopSalvaging();

        clearMovementTarget();

        interactWithWorldObject(
            clickedObject
        );

        return;

    }


    const path =
        findPath(
            player.position.x,
            player.position.y,
            clickedObject.position.x,
            clickedObject.position.y
        );


    if (!path) {

        console.warn(
            `Unable to find a route to ${clickedObject.name}.`
        );

        return;

    }


    stopMining();

    stopSalvaging();

    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "world_object",
        clickedObject.id,
        clickedObject.position.x,
        clickedObject.position.y,
        0,
        path
    );


    console.log(
        `Walking to ${clickedObject.name}.`
    );

}


/* =======================================================
   WORLD OBJECT TARGET
   ======================================================= */

function updateWorldObjectTarget() {

    if (player.isDead) {
        return;
    }


    const target =
        getMovementTarget();


    if (
        !target ||
        target.type !== "world_object"
    ) {
        return;
    }


    const worldObject =
        getWorldObjectById(
            target.id
        );


    if (!worldObject) {

        clearMovementTarget();

        return;

    }


    target.x =
        worldObject.position.x;

    target.y =
        worldObject.position.y;


    const distance =
        getDistanceToWorldObject(
            player,
            worldObject
        );


    if (
        distance <=
        worldObject.interactionDistance
    ) {

        clearMovementTarget();

        interactWithWorldObject(
            worldObject
        );

    }

}


/* =======================================================
   RESOURCE GATHERING
   ======================================================= */

function gatherResourceNode(
    resourceNode
) {

    if (!resourceNode) {
        return false;
    }


    if (player.isDead) {
        return false;
    }


    if (resourceNode.depleted) {
        return false;
    }


    if (
        isMining() ||
        isSalvaging()
    ) {
        return false;
    }


    const distance =
        getDistanceToResourceNode(
            player,
            resourceNode
        );


    if (
        distance >
        resourceNode.gatheringDistance
    ) {

        return false;

    }


    const skillName =
        resourceNode.gatheringSkill;


    const skill =
        player.skills &&
        player.skills[skillName];


    const skillLevel =
        skill &&
        Number.isFinite(
            skill.level
        )
            ? skill.level
            : 1;


    const requiredLevel =
        Number.isFinite(
            resourceNode.requiredLevel
        )
            ? resourceNode.requiredLevel
            : 1;


    /* ===================================================
       GATHERING LEVEL REQUIREMENT
       =================================================== */

    if (
        skillLevel <
        requiredLevel
    ) {

        const message =
            `You need ${skillName} level ${requiredLevel} to gather ${resourceNode.name}.`;


        console.log(
            `${message} Current level: ${skillLevel}.`
        );


        showGameMessage(
            message
        );


        clearMovementTarget();


        return false;

    }


    const duration =
        Number.isFinite(
            resourceNode.gatheringDuration
        ) &&
        resourceNode.gatheringDuration > 0
            ? resourceNode.gatheringDuration
            : 2500;


    /* ===================================================
       MINING
       =================================================== */

    if (
        skillName === "mining"
    ) {

        miningState.active =
            true;

        miningState.resourceNodeId =
            resourceNode.id;

        miningState.startedAt =
            performance.now();

        miningState.duration =
            duration;


        clearMovementTarget();


        console.log(
            `Mining ${resourceNode.name}...`
        );


        return true;

    }


    /* ===================================================
       SALVAGING
       =================================================== */

    if (
        skillName === "salvaging"
    ) {

        salvagingState.active =
            true;

        salvagingState.resourceNodeId =
            resourceNode.id;

        salvagingState.startedAt =
            performance.now();

        salvagingState.duration =
            duration;


        clearMovementTarget();


        console.log(
            `Salvaging ${resourceNode.name}...`
        );


        return true;

    }


    console.warn(
        `Unsupported gathering skill: ${skillName}`
    );


    return false;

}


/* =======================================================
   MINING ACTION UPDATE
   ======================================================= */

function updateMiningAction() {

    if (!miningState.active) {
        return;
    }


    if (player.isDead) {

        stopMining();

        return;

    }


    const resourceNode =
        getResourceNodeById(
            miningState.resourceNodeId
        );


    if (!resourceNode) {

        stopMining();

        return;

    }


    if (resourceNode.depleted) {

        stopMining();

        return;

    }


    const distance =
        getDistanceToResourceNode(
            player,
            resourceNode
        );


    if (
        distance >
        resourceNode.gatheringDistance
    ) {

        stopMining();

        return;

    }


    const elapsed =
        performance.now() -
        miningState.startedAt;


    if (
        elapsed <
        miningState.duration
    ) {

        return;

    }


    const rewardItemId =
        resourceNode.rewardItem ||
        resourceNode.resourceId;


    const itemDefinition =
        getItem(
            rewardItemId
        );


    if (!itemDefinition) {

        console.warn(
            `Unknown mining reward item: ${rewardItemId}`
        );


        stopMining();

        return;

    }


    const quantity =
        Number.isFinite(
            resourceNode.quantity
        ) &&
        resourceNode.quantity > 0
            ? resourceNode.quantity
            : 1;


    const added =
        addItem(
            player.inventory,
            rewardItemId,
            quantity
        );


    if (!added) {

        console.log(
            "Inventory is full. Mining stopped. Resource remains available."
        );


        showGameMessage(
            "Inventory is full."
        );


        stopMining();

        return;

    }


    const xpReward =
        Number.isFinite(
            resourceNode.xpReward
        ) &&
        resourceNode.xpReward > 0
            ? resourceNode.xpReward
            : 0;


    if (
        xpReward > 0 &&
        resourceNode.gatheringSkill
    ) {

        const xpResult =
            awardSkillXP(
                player.skills,
                resourceNode.gatheringSkill,
                xpReward
            );


        refreshCharacterInterface();


        console.log(
            `Mining XP: +${xpReward} ${resourceNode.gatheringSkill} XP.`,
            xpResult
        );

    }


    const depleted =
        depleteResourceNode(
            resourceNode
        );


    if (!depleted) {

        console.warn(
            `Unable to deplete ${resourceNode.name}.`
        );


        stopMining();

        return;

    }


    stopMining();


    console.log(
        `${resourceNode.name} mined successfully.`
    );


    console.log(
        `Received: ${itemDefinition.name} x${quantity}.`
    );


    console.log(
        "Inventory:",
        player.inventory
    );

}


/* =======================================================
   SALVAGING ACTION UPDATE
   ======================================================= */

function updateSalvagingAction() {

    if (!salvagingState.active) {
        return;
    }


    if (player.isDead) {

        stopSalvaging();

        return;

    }


    const resourceNode =
        getResourceNodeById(
            salvagingState.resourceNodeId
        );


    if (!resourceNode) {

        stopSalvaging();

        return;

    }


    if (resourceNode.depleted) {

        stopSalvaging();

        return;

    }


    const distance =
        getDistanceToResourceNode(
            player,
            resourceNode
        );


    if (
        distance >
        resourceNode.gatheringDistance
    ) {

        stopSalvaging();

        return;

    }


    const elapsed =
        performance.now() -
        salvagingState.startedAt;


    if (
        elapsed <
        salvagingState.duration
    ) {

        return;

    }


    const rewardItemId =
        resourceNode.rewardItem ||
        resourceNode.resourceId;


    const itemDefinition =
        getItem(
            rewardItemId
        );


    if (!itemDefinition) {

        console.warn(
            `Unknown salvage reward item: ${rewardItemId}`
        );


        stopSalvaging();

        return;

    }


    const quantity =
        Number.isFinite(
            resourceNode.quantity
        ) &&
        resourceNode.quantity > 0
            ? resourceNode.quantity
            : 1;


    const added =
        addItem(
            player.inventory,
            rewardItemId,
            quantity
        );


    if (!added) {

        console.log(
            "Inventory is full. Salvaging stopped. Resource remains available."
        );


        showGameMessage(
            "Inventory is full."
        );


        stopSalvaging();

        return;

    }


    const xpReward =
        Number.isFinite(
            resourceNode.xpReward
        ) &&
        resourceNode.xpReward > 0
            ? resourceNode.xpReward
            : 0;


    if (
        xpReward > 0 &&
        resourceNode.gatheringSkill
    ) {

        const xpResult =
            awardSkillXP(
                player.skills,
                resourceNode.gatheringSkill,
                xpReward
            );


        refreshCharacterInterface();


        console.log(
            `Salvaging XP: +${xpReward} ${resourceNode.gatheringSkill} XP.`,
            xpResult
        );

    }


    const depleted =
        depleteResourceNode(
            resourceNode
        );


    if (!depleted) {

        console.warn(
            `Unable to deplete ${resourceNode.name}.`
        );


        stopSalvaging();

        return;

    }


    stopSalvaging();


    console.log(
        `${resourceNode.name} salvaged successfully.`
    );


    console.log(
        `Received: ${itemDefinition.name} x${quantity}.`
    );


    console.log(
        "Inventory:",
        player.inventory
    );

}


/* =======================================================
   RESOURCE NODE TARGET
   ======================================================= */

function updateResourceNodeTarget() {

    if (player.isDead) {
        return;
    }


    const target =
        getMovementTarget();


    if (
        !target ||
        target.type !== "resource"
    ) {
        return;
    }


    const resourceNode =
        getResourceNodeById(
            target.id
        );


    if (!resourceNode) {

        clearMovementTarget();

        return;

    }


    target.x =
        resourceNode.position.x;

    target.y =
        resourceNode.position.y;


    if (resourceNode.depleted) {

        clearMovementTarget();

        return;

    }


    const distance =
        getDistanceToResourceNode(
            player,
            resourceNode
        );


    if (
        distance <=
        resourceNode.gatheringDistance
    ) {

        gatherResourceNode(
            resourceNode
        );

    }

}


/* =======================================================
   RESOURCE NODE CLICK
   ======================================================= */

function handleResourceNodeClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    if (dialogueController.isOpen()) {
        return;
    }


    const resourceElement =
        event.target.closest(
            ".resource-node"
        );


    let clickedResourceNode = null;


    if (resourceElement) {

        const resourceNodeId =
            resourceElement.dataset.resourceNodeId;


        if (resourceNodeId) {

            clickedResourceNode =
                getResourceNodeById(
                    resourceNodeId
                );

        }

    }


    if (!clickedResourceNode) {

        const worldRect =
            world.getBoundingClientRect();


        const clickX =
            event.clientX -
            worldRect.left;


        const clickY =
            event.clientY -
            worldRect.top;


        const resourceNodes =
            getResourceNodes();


        for (
            const resourceNode
            of resourceNodes
        ) {

            if (resourceNode.depleted) {
                continue;
            }


            const distance =
                Math.sqrt(
                    Math.pow(
                        clickX -
                        resourceNode.position.x,
                        2
                    ) +
                    Math.pow(
                        clickY -
                        resourceNode.position.y,
                        2
                    )
                );


            if (distance <= 60) {

                clickedResourceNode =
                    resourceNode;

                break;

            }

        }

    }


    if (!clickedResourceNode) {
        return;
    }


    event.stopImmediatePropagation();


    showClickMarker(
        clickedResourceNode.position.x,
        clickedResourceNode.position.y
    );


    const distance =
        getDistanceToResourceNode(
            player,
            clickedResourceNode
        );


    if (
        distance <=
        clickedResourceNode.gatheringDistance
    ) {

        stopMining();

        stopSalvaging();

        clearMovementTarget();


        gatherResourceNode(
            clickedResourceNode
        );


        return;

    }


    const path =
        findPath(
            player.position.x,
            player.position.y,
            clickedResourceNode.position.x,
            clickedResourceNode.position.y
        );


    if (!path) {

        console.warn(
            `Unable to find a route to ${clickedResourceNode.name}.`
        );

        return;

    }


    stopMining();

    stopSalvaging();

    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "resource",
        clickedResourceNode.id,
        clickedResourceNode.position.x,
        clickedResourceNode.position.y,
        0,
        path
    );


    console.log(
        `Walking to ${clickedResourceNode.name}.`
    );

}


/* =======================================================
   HOVER CURSOR
   ======================================================= */

function updateInteractionCursor(
    event
) {

    if (player.isDead) {

        world.style.cursor =
            "default";

        return;

    }


    if (dialogueController.isOpen()) {

        world.style.cursor =
            "default";

        return;

    }


    if (isWorldObjectUIOpen()) {

        world.style.cursor =
            "default";

        return;

    }


    const worldRect =
        world.getBoundingClientRect();


    const mouseX =
        event.clientX -
        worldRect.left;


    const mouseY =
        event.clientY -
        worldRect.top;


    const interactables =
        getInteractables();


    for (
        const interactable
        of interactables
    ) {

        const distance =
            Math.sqrt(
                Math.pow(
                    mouseX -
                    interactable.position.x,
                    2
                ) +
                Math.pow(
                    mouseY -
                    interactable.position.y,
                    2
                )
            );


        if (distance <= 60) {

            world.style.cursor =
                "pointer";

            return;

        }

    }


    const worldObjects =
        getWorldObjects();


    for (
        const worldObject
        of worldObjects
    ) {

        const distance =
            Math.sqrt(
                Math.pow(
                    mouseX -
                    worldObject.position.x,
                    2
                ) +
                Math.pow(
                    mouseY -
                    worldObject.position.y,
                    2
                )
            );


        if (distance <= 60) {

            world.style.cursor =
                "pointer";

            return;

        }

    }


    const resourceNodes =
        getResourceNodes();


    for (
        const resourceNode
        of resourceNodes
    ) {

        if (resourceNode.depleted) {
            continue;
        }


        const distance =
            Math.sqrt(
                Math.pow(
                    mouseX -
                    resourceNode.position.x,
                    2
                ) +
                Math.pow(
                    mouseY -
                    resourceNode.position.y,
                    2
                )
            );


        if (distance <= 60) {

            world.style.cursor =
                "pointer";

            return;

        }

    }


    world.style.cursor =
        "default";

}


/* =======================================================
   ITEM PICKUP
   ======================================================= */

function attemptWorldItemPickup(
    worldItem
) {

    if (!worldItem) {
        return false;
    }


    if (player.isDead) {
        return false;
    }


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                worldItem.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                worldItem.position.y,
                2
            )
        );


    if (distance > 10) {
        return false;
    }


    const itemDefinition =
        getItem(
            worldItem.itemId
        );


    if (!itemDefinition) {

        console.warn(
            "Unknown world item:",
            worldItem.itemId
        );

        clearMovementTarget();

        return false;

    }


    const added =
        addItem(
            player.inventory,
            worldItem.itemId,
            worldItem.quantity
        );


    if (!added) {

        console.log(
            "Inventory is full. Item remains in the world."
        );


        showGameMessage(
            "Inventory is full."
        );


        clearMovementTarget();

        return false;

    }


    refreshCharacterInterface();


    removeWorldItem(
        worldItem
    );


    clearMovementTarget();


    console.log(
        `${itemDefinition.name} picked up.`
    );


    console.log(
        "Inventory:",
        player.inventory
    );


    return true;

}


/* =======================================================
   ITEM TARGET
   ======================================================= */

function updateWorldItemTarget() {

    if (player.isDead) {
        return;
    }


    const target =
        getMovementTarget();


    if (
        !target ||
        target.type !== "item"
    ) {
        return;
    }


    const worldItem =
        findWorldItemById(
            target.id
        );


    if (!worldItem) {

        clearMovementTarget();

        return;

    }


    target.x =
        worldItem.position.x;

    target.y =
        worldItem.position.y;


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                worldItem.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                worldItem.position.y,
                2
            )
        );


    if (distance <= 10) {

        player.position.x =
            worldItem.position.x;

        player.position.y =
            worldItem.position.y;


        attemptWorldItemPickup(
            worldItem
        );

    }

}


/* =======================================================
   ITEM CLICK
   ======================================================= */

function handleWorldItemClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    const itemElement =
        event.target.closest(
            ".world-item"
        );


    if (!itemElement) {
        return;
    }


    const worldItemId =
        itemElement.dataset.worldItemId;


    if (!worldItemId) {
        return;
    }


    const worldItem =
        findWorldItemById(
            worldItemId
        );


    if (!worldItem) {
        return;
    }


    if (dialogueController.isOpen()) {
        return;
    }


    showClickMarker(
        worldItem.position.x,
        worldItem.position.y
    );


    const path =
        findPath(
            player.position.x,
            player.position.y,
            worldItem.position.x,
            worldItem.position.y
        );


    if (!path) {

        console.warn(
            "Unable to find a route to item."
        );

        return;

    }


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                worldItem.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                worldItem.position.y,
                2
            )
        );


    if (distance <= 10) {

        stopMining();

        stopSalvaging();

        attemptWorldItemPickup(
            worldItem
        );

        return;

    }


    stopMining();

    stopSalvaging();

    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "item",
        worldItem.id,
        worldItem.position.x,
        worldItem.position.y,
        0,
        path
    );

}
/* =======================================================
   NPC CLICK
   ======================================================= */

function handleNPCClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    if (dialogueController.isOpen()) {
        return;
    }


    const worldRect =
        world.getBoundingClientRect();


    const clickX =
        event.clientX -
        worldRect.left;


    const clickY =
        event.clientY -
        worldRect.top;


    const interactables =
        getInteractables();


    let clickedInteractable = null;


    for (
        const interactable
        of interactables
    ) {

        const distance =
            Math.sqrt(
                Math.pow(
                    clickX -
                    interactable.position.x,
                    2
                ) +
                Math.pow(
                    clickY -
                    interactable.position.y,
                    2
                )
            );


        if (distance <= 60) {

            clickedInteractable =
                interactable;

            break;

        }

    }


    if (!clickedInteractable) {
        return;
    }


    event.stopImmediatePropagation();


    const npc =
        clickedInteractable;


    showClickMarker(
        npc.position.x,
        npc.position.y
    );


    const distanceToNPC =
        Math.sqrt(
            Math.pow(
                player.position.x -
                npc.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                npc.position.y,
                2
            )
        );


    if (
        distanceToNPC <=
        npc.interactionDistance
    ) {

        stopMining();

        stopSalvaging();

        clearMovementTarget();

        handleInteraction();

        return;

    }


    const path =
        findPath(
            player.position.x,
            player.position.y,
            npc.position.x,
            npc.position.y
        );


    if (!path) {

        console.warn(
            `Unable to find a route to ${npc.name}.`
        );

        return;

    }


    stopMining();

    stopSalvaging();

    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "npc",
        npc.id,
        npc.position.x,
        npc.position.y,
        npc.interactionDistance,
        path
    );


    console.log(
        `Walking to ${npc.name}.`
    );

}


/* =======================================================
   NPC TARGET
   ======================================================= */

function updateNPCTarget() {

    if (player.isDead) {
        return;
    }


    const target =
        getMovementTarget();


    if (
        !target ||
        target.type !== "npc"
    ) {
        return;
    }


    const interactables =
        getInteractables();


    const npc =
        interactables.find(
            interactable =>
                interactable.id ===
                target.id
        );


    if (!npc) {

        clearMovementTarget();

        return;

    }


    target.x =
        npc.position.x;

    target.y =
        npc.position.y;


    const distance =
        Math.sqrt(
            Math.pow(
                player.position.x -
                npc.position.x,
                2
            ) +
            Math.pow(
                player.position.y -
                npc.position.y,
                2
            )
        );


    if (
        distance <=
        npc.interactionDistance
    ) {

        clearMovementTarget();

        handleInteraction();

    }

}


/* =======================================================
   ENEMY CLICK
   ======================================================= */

function handleEnemyClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


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


    if (dialogueController.isOpen()) {
        return;
    }


    if (enemy.position) {

        showClickMarker(
            enemy.position.x,
            enemy.position.y
        );

    }


    stopMining();

    stopSalvaging();

    clearMovementTarget();


    startCombat(
        player,
        enemy
    );

}


/* =======================================================
   GROUND CLICK-TO-MOVE
   ======================================================= */

function handleGroundClick(
    event
) {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    if (dialogueController.isOpen()) {
        return;
    }


    const itemElement =
        event.target.closest(
            ".world-item"
        );


    if (itemElement) {
        return;
    }


    const enemyElement =
        event.target.closest(
            ".enemy"
        );


    if (enemyElement) {
        return;
    }


    const worldObjectElement =
        event.target.closest(
            ".world-object"
        );


    if (worldObjectElement) {
        return;
    }


    const resourceElement =
        event.target.closest(
            ".resource-node"
        );


    if (resourceElement) {
        return;
    }


    const worldRect =
        world.getBoundingClientRect();


    let targetX =
        event.clientX -
        worldRect.left;


    let targetY =
        event.clientY -
        worldRect.top;


    targetX =
        Math.max(
            0,
            Math.min(
                WORLD_WIDTH,
                targetX
            )
        );


    targetY =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT,
                targetY
            )
        );


    showClickMarker(
        targetX,
        targetY
    );


    const path =
        findPath(
            player.position.x,
            player.position.y,
            targetX,
            targetY
        );


    if (!path) {

        console.warn(
            "No valid route to clicked location."
        );

        return;

    }


    stopMining();

    stopSalvaging();

    stopCombat();

    clearMovementTarget();


    setMovementTarget(
        "ground",
        null,
        targetX,
        targetY,
        0,
        path
    );


    console.log(
        `Path found: ${path.length} waypoint(s).`
    );


    console.log(
        `Moving to ${Math.round(targetX)}, ${Math.round(targetY)}`
    );

}


/* =======================================================
   INTERACTION
   ======================================================= */

function updateInteraction() {

    if (isWorldObjectUIOpen()) {

        if (interactionPrompt) {

            interactionPrompt.style.display =
                "none";

        }

        return;

    }


    if (player.isDead) {

        if (interactionPrompt) {

            interactionPrompt.style.display =
                "none";

        }

        return;

    }


    return updateInteractionPrompt(
        player,
        dialogueController.isOpen(),
        interactionPrompt
    );

}


function handleInteraction() {

    if (player.isDead) {
        return;
    }


    if (isWorldObjectUIOpen()) {
        return;
    }


    if (dialogueController.isOpen()) {
        return;
    }


    const interactable =
        getNearbyInteractable(
            player
        );


    if (interactable) {

        dialogueController.openDialogue(
            interactable
        );

        return;

    }


    const worldObject =
        getNearbyWorldObject(
            player
        );


    if (worldObject) {

        interactWithWorldObject(
            worldObject
        );

    }

}


/* =======================================================
   COMBAT
   ======================================================= */

function updateCombatSystem() {

    updateCombat(
        player
    );


    const combatState =
        getCombatState();


    if (!combatState.active) {

        if (player.isDead) {

            showDeathScreen();

        }

        return;

    }

}


/* =======================================================
   GAME UPDATE
   ======================================================= */

function updateGame() {

    if (!player.isDead) {

        updatePlayerMovement();

    } else {

        player.movement.moving =
            false;

    }


    updateWorldItemTarget();


    updateWorldObjectTarget();


    updateResourceNodeTarget();


    updateMiningAction();


    updateSalvagingAction();


    updateNPCTarget();


    updateCombatSystem();


    updateEnemyRespawns();


    updateResourceNodeRespawns();


    drawPlayer();


    renderEnemies();


    renderWorldItems();


    renderWorldObjects(
        world
    );


    renderResourceNodes(
        world
    );


    updatePlayerHUD();


    updateInteraction();


    updateCamera(
        player,
        world
    );


    if (player.isDead) {

        showDeathScreen();

    }

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


    setCharacterInterfaceAvailability(
        true
    );


    drawPlayer();


    updateGame();

}


/* =======================================================
   EVENT LISTENERS
   ======================================================= */

playButton.addEventListener(
    "click",
    startGame
);


world.addEventListener(
    "click",
    handleWorldObjectClick
);


world.addEventListener(
    "click",
    handleResourceNodeClick
);


world.addEventListener(
    "click",
    handleNPCClick
);


world.addEventListener(
    "mousemove",
    updateInteractionCursor
);


world.addEventListener(
    "click",
    handleWorldItemClick
);


world.addEventListener(
    "click",
    handleEnemyClick
);


world.addEventListener(
    "click",
    handleGroundClick
);


window.addEventListener(
    "keydown",
    event => {

        keys[event.key] =
            true;


        if (
            event.key === "Escape"
        ) {

            if (
                isWorldObjectUIOpen()
            ) {

                closeWorldObjectUI();

                return;

            }

        }


        if (
            event.key === "e" ||
            event.key === "E"
        ) {

            event.preventDefault();


            if (
                isWorldObjectUIOpen()
            ) {

                return;

            }


            handleInteraction();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.key] =
            false;

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


/* =======================================================
   INITIAL STATE
   ======================================================= */

dialogueWindow.style.display =
    "none";


gameScreen.style.display =
    "none";


setCharacterInterfaceAvailability(
    false
);


createDeathOverlay();


initializeEnemies();


initializeWorldItems();


initializeWorldObjects();


initializeResourceNodes();


gameLoop();