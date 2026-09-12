import {
    getWorldActiveEnemies
} from "./enemyWorld.js";

import {
    getCombatState,
    getCombatFeedback
} from "./combatSystem.js";

import {
    player
} from "./player.js";


/* =======================================================
   ENEMY RENDERER
   ======================================================= */

const enemyElements =
    new Map();

const feedbackElements =
    new Map();

let playerHealthBar =
    null;


/* =======================================================
   WORLD ELEMENT
   ======================================================= */

function getWorldElement() {

    return document.getElementById(
        "world"
    );
}


/* =======================================================
   DAMAGE ANIMATION STYLE
   ======================================================= */

function ensureDamageAnimationStyle() {

    if (
        document.getElementById(
            "spacescape-damage-style"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "spacescape-damage-style";

    style.textContent = `
        @keyframes spacescapeDamageFloat {
            0% {
                opacity: 1;
                transform: translate(-50%, 0) scale(1);
            }

            20% {
                opacity: 1;
                transform: translate(-50%, -8px) scale(1.15);
            }

            100% {
                opacity: 0;
                transform: translate(-50%, -42px) scale(1);
            }
        }

        .spacescape-damage-number {
            position: absolute;
            pointer-events: none;
            z-index: 200;
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            text-shadow:
                0 1px 3px #000000,
                1px 0 2px #000000,
                -1px 0 2px #000000;
            white-space: nowrap;
            animation:
                spacescapeDamageFloat
                900ms
                ease-out
                forwards;
        }

        .spacescape-player-health-container {
            position: absolute;
            width: 60px;
            height: 7px;
            transform: translateX(-50%);
            background: #220000;
            border: 1px solid #000000;
            border-radius: 3px;
            overflow: hidden;
            pointer-events: none;
            z-index: 100;
        }

        .spacescape-player-health-fill {
            width: 100%;
            height: 100%;
            background: #38c95b;
        }
    `;

    document.head.appendChild(
        style
    );
}


/* =======================================================
   CREATE ENEMY ELEMENT
   ======================================================= */

function createEnemyElement(
    enemy
) {

    const world =
        getWorldElement();

    if (
        !world ||
        !enemy ||
        !enemy.id
    ) {
        return null;
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "enemy";

    element.dataset.enemyId =
        enemy.id;

    element.style.cursor =
        "pointer";

    element.style.flexDirection =
        "column";

    element.style.lineHeight =
        "1";

    element.style.overflow =
        "visible";


    /* ---------------------------------------------------
       ENEMY NAME
       --------------------------------------------------- */

    const nameElement =
        document.createElement(
            "div"
        );

    nameElement.className =
        "enemy-name";

    nameElement.style.position =
        "absolute";

    nameElement.style.bottom =
        "48px";

    nameElement.style.left =
        "50%";

    nameElement.style.transform =
        "translateX(-50%)";

    nameElement.style.color =
        "#ffffff";

    nameElement.style.fontSize =
        "11px";

    nameElement.style.fontWeight =
        "bold";

    nameElement.style.whiteSpace =
        "nowrap";

    nameElement.style.textShadow =
        "0 1px 3px #000000";

    element.appendChild(
        nameElement
    );


    /* ---------------------------------------------------
       ENEMY LEVEL
       --------------------------------------------------- */

    const levelElement =
        document.createElement(
            "div"
        );

    levelElement.className =
        "enemy-level";

    levelElement.style.position =
        "absolute";

    levelElement.style.top =
        "-18px";

    levelElement.style.left =
        "50%";

    levelElement.style.transform =
        "translateX(-50%)";

    levelElement.style.color =
        "#ffffff";

    levelElement.style.fontSize =
        "10px";

    levelElement.style.fontWeight =
        "bold";

    levelElement.style.whiteSpace =
        "nowrap";

    levelElement.style.textShadow =
        "0 1px 3px #000000";

    element.appendChild(
        levelElement
    );


    /* ---------------------------------------------------
       HEALTH BAR
       --------------------------------------------------- */

    const healthContainer =
        document.createElement(
            "div"
        );

    healthContainer.className =
        "enemy-health-container";

    healthContainer.style.position =
        "absolute";

    healthContainer.style.top =
        "48px";

    healthContainer.style.left =
        "50%";

    healthContainer.style.transform =
        "translateX(-50%)";

    healthContainer.style.width =
        "60px";

    healthContainer.style.height =
        "7px";

    healthContainer.style.background =
        "#220000";

    healthContainer.style.border =
        "1px solid #000000";

    healthContainer.style.borderRadius =
        "3px";

    healthContainer.style.overflow =
        "hidden";


    const healthFill =
        document.createElement(
            "div"
        );

    healthFill.className =
        "enemy-health-fill";

    healthFill.style.width =
        "100%";

    healthFill.style.height =
        "100%";

    healthFill.style.background =
        "#38c95b";

    healthContainer.appendChild(
        healthFill
    );

    element.appendChild(
        healthContainer
    );


    /* ---------------------------------------------------
       ADD TO WORLD
       --------------------------------------------------- */

    world.appendChild(
        element
    );

    enemyElements.set(
        enemy.id,
        element
    );

    return element;
}


/* =======================================================
   UPDATE ENEMY ELEMENT
   ======================================================= */

function updateEnemyElement(
    enemy,
    element
) {

    if (
        !enemy ||
        !element ||
        !enemy.position
    ) {
        return;
    }

    element.style.left =
        `${enemy.position.x}px`;

    element.style.top =
        `${enemy.position.y}px`;


    /* ---------------------------------------------------
       NAME
       --------------------------------------------------- */

    const nameElement =
        element.querySelector(
            ".enemy-name"
        );

    if (nameElement) {

        nameElement.textContent =
            enemy.name ||
            "Enemy";
    }


    /* ---------------------------------------------------
       LEVEL
       --------------------------------------------------- */

    const levelElement =
        element.querySelector(
            ".enemy-level"
        );

    if (levelElement) {

        levelElement.textContent =
            `Lv. ${enemy.level}`;
    }


    /* ---------------------------------------------------
       HEALTH
       --------------------------------------------------- */

    const healthFill =
        element.querySelector(
            ".enemy-health-fill"
        );

    if (
        healthFill &&
        enemy.health &&
        Number.isFinite(
            enemy.health.current
        ) &&
        Number.isFinite(
            enemy.health.maximum
        ) &&
        enemy.health.maximum > 0
    ) {

        const healthPercent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        enemy.health.current /
                        enemy.health.maximum
                    ) *
                    100
                )
            );

        healthFill.style.width =
            `${healthPercent}%`;
    }


    /* ---------------------------------------------------
       SELECTED TARGET
       --------------------------------------------------- */

    const combatState =
        getCombatState();

    const selected =
        combatState.targetEnemyId ===
        enemy.id;

    if (selected) {

        element.style.outline =
            "3px solid #ffff00";

        element.style.outlineOffset =
            "4px";

    } else {

        element.style.outline =
            "none";
    }
}


