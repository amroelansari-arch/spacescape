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

import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    isColliding
} from "./world.js";


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

    active: false,

    engaged: false
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
   START COMBAT / SELECT TARGET
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

    combatState.engaged =
        false;

    const now =
        performance.now();

    combatState.playerNextAttackTime =
        now;

    combatState.enemyNextAttackTime =
        now;

    console.log(
        `Target selected: ${enemy.name}`
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

    combatState.engaged =
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
   APPROACH TARGET
   ======================================================= */

function movePlayerTowardTarget(
    player,
    enemy
) {
    if (
        !player ||
        !enemy ||
        !player.position ||
        !enemy.position
    ) {
        return;
    }

    const dx =
        enemy.position.x -
        player.position.x;

    const dy =
        enemy.position.y -
        player.position.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (
        distance <= COMBAT_RANGE
    ) {
        player.movement.moving =
            false;

        return;
    }

    if (
        distance === 0
    ) {
        player.movement.moving =
            false;

        return;
    }

    const speed =
        Number.isFinite(
            player.movement.speed
        )
            ? player.movement.speed
            : 5;

    const moveDistance =
        Math.min(
            speed,
            distance - COMBAT_RANGE
        );

    const normalizedX =
        dx / distance;

    const normalizedY =
        dy / distance;

    const newX =
        player.position.x +
        normalizedX *
        moveDistance;

    const newY =
        player.position.y +
        normalizedY *
        moveDistance;

    player.movement.moving =
        true;

    if (
        newX >= 0 &&
        newX <= WORLD_WIDTH &&
        !isColliding(
            newX,
            player.position.y
        )
    ) {
        player.position.x =
            newX;
    }

    if (
        newY >= 0 &&
        newY <= WORLD_HEIGHT &&
        !isColliding(
            player.position.x,
            newY
        )
    ) {
        player.position.y =
            newY;
    }
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


    /* ---------------------------------------------------
       APPROACH TARGET
       --------------------------------------------------- */

    if (
        !isWithinCombatRange(
            player,
            enemy
        )
    ) {

        movePlayerTowardTarget(
            player,
            enemy
        );

        return;
    }


    /* ---------------------------------------------------
       ENTER COMBAT RANGE
       --------------------------------------------------- */

    player.movement.moving =
        false;

    if (
        !combatState.engaged
    ) {

        combatState.engaged =
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
    }


    /* ---------------------------------------------------
       PROCESS ATTACKS
       --------------------------------------------------- */

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