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

    element.textContent =
        enemy.name;

    world.appendChild(element);

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
}


/* =======================================================
   REMOVE ENEMY ELEMENT
   ======================================================= */

function removeEnemyElement(
    enemyId
) {
    const element =
        enemyElements.get(enemyId);

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

    for (const enemy of activeEnemies) {

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