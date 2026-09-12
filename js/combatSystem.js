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

import {
    awardXP
} from "./xp.js";

import {
    applyLevelUp
} from "./player.js";


/* =======================================================
   COMBAT CONSTANTS
   ======================================================= */

const PLAYER_ATTACK_SPEED = 2000;

const ENEMY_ATTACK_SPEED = 2500;

const COMBAT_RANGE = 100;

/*
 * Small tolerance used when determining whether
 * the player is close enough to begin combat.
 *
 * This prevents the player from getting stuck
 * a few pixels outside the exact combat range
 * after obstacle-aware movement.
 */
const COMBAT_ENGAGEMENT_BUFFER = 5;

const COMBAT_ENGAGEMENT_RANGE =
    COMBAT_RANGE +
    COMBAT_ENGAGEMENT_BUFFER;


/* =======================================================
   COMBAT STATE
   ======================================================= */

const combatState = {
    targetEnemyId: null,

    playerNextAttackTime: 0,

    enemyNextAttackTime: 0,

    active: false,

    engaged: false,

    combatEndTime: 0
};


/* =======================================================
   COMBAT FEEDBACK
   ======================================================= */

const combatFeedback = [];

let feedbackId = 0;


/* =======================================================
   GET COMBAT STATE
   ======================================================= */

export function getCombatState() {

    return combatState;

}


/* =======================================================
   GET CURRENT COMBAT TARGET
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
   ADD COMBAT FEEDBACK
   ======================================================= */

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


/* =======================================================
   CONSUME COMBAT FEEDBACK
   ======================================================= */

export function consumeCombatFeedback() {

    if (
        combatFeedback.length === 0
    ) {
        return [];
    }

    const pendingFeedback =
        combatFeedback.splice(
            0,
            combatFeedback.length
        );

    return pendingFeedback;

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

        combatState.combatEndTime =
            performance.now();

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
   COMBAT RANGE
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
        COMBAT_ENGAGEMENT_RANGE
    );

}


/* =======================================================
   MOVEMENT VALIDATION
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


/* =======================================================
   MOVEMENT CANDIDATES
   ======================================================= */

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

    if (
        distance === 0
    ) {
        return [];
    }

    const angle =
        Math.atan2(
            dy,
            dx
        );

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
                angle +
                offset;

            return {

                x:
                    Math.cos(
                        candidateAngle
                    ) *
                    speed,

                y:
                    Math.sin(
                        candidateAngle
                    ) *
                    speed,

                angleDifference:
                    Math.abs(
                        offset
                    )

            };

        }
    );

}


/* =======================================================
   MOVE TOWARD TARGET
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


    /* ===================================================
       ALREADY CLOSE ENOUGH
       =================================================== */

    if (
        distance <=
        COMBAT_ENGAGEMENT_RANGE
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


    /*
     * Continue using the original 100-unit
     * combat range for movement calculation.
     *
     * The extra 5 units are only an engagement
     * tolerance, not a reason to stop movement
     * prematurely.
     */
    const moveDistance =
        Math.min(
            speed,
            distance -
            COMBAT_RANGE
        );


    const candidates =
        getMovementCandidates(
            dx,
            dy,
            moveDistance
        );


    let bestCandidate =
        null;

    let bestScore =
        Infinity;


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


        const score =
            newDistance +
            candidate.angleDifference *
            8;


        /*
         * If this movement puts the player
         * inside the engagement range, use it
         * immediately.
         */
        if (
            newDistance <=
            COMBAT_ENGAGEMENT_RANGE
        ) {

            bestCandidate = {

                x: newX,

                y: newY

            };

            bestScore =
                score;

            break;

        }


        if (
            score <
            bestScore
        ) {

            bestScore =
                score;

            bestCandidate = {

                x: newX,

                y: newY

            };

        }

    }


    if (
        bestCandidate
    ) {

        player.position.x =
            bestCandidate.x;

        player.position.y =
            bestCandidate.y;

        player.movement.moving =
            true;

        return;

    }


    /* ===================================================
       AXIS FALLBACK
       =================================================== */

    const normalizedX =
        dx /
        distance;

    const normalizedY =
        dy /
        distance;


    const xMove =
        normalizedX *
        moveDistance;

    const yMove =
        normalizedY *
        moveDistance;


    let moved =
        false;


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

        moved =
            true;

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

        moved =
            true;

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


    if (
        !result.success
    ) {
        return;
    }


    if (
        result.hit
    ) {

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


    if (
        !result.success
    ) {
        return;
    }


    if (
        result.hit
    ) {

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


    /* ===================================================
       APPROACH TARGET
       =================================================== */

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


    /* ===================================================
       ENGAGED
       =================================================== */

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

    }


    const now =
        performance.now();


    /* ===================================================
       PLAYER ATTACK
       =================================================== */

    processPlayerAttack(
        player,
        enemy,
        now
    );


    /* ===================================================
       ENEMY DEFEATED
       =================================================== */

    if (
        !isTargetAlive(enemy)
    ) {

        const xpReward =
            Number.isFinite(
                enemy.xpReward
            )
                ? enemy.xpReward
                : 0;


        if (
            xpReward > 0
        ) {

            const previousLevel =
                player.level;


            const xpResult =
                awardXP(
                    player,
                    xpReward
                );


            console.log(
                `${enemy.name} defeated. ` +
                `+${xpResult.awarded} XP.`
            );


            if (
                xpResult.levelsGained >
                0
            ) {

                for (
                    let i = 0;
                    i <
                    xpResult.levelsGained;
                    i++
                ) {

                    applyLevelUp();

                }


                console.log(
                    `Player reached level ${player.level}.`
                );


                console.log(
                    `Previous level: ${previousLevel}`
                );

            }

        } else {

            console.log(
                `${enemy.name} defeated.`
            );

        }


        stopCombat();

        return;

    }


    /* ===================================================
       ENEMY ATTACK
       =================================================== */

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