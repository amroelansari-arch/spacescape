import {
    performAttack,
    isTargetAlive
} from "./combat.js";

import {
    getDistance
} from "./enemies.js";

import {
    getWorldEnemyById
} from "./enemyWorld.js";


/* =======================================================
   COMBAT SETTINGS
   ======================================================= */

const PLAYER_ATTACK_SPEED = 2000;

const ENEMY_ATTACK_SPEED = 2500;

const COMBAT_RANGE = 100;


/* =======================================================
   COMBAT STATE
   ======================================================= */

const combatState = {
    targetEnemyId: null,

    playerNextAttackTime: 0,

    enemyNextAttackTime: 0,

    active: false
};


/* =======================================================
   GET COMBAT STATE
   ======================================================= */

export function getCombatState() {
    return combatState;
}


/* =======================================================
   GET CURRENT TARGET
   ======================================================= */

export function getCurrentCombatTarget() {

    if (
        !combatState.targetEnemyId
    ) {
        return null;
    }

    return getWorldEnemyById(
        combatState.targetEnemyId
    );
}


/* =======================================================
   START COMBAT
   ======================================================= */

export function startCombat(
    player,
    enemy
) {
    if (
        !player ||
        !enemy ||
        !enemy.id
    ) {
        return false;
    }

    if (
        !isTargetAlive(player) ||
        !isTargetAlive(enemy)
    ) {
        return false;
    }

    combatState.targetEnemyId =
        enemy.id;

    combatState.active =
        true;

    const now =
        performance.now();

    combatState.playerNextAttackTime =
        now;

    combatState.enemyNextAttackTime =
        now;

    console.log(
        `Combat started: ${enemy.name}`
    );

    return true;
}


/* =======================================================
   STOP COMBAT
   ======================================================= */

export function stopCombat() {

    if (
        combatState.active
    ) {
        console.log(
            "Combat ended."
        );
    }

    combatState.targetEnemyId =
        null;

    combatState.active =
        false;

    combatState.playerNextAttackTime =
        0;

    combatState.enemyNextAttackTime =
        0;
}


/* =======================================================
   CHECK COMBAT RANGE
   ======================================================= */

function isWithinCombatRange(
    player,
    enemy
) {
    if (
        !player ||
        !enemy ||
        !player.position ||
        !enemy.position
    ) {
        return false;
    }

    const distance =
        getDistance(
            player.position.x,
            player.position.y,
            enemy.position.x,
            enemy.position.y
        );

    return (
        distance <=
        COMBAT_RANGE
    );
}


/* =======================================================
   PLAYER ATTACK
   ======================================================= */

function processPlayerAttack(
    player,
    enemy,
    now
) {
    if (
        now <
        combatState.playerNextAttackTime
    ) {
        return;
    }

    const result =
        performAttack(
            player,
            enemy,
            player.attack
        );

    combatState.playerNextAttackTime =
        now +
        PLAYER_ATTACK_SPEED;

    if (!result.success) {
        return;
    }

    if (result.hit) {

        console.log(
            `Player hits ${enemy.name} for ${result.damage}. ` +
            `${enemy.health.current}/${enemy.health.maximum} HP remaining.`
        );

    } else {

        console.log(
            `Player misses ${enemy.name}.`
        );
    }
}


/* =======================================================
   ENEMY ATTACK
   ======================================================= */

function processEnemyAttack(
    player,
    enemy,
    now
) {
    if (
        now <
        combatState.enemyNextAttackTime
    ) {
        return;
    }

    const result =
        performAttack(
            enemy,
            player,
            enemy.attack
        );

    combatState.enemyNextAttackTime =
        now +
        ENEMY_ATTACK_SPEED;

    if (!result.success) {
        return;
    }

    if (result.hit) {

        console.log(
            `${enemy.name} hits player for ${result.damage}. ` +
            `${player.health.current}/${player.health.maximum} HP remaining.`
        );

    } else {

        console.log(
            `${enemy.name} misses player.`
        );
    }
}


/* =======================================================
   UPDATE COMBAT
   ======================================================= */

export function updateCombat(
    player
) {
    if (
        !combatState.active
    ) {
        return;
    }

    const enemy =
        getCurrentCombatTarget();

    if (!enemy) {
        stopCombat();
        return;
    }

    if (
        !isTargetAlive(player) ||
        !isTargetAlive(enemy)
    ) {
        stopCombat();
        return;
    }

    if (
        !isWithinCombatRange(
            player,
            enemy
        )
    ) {
        console.log(
            "Target moved out of combat range."
        );

        stopCombat();

        return;
    }

    const now =
        performance.now();

    processPlayerAttack(
        player,
        enemy,
        now
    );

    if (
        !isTargetAlive(enemy)
    ) {

        console.log(
            `${enemy.name} defeated.`
        );

        stopCombat();

        return;
    }

    processEnemyAttack(
        player,
        enemy,
        now
    );

    if (
        !isTargetAlive(player)
    ) {

        console.log(
            "Player defeated."
        );

        stopCombat();
    }
}