/* =======================================================
   REMOVE ENEMY ELEMENT
   ======================================================= */

function removeEnemyElement(
    enemyId
) {

    const element =
        enemyElements.get(
            enemyId
        );

    if (!element) {
        return;
    }

    element.remove();

    enemyElements.delete(
        enemyId
    );
}


/* =======================================================
   PLAYER HEALTH BAR
   ======================================================= */

function createPlayerHealthBar() {

    const world =
        getWorldElement();

    if (!world) {
        return null;
    }

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "spacescape-player-health-container";

    const fill =
        document.createElement(
            "div"
        );

    fill.className =
        "spacescape-player-health-fill";

    container.appendChild(
        fill
    );

    world.appendChild(
        container
    );

    return container;
}


function updatePlayerHealthBar() {

    ensureDamageAnimationStyle();

    const combatState =
        getCombatState();

    const now =
        performance.now();

    const visible =
        combatState.active ||
        (
            combatState.combatEndTime > 0 &&
            now -
            combatState.combatEndTime <
            3000
        );

    if (!visible) {

        if (playerHealthBar) {

            playerHealthBar.style.display =
                "none";
        }

        return;
    }

    if (!playerHealthBar) {

        playerHealthBar =
            createPlayerHealthBar();
    }

    if (!playerHealthBar) {
        return;
    }

    playerHealthBar.style.display =
        "block";

    playerHealthBar.style.left =
        `${player.position.x}px`;

    playerHealthBar.style.top =
        `${player.position.y - 34}px`;

    const fill =
        playerHealthBar.querySelector(
            ".spacescape-player-health-fill"
        );

    if (
        fill &&
        player.health &&
        Number.isFinite(
            player.health.current
        ) &&
        Number.isFinite(
            player.health.maximum
        ) &&
        player.health.maximum > 0
    ) {

        const healthPercent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        player.health.current /
                        player.health.maximum
                    ) *
                    100
                )
            );

        fill.style.width =
            `${healthPercent}%`;
    }
}


