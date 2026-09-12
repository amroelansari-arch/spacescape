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

const PLAYER_ATTACK_SPEED = 2000;
const ENEMY_ATTACK_SPEED = 2500;
const COMBAT_RANGE = 100;

const combatState = {
    targetEnemyId: null,
    playerNextAttackTime: 0,
    enemyNextAttackTime: 0,
    active: false,
    engaged: false,
    combatEndTime: 0
};

const combatFeedback = [];

let feedbackId = 0;

export function getCombatState() {
    return combatState;
}

export function getCurrentCombatTarget() {
    if (!combatState.targetEnemyId) {
        return null;
    }

    return getWorldEnemyById(
        combatState.targetEnemyId
    );
}

function addCombatFeedback(
    targetType,
    targetId,
    damage,
    x,
    y,
    isMiss = false
) {
    if (
        !targetType ||
        !targetId ||
        !Number.isFinite(damage) ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {
        return;
    }

    combatFeedback.push({
        id: ++feedbackId,
        targetType,
        targetId,
        damage,
        x,
        y,
        isMiss
    });
}

export function consumeCombatFeedback() {
    if (combatFeedback.length === 0) {
        return [];
    }

    const pendingFeedback =
        combatFeedback.splice(
            0,
            combatFeedback.length
        );

    return pendingFeedback;
}

export function startCombat(player, enemy) {
    if (!player || !enemy || !enemy.id) {
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

    combatState.combatEndTime =
        0;

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

export function stopCombat() {
    if (combatState.active) {
        console.log(
            "Combat ended."
        );

        combatState.combatEndTime =
            performance.now();
    }

    combatState.targetEnemyId = null;
    combatState.active = false;
    combatState.engaged = false;
    combatState.playerNextAttackTime = 0;
    combatState.enemyNextAttackTime = 0;
}

function isWithinCombatRange(player, enemy) {
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

    return distance <= COMBAT_RANGE;
}

function movePlayerTowardTarget(player, enemy) {
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

    if (distance <= COMBAT_RANGE) {
        player.movement.moving = false;
        return;
    }

    if (distance === 0) {
        player.movement.moving = false;
        return;
    }

    const speed =
        Number.isFinite(
            player.movement.speed
        )
            ? player.movement.speed
            : 5;

    /*
     * Move directly toward the enemy using
     * the normalized direction vector.
     *
     * This is important for diagonal approaches.
     * The player should close the actual distance
     * to the enemy rather than favoring one axis.
     */

    const normalizedX =
        dx / distance;

    const normalizedY =
        dy / distance;

    const moveDistance =
        Math.min(
            speed,
            distance - COMBAT_RANGE
        );

    const newX =
        player.position.x +
        normalizedX *
        moveDistance;

    const newY =
        player.position.y +
        normalizedY *
        moveDistance;

    let moved = false;

    /*
     * First try the complete diagonal movement.
     */

    if (
        newX >= 0 &&
        newX <= WORLD_WIDTH &&
        newY >= 0 &&
        newY <= WORLD_HEIGHT &&
        !isColliding(
            newX,
            newY
        )
    ) {
        player.position.x = newX;
        player.position.y = newY;

        moved = true;
    }

    /*
     * If the diagonal position is blocked by
     * world collision, allow the player to
     * continue along whichever individual axis
     * remains available.
     *
     * This preserves normal collision behavior
     * without breaking diagonal combat approach.
     */

    if (!moved) {
        if (
            newX >= 0 &&
            newX <= WORLD_WIDTH &&
            !isColliding(
                newX,
                player.position.y
            )
        ) {
            player.position.x = newX;
            moved = true;
        }

        if (
            newY >= 0 &&
            newY <= WORLD_HEIGHT &&
            !isColliding(
                player.position.x,
                newY
            )
        ) {
            player.position.y = newY;
            moved = true;
        }
    }

    player.movement.moving =
        moved;
}

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
        addCombatFeedback(
            "enemy",
            enemy.id,
            result.damage,
            enemy.position.x,
            enemy.position.y,
            false
        );

        console.log(
            `Player hits ${enemy.name} for ${result.damage}. ` +
            `${enemy.health.current}/${enemy.health.maximum} HP remaining.`
        );
    } else {
        addCombatFeedback(
            "enemy",
            enemy.id,
            0,
            enemy.position.x,
            enemy.position.y,
            true
        );

        console.log(
            `Player misses ${enemy.name}.`
        );
    }
}

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
        addCombatFeedback(
            "player",
            "player",
            result.damage,
            player.position.x,
            player.position.y,
            false
        );

        console.log(
            `${enemy.name} hits player for ${result.damage}. ` +
            `${player.health.current}/${player.health.maximum} HP remaining.`
        );
    } else {
        addCombatFeedback(
            "player",
            "player",
            0,
            player.position.x,
            player.position.y,
            true
        );

        console.log(
            `${enemy.name} misses player.`
        );
    }
}

export function updateCombat(player) {
    if (!combatState.active) {
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
        movePlayerTowardTarget(
            player,
            enemy
        );

        return;
    }

    player.movement.moving =
        false;

    if (!combatState.engaged) {
        combatState.engaged = true;

        const now =
            performance.now();

        combatState.playerNextAttackTime =
            now;

        combatState.enemyNextAttackTime =
            now;
    }

    const now =
        performance.now();

    processPlayerAttack(
        player,
        enemy,
        now
    );

    if (!isTargetAlive(enemy)) {
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

    if (!isTargetAlive(player)) {
        console.log(
            "Player defeated."
        );

        stopCombat();
    }
}