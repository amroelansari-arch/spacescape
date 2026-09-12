import {
    getWorldActiveEnemies
} from "./enemyWorld.js";


/* =======================================================
   ENEMY RENDERER
   ======================================================= */

const enemyElements = new Map();


/* =======================================================
   GET WORLD ELEMENT
   ======================================================= */

function getWorldElement() {
    return document.getElementById("world");
}


/* =======================================================
   CREATE ENEMY ELEMENT
   ======================================================= */

function createEnemyElement(enemy) {

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
        document.createElement("div");

    element.className = "enemy";

    element.dataset.enemyId =
        enemy.id;

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
        document.createElement("div");

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
        document.createElement("div");

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
       HEALTH BAR CONTAINER
       --------------------------------------------------- */

    const healthContainer =
        document.createElement("div");

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
        document.createElement("div");

    healthFill.className =
        "enemy-health-fill";

    healthFill.style.width =
        "100%";

    healthFill.style.height =
        "100%";

    healthFill.style.background =
        "#38c95b";

    healthFill.style.transition =
        "width 0.1s linear";

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
            enemy.name || "Enemy";
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
       HEALTH BAR
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
                    ) * 100
                )
            );

        healthFill.style.width =
            `${healthPercent}%`;
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
       REMOVE NO-LONGER-ACTIVE ENEMIES
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
}