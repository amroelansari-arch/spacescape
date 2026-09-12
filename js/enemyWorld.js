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
    enemies: [],

    spawnPoints: [],

    respawnDelay: 10000
};


/* =======================================================
   GET ENEMY COLLECTION
   ======================================================= */

export function getEnemyCollection() {

    return enemyWorld.enemies;

}


/* =======================================================
   SPAWN WORLD ENEMY
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


    /* ===================================================
       REGISTER SPAWN POINT
       =================================================== */

    enemyWorld.spawnPoints.push({

        name,

        level,

        maximumHealth,

        attack,

        defense,

        x,

        y,

        enemyId: enemy.id,

        respawnAt: 0

    });


    return enemy;

}


/* =======================================================
   GET WORLD ENEMY BY ID
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
   GET ACTIVE WORLD ENEMIES
   ======================================================= */

export function getWorldActiveEnemies() {

    return getActiveEnemies(
        enemyWorld.enemies
    );

}


/* =======================================================
   REMOVE WORLD ENEMY
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
   UPDATE ENEMY RESPAWNS
   ======================================================= */

export function updateEnemyRespawns() {

    const now =
        performance.now();


    for (
        const spawnPoint
        of enemyWorld.spawnPoints
    ) {

        /* =================================================
           CURRENT ENEMY
           ================================================= */

        const currentEnemy =
            findEnemyById(
                enemyWorld.enemies,
                spawnPoint.enemyId
            );


        /* =================================================
           ENEMY STILL ALIVE
           ================================================= */

        if (
            currentEnemy &&
            currentEnemy.health &&
            currentEnemy.health.current > 0
        ) {

            spawnPoint.respawnAt = 0;

            continue;

        }


        /* =================================================
           ENEMY HAS DIED
           ================================================= */

        if (
            currentEnemy &&
            currentEnemy.health &&
            currentEnemy.health.current <= 0
        ) {

            removeEnemy(
                enemyWorld.enemies,
                currentEnemy
            );

            spawnPoint.enemyId = null;

            spawnPoint.respawnAt =
                now +
                enemyWorld.respawnDelay;

        }


        /* =================================================
           WAITING FOR RESPAWN
           ================================================= */

        if (
            spawnPoint.respawnAt > 0 &&
            now <
            spawnPoint.respawnAt
        ) {

            continue;

        }


        /* =================================================
           SPAWN NEW ENEMY
           ================================================= */

        if (
            spawnPoint.respawnAt > 0 &&
            now >=
            spawnPoint.respawnAt
        ) {

            const enemy =
                spawnEnemy(
                    createEnemy,
                    spawnPoint.name,
                    spawnPoint.level,
                    spawnPoint.maximumHealth,
                    spawnPoint.attack,
                    spawnPoint.defense,
                    spawnPoint.x,
                    spawnPoint.y
                );


            if (!enemy) {
                continue;
            }


            if (
                !addEnemy(
                    enemyWorld.enemies,
                    enemy
                )
            ) {
                continue;
            }


            spawnPoint.enemyId =
                enemy.id;

            spawnPoint.respawnAt =
                0;


            console.log(
                `${enemy.name} respawned.`
            );

        }

    }

}


/* =======================================================
   CLEANUP DEAD WORLD ENEMIES
   ======================================================= */

export function cleanupDeadWorldEnemies() {

    return removeDeadEnemies(
        enemyWorld.enemies
    );

}


/* =======================================================
   ENEMY COUNT
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

    enemyWorld.spawnPoints.length = 0;

}