/* =======================================================
   FLOATING DAMAGE NUMBERS
   ======================================================= */

function createDamageNumber(
    feedback
) {

    const world =
        getWorldElement();

    if (
        !world ||
        !feedback
    ) {
        return;
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "spacescape-damage-number";

    element.textContent =
        `${feedback.damage}`;

    element.style.left =
        `${feedback.x}px`;

    element.style.top =
        `${feedback.y - 24}px`;

    world.appendChild(
        element
    );

    feedbackElements.set(
        feedback.id,
        element
    );

    window.setTimeout(
        () => {

            if (
                feedbackElements.get(
                    feedback.id
                ) === element
            ) {

                element.remove();

                feedbackElements.delete(
                    feedback.id
                );
            }

        },
        950
    );
}


function renderCombatFeedback() {

    ensureDamageAnimationStyle();

    const feedback =
        getCombatFeedback();

    for (
        const event
        of feedback
    ) {

        if (
            feedbackElements.has(
                event.id
            )
        ) {
            continue;
        }

        createDamageNumber(
            event
        );
    }
}


/* =======================================================
   RENDER ENEMIES
   ======================================================= */

export function renderEnemies() {

    const activeEnemies =
        getWorldActiveEnemies();

    const activeIds =
        new Set();

    for (
        const enemy
        of activeEnemies
    ) {

        if (
            !enemy ||
            !enemy.id ||
            !enemy.position
        ) {
            continue;
        }

        activeIds.add(
            enemy.id
        );

        let element =
            enemyElements.get(
                enemy.id
            );

        if (!element) {

            element =
                createEnemyElement(
                    enemy
                );
        }

        updateEnemyElement(
            enemy,
            element
        );
    }


    /* ---------------------------------------------------
       REMOVE DEAD / MISSING ELEMENTS
       --------------------------------------------------- */

    for (
        const enemyId
        of enemyElements.keys()
    ) {

        if (
            !activeIds.has(
                enemyId
            )
        ) {

            removeEnemyElement(
                enemyId
            );
        }
    }


    /* ---------------------------------------------------
       PLAYER COMBAT UI
       --------------------------------------------------- */

    updatePlayerHealthBar();

    renderCombatFeedback();
}


/* =======================================================
   CLEAR ENEMY RENDERING
   ======================================================= */

export function clearEnemyRendering() {

    for (
        const enemyId
        of enemyElements.keys()
    ) {

        removeEnemyElement(
            enemyId
        );
    }

    if (playerHealthBar) {

        playerHealthBar.remove();

        playerHealthBar =
            null;
    }

    for (
        const element
        of feedbackElements.values()
    ) {

        element.remove();
    }

    feedbackElements.clear();
}