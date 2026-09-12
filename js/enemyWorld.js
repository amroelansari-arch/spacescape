import {
    createEnemyCollection,
    addEnemy,
    removeEnemy,
    findEnemyById,
    getActiveEnemies,
    removeDeadEnemies,
    getEnemyCount
} from "./enemies.js";

import {
    createEnemy
} from "./enemy.js";

import {
    spawnEnemy
} from "./enemySpawner.js";


/* =======================================================
   ENEMY WORLD
   ======================================================= */

const enemyWorld = {
    enemies: createEnemyCollection()
};


/* =======================================================
   GET ENEMY COLLECTION
   ======================================================= */

export function getEnemyCollection() {
    return enemyWorld.enemies;
}


/* =======================================================
   SPAWN ENEMY
   ======================================================= */

export function spawnWorldEnemy(
    name,
    level,
    maximumHealth,
    attack,
    defense,
    x,
    y
) {
    const enemy =
        spawnEnemy(
            createEnemy,
            name,
            level,
            maximumHealth,
            attack,
            defense,
            x,
            y
        );

    if (!enemy) {
        return null;
    }

    if (
        !addEnemy(
            enemyWorld.enemies,
            enemy
        )
    ) {
        return null;
    }

    return enemy;
}


/* =======================================================
   FIND ENEMY
   ======================================================= */

export function getWorldEnemyById(
    enemyId
) {
    return findEnemyById(
        enemyWorld.enemies,
        enemyId
    );
}


/* =======================================================
   GET ACTIVE ENEMIES
   ======================================================= */

export function getWorldActiveEnemies() {
    return getActiveEnemies(
        enemyWorld.enemies
    );
}


/* =======================================================
   REMOVE ENEMY
   ======================================================= */

export function removeWorldEnemy(
    enemy
) {
    return removeEnemy(
        enemyWorld.enemies,
        enemy
    );
}


/* =======================================================
   CLEAN DEAD ENEMIES
   ======================================================= */

export function cleanupDeadWorldEnemies() {
    return removeDeadEnemies(
        enemyWorld.enemies
    );
}


/* =======================================================
   GET ENEMY COUNT
   ======================================================= */

export function getWorldEnemyCount() {
    return getEnemyCount(
        enemyWorld.enemies
    );
}


/* =======================================================
   CLEAR WORLD ENEMIES
   ======================================================= */

export function clearWorldEnemies() {
    enemyWorld.enemies.length = 0;
}