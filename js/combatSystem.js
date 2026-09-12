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

/* =======================================================
   COMBAT APPROACH MOVEMENT
   ======================================================= */

function isValidMovementPosition(
    x,
    y
) {
    if (
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {
        return false;
    }

    if (
        x < 0 ||
        x > WORLD_WIDTH ||
        y < 0 ||
        y > WORLD_HEIGHT
    ) {
        return false;
    }

    return !isColliding(
        x,
        y
    );
}

function getMovementCandidates(
    dx,
    dy,
    speed
) {
    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (distance === 0) {
        return [];
    }

    const angle =
        Math.atan2(
            dy,
            dx
        );

    /*
     * Try the direct route first.
     *
     * If that route is blocked by a building,
     * the remaining directions allow the player
     * to naturally steer around the obstacle.
     */

    const angleOffsets = [
        0,
        Math.PI / 6,
        -Math.PI / 6,
        Math.PI / 3,
        -Math.PI / 3,
        Math.PI / 2,
        -Math.PI / 2,
        (2 * Math.PI) / 3,
        -(2 * Math.PI) / 3,
        Math.PI
    ];

    return angleOffsets.map(
        offset => {
            const candidateAngle =
                angle + offset;

            return {
                x:
                    Math.cos(
                        candidateAngle
                    ) * speed,

                y:
                    Math.sin(
                        candidateAngle
                    ) * speed,

                angleDifference:
                    Math.abs(offset)
            };
        }
    );
}

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

    if (distance === 0) {
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

    /*
     * Never move closer than the combat range.
     */

    const moveDistance =
        Math.min(
            speed,
            distance - COMBAT_RANGE
        );

    const candidates =
        getMovementCandidates(
            dx,
            dy,
            moveDistance
        );

    let bestCandidate = null;
    let bestScore = Infinity;

    for (
        const candidate
        of candidates
    ) {
        const newX =
            player.position.x +
            candidate.x;

        const newY =
            player.position.y +
            candidate.y;

        if (
            !isValidMovementPosition(
                newX,
                newY
            )
        ) {
            continue;
        }

        const newDistance =
            getDistance(
                newX,
                newY,
                enemy.position.x,
                enemy.position.y
            );

        /*
         * Lower score is better.
         *
         * Distance is the primary factor.
         * The small angle penalty makes the player
         * prefer continuing toward the enemy when
         * several routes are available.
         */

        const score =
            newDistance +
            candidate.angleDifference *
            8;

        if (
            newDistance <=
            COMBAT_RANGE
        ) {
            bestCandidate = {
                x: newX,
                y: newY
            };

            bestScore = score;

            break;
        }

        if (
            score < bestScore
        ) {
            bestScore = score;

            bestCandidate = {
                x: newX,
                y: newY
            };
        }
    }

    /*
     * If a valid movement was found, use it.
     */

    if (bestCandidate) {
        player.position.x =
            bestCandidate.x;

        player.position.y =
            bestCandidate.y;

        player.movement.moving =
            true;

        return;
    }

    /*
     * Emergency fallback:
     *
     * If every candidate is blocked, try each
     * axis independently. This prevents the
     * player from becoming permanently stuck
     * against an obstacle corner.
     */

    const normalizedX =
        dx / distance;

    const normalizedY =
        dy / distance;

    const xMove =
        normalizedX *
        moveDistance;

    const yMove =
        normalizedY *
        moveDistance;

    let moved = false;

    const xOnlyX =
        player.position.x +
        xMove;

    if (
        isValidMovementPosition(
            xOnlyX,
            player.position.y
        )
    ) {
        player.position.x =
            xOnlyX;

        moved = true;
    }

    const yOnlyY =
        player.position.y +
        yMove;

    if (
        isValidMovementPosition(
            player.position.x,
            yOnlyY
        )
    ) {
        player.position.y =
            yOnlyY;

        moved = true;
    }

    player.movement.moving =
        moved;
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

/* =======================================================
   COMBAT UPDATE
   ======================================================= */

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

    /*
     * Keep approaching until the actual distance
     * between the player and enemy is within the
     * combat range.
     */

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