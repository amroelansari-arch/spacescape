import {
    performAttack,
    isTargetAlive,
    COMBAT_STYLES,
    COMBAT_STYLE_MODIFIERS
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
    awardSkillXP,
    getSkillLevel
} from "./skills.js";

import {
    getCombatStyle,
    handlePlayerDeath
} from "./player.js";

import {
    getEffectivePlayerCombatStats
} from "./equipmentStats.js";

import {
    getItem
} from "./items.js";

import {
    consumeAmmunition
} from "./equipment.js";


const PLAYER_ATTACK_SPEED = 2000;

const ENEMY_ATTACK_SPEED = 2500;

const COMBAT_RANGE = 100;

const COMBAT_ENGAGEMENT_BUFFER = 5;

const COMBAT_ENGAGEMENT_RANGE =
    COMBAT_RANGE +
    COMBAT_ENGAGEMENT_BUFFER;

const COMBAT_DISENGAGEMENT_RANGE = 250;


/* =======================================================
   COMBAT XP
   ======================================================= */

const COMBAT_XP_PER_DAMAGE = 4;

const SECONDARY_COMBAT_XP_PERCENT = 0.25;


/* =======================================================
   VITALITY
   ======================================================= */

/*
 * Vitality 1 = 100 HP.
 *
 * Every Vitality level above 1 grants
 * 5 additional maximum HP.
 */

const BASE_PLAYER_HEALTH = 100;

const HEALTH_PER_VITALITY_LEVEL = 5;


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
   COMBAT STATE ACCESS
   ======================================================= */

export function getCombatState() {

    return combatState;

}


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
   COMBAT FEEDBACK
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

        id:
            ++feedbackId,

        targetType,

        targetId,

        damage,

        x,

        y,

        isMiss

    });

}


export function consumeCombatFeedback() {

    if (
        combatFeedback.length === 0
    ) {

        return [];

    }


    return combatFeedback.splice(
        0,
        combatFeedback.length
    );

}


/* =======================================================
   PLAYER SKILLS
   ======================================================= */

function getPlayerAttackLevel(
    player
) {

    return getSkillLevel(
        player.skills,
        "attack"
    );

}


function getPlayerStrengthLevel(
    player
) {

    return getSkillLevel(
        player.skills,
        "strength"
    );

}


function getPlayerDefenseLevel(
    player
) {

    return getSkillLevel(
        player.skills,
        "defense"
    );

}


function getPlayerVitalityLevel(
    player
) {

    return getSkillLevel(
        player.skills,
        "vitality"
    );

}


function getPlayerBallisticsLevel(
    player
) {

    return getSkillLevel(
        player.skills,
        "ballistics"
    );

}


function getPlayerFluxLevel(
    player
) {

    return getSkillLevel(
        player.skills,
        "flux"
    );

}


/* =======================================================
   EQUIPPED WEAPON
   ======================================================= */

/*
 * Returns the actual item definition for the
 * currently equipped weapon.
 */

function getEquippedWeapon(
    player
) {

    if (
        !player ||
        !player.equipment
    ) {

        return null;

    }


    const equippedWeapon =
        player.equipment.weapon;


    if (
        !equippedWeapon ||
        !equippedWeapon.id
    ) {

        return null;

    }


    return getItem(
        equippedWeapon.id
    );

}


/* =======================================================
   COMBAT DISCIPLINE
   ======================================================= */

/*
 * Combat disciplines:
 *
 * null
 *     = Melee
 *
 * ballistics
 *     = Ballistics
 *
 * flux
 *     = Flux
 */

function getPlayerCombatDiscipline(
    player
) {

    const weapon =
        getEquippedWeapon(
            player
        );


    if (!weapon) {

        return null;

    }


    if (
        weapon.combatDiscipline ===
        "ballistics"
    ) {

        return "ballistics";

    }


    if (
        weapon.combatDiscipline ===
        "flux"
    ) {

        return "flux";

    }


    return null;

}


/* =======================================================
   AMMUNITION / RESOURCE VALIDATION
   ======================================================= */

/*
 * Ballistics weapons declare an ammunitionType.
 *
 * Example:
 *
 * Laser Rifle
 *     ammunitionType: "laser_charge"
 */

function hasRequiredAmmunition(
    player,
    weapon
) {

    if (
        !weapon ||
        weapon.combatDiscipline !==
        "ballistics"
    ) {

        return true;

    }


    if (
        !weapon.ammunitionType
    ) {

        return true;

    }


    if (
        !player ||
        !player.equipment ||
        !player.equipment.ammunition
    ) {

        return false;

    }


    const equippedAmmunition =
        player.equipment.ammunition;


    if (
        !equippedAmmunition.id ||
        equippedAmmunition.id !==
        weapon.ammunitionType
    ) {

        return false;

    }


    if (
        !Number.isFinite(
            equippedAmmunition.quantity
        ) ||
        equippedAmmunition.quantity <= 0
    ) {

        return false;

    }


    return true;

}


/*
 * Flux weapons consume Flux Crystals directly
 * from the player's inventory.
 */

function getInventoryItemQuantity(
    player,
    itemId
) {

    if (
        !player ||
        !player.inventory ||
        !Array.isArray(
            player.inventory.items
        )
    ) {

        return 0;

    }


    const inventoryItem =
        player.inventory.items.find(
            item =>
                item &&
                item.id ===
                itemId
        );


    if (
        !inventoryItem ||
        !Number.isFinite(
            inventoryItem.quantity
        )
    ) {

        return 0;

    }


    return Math.max(
        0,
        inventoryItem.quantity
    );

}


function consumeFluxCrystal(
    player
) {

    const quantity =
        getInventoryItemQuantity(
            player,
            "flux_crystal"
        );


    if (
        quantity <= 0
    ) {

        return false;

    }


    const inventoryItem =
        player.inventory.items.find(
            item =>
                item &&
                item.id ===
                "flux_crystal"
        );


    if (!inventoryItem) {

        return false;

    }


    inventoryItem.quantity--;


    if (
        inventoryItem.quantity <= 0
    ) {

        player.inventory.items =
            player.inventory.items.filter(
                item =>
                    item.id !==
                    "flux_crystal"
            );

    }


    return true;

}


/* =======================================================
   CONSUME COMBAT RESOURCE
   ======================================================= */

function consumeCombatResource(
    player,
    weapon
) {

    if (!weapon) {

        return {

            success: true,
            resource: null

        };

    }


    /*
     * Ballistics
     */

    if (
        weapon.combatDiscipline ===
        "ballistics"
    ) {

        if (
            !hasRequiredAmmunition(
                player,
                weapon
            )
        ) {

            console.log(
                `Cannot fire ${weapon.name}: ` +
                `required ammunition is not equipped.`
            );


            return {

                success: false,
                resource: "ammunition"

            };

        }


        const result =
            consumeAmmunition(
                player.equipment,
                1
            );


        if (
            !result.success
        ) {

            console.log(
                `Cannot fire ${weapon.name}: ` +
                `out of ammunition.`
            );


            return {

                success: false,
                resource: "ammunition"

            };

        }


        console.log(
            `${weapon.name} fired. ` +
            `Ammunition remaining: ` +
            `${result.remaining}`
        );


        return {

            success: true,
            resource: "ammunition",

            consumed:
                result.consumed,

            remaining:
                result.remaining

        };

    }


    /*
     * Flux
     */

    if (
        weapon.combatDiscipline ===
        "flux"
    ) {

        if (
            !consumeFluxCrystal(
                player
            )
        ) {

            console.log(
                `Cannot use ${weapon.name}: ` +
                `no Flux Crystals available.`
            );


            return {

                success: false,
                resource: "flux_crystal"

            };

        }


        console.log(
            `${weapon.name} consumed 1 Flux Crystal. ` +
            `Flux Crystals remaining: ` +
            `${getInventoryItemQuantity(
                player,
                "flux_crystal"
            )}`
        );


        return {

            success: true,
            resource: "flux_crystal",

            consumed: 1,

            remaining:
                getInventoryItemQuantity(
                    player,
                    "flux_crystal"
                )

        };

    }


    /*
     * Melee requires no consumable resource.
     */

    return {

        success: true,
        resource: null

    };

}


/* =======================================================
   VITALITY HEALTH
   ======================================================= */

function calculatePlayerMaximumHealth(
    player
) {

    const vitalityLevel =
        getPlayerVitalityLevel(
            player
        );


    return (
        BASE_PLAYER_HEALTH +
        (
            Math.max(
                1,
                vitalityLevel
            ) -
            1
        ) *
        HEALTH_PER_VITALITY_LEVEL
    );

}


/*
 * Synchronize maximum HP with Vitality.
 *
 * If Vitality levels up while the player is alive,
 * the new maximum HP is added to current HP as well.
 */

function syncPlayerVitalityHealth(
    player,
    previousMaximumHealth = null
) {

    if (
        !player ||
        !player.health
    ) {

        return;

    }


    const newMaximumHealth =
        calculatePlayerMaximumHealth(
            player
        );


    const oldMaximumHealth =
        Number.isFinite(
            previousMaximumHealth
        )
            ? previousMaximumHealth
            : player.health.maximum;


    if (
        newMaximumHealth >
        oldMaximumHealth
    ) {

        const healthIncrease =
            newMaximumHealth -
            oldMaximumHealth;


        player.health.maximum =
            newMaximumHealth;


        player.health.current =
            Math.min(
                newMaximumHealth,
                player.health.current +
                healthIncrease
            );


        return;

    }


    player.health.maximum =
        newMaximumHealth;


    player.health.current =
        Math.min(
            player.health.current,
            newMaximumHealth
        );

}


/* =======================================================
   EFFECTIVE PLAYER DEFENSE
   ======================================================= */

function getEffectivePlayerDefense(
    player
) {

    const combatStats =
        getEffectivePlayerCombatStats(
            player
        );


    const combatStyle =
        getCombatStyle();


    let defenseMultiplier =
        1;


    if (
        COMBAT_STYLE_MODIFIERS[
            combatStyle
        ]
    ) {

        defenseMultiplier =
            COMBAT_STYLE_MODIFIERS[
                combatStyle
            ].defenseMultiplier;

    }


    return Math.max(
        0,
        combatStats.defense *
        defenseMultiplier
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
        !enemy.id ||
        player.isDead
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


    syncPlayerVitalityHealth(
        player
    );


    const combatStats =
        getEffectivePlayerCombatStats(
            player
        );


    const weapon =
        getEquippedWeapon(
            player
        );


    const discipline =
        getPlayerCombatDiscipline(
            player
        );


    console.log(
        `Target selected: ${enemy.name}`
    );


    console.log(
        `Combat style: ${getCombatStyle()}`
    );


    console.log(
        `Combat discipline: ` +
        `${discipline || "melee"}`
    );


    if (weapon) {

        console.log(
            `Equipped weapon: ${weapon.name}`
        );

    } else {

        console.log(
            "No weapon equipped. Using melee."

        );

    }


    console.log(
        `Combat skills: ` +
        `Attack ${combatStats.attack}, ` +
        `Strength ${combatStats.strength}, ` +
        `Defense ${combatStats.defense}, ` +
        `Vitality ${getPlayerVitalityLevel(player)}, ` +
        `Ballistics ${getPlayerBallisticsLevel(player)}, ` +
        `Flux ${getPlayerFluxLevel(player)}`
    );


    console.log(
        `Equipment bonuses: ` +
        `Attack +${combatStats.attack - getPlayerAttackLevel(player)}, ` +
        `Strength +${combatStats.strength - getPlayerStrengthLevel(player)}, ` +
        `Defense +${combatStats.defense - getPlayerDefenseLevel(player)}`
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
   COMBAT DISENGAGEMENT
   ======================================================= */

function isOutsideCombatDisengagementRange(
    player,
    enemy
) {

    if (
        !player ||
        !enemy ||
        !player.position ||
        !enemy.position
    ) {

        return true;

    }


    const distance =
        getDistance(
            player.position.x,
            player.position.y,
            enemy.position.x,
            enemy.position.y
        );


    return (
        distance >
        COMBAT_DISENGAGEMENT_RANGE
    );

}


/* =======================================================
   VALID MOVEMENT POSITION
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
   MOVE PLAYER TOWARD TARGET
   ======================================================= */

function movePlayerTowardTarget(
    player,
    enemy
) {

    if (
        !player ||
        !enemy ||
        !player.position ||
        !enemy.position ||
        player.isDead
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
   AWARD COMBAT XP FOR DAMAGE
   ======================================================= */

/*
 * XP rules:
 *
 * 4 XP per damage dealt.
 *
 * Melee:
 *     Primary style skill = 100%
 *     Vitality            = 25%
 *
 * Ballistics:
 *     Ballistics          = 25%
 *     Vitality            = 25%
 *
 * Flux:
 *     Flux                = 25%
 *     Vitality            = 25%
 *
 * This keeps Ballistics and Flux leveling at the
 * same pace as Vitality, as intended.
 */

function awardCombatXPForDamage(
    player,
    damage,
    combatDiscipline
) {

    if (
        !player ||
        !Number.isFinite(damage) ||
        damage <= 0
    ) {

        return null;

    }


    const combatStyle =
        getCombatStyle();


    const baseCombatXP =
        damage *
        COMBAT_XP_PER_DAMAGE;


    const secondaryXP =
        baseCombatXP *
        SECONDARY_COMBAT_XP_PERCENT;


    let primarySkill =
        null;


    let primaryXP =
        0;


    /*
     * MELEE
     */

    if (
        !combatDiscipline
    ) {

        if (
            combatStyle ===
            COMBAT_STYLES.ACCURATE
        ) {

            primarySkill =
                "attack";

        } else if (
            combatStyle ===
            COMBAT_STYLES.AGGRESSIVE
        ) {

            primarySkill =
                "strength";

        } else if (
            combatStyle ===
            COMBAT_STYLES.DEFENSIVE
        ) {

            primarySkill =
                "defense";

        }


        primaryXP =
            baseCombatXP;

    }


    /*
     * BALLISTICS
     */

    if (
        combatDiscipline ===
        "ballistics"
    ) {

        primarySkill =
            "ballistics";

        primaryXP =
            secondaryXP;

    }


    /*
     * FLUX
     */

    if (
        combatDiscipline ===
        "flux"
    ) {

        primarySkill =
            "flux";

        primaryXP =
            secondaryXP;

    }


    if (!primarySkill) {

        return null;

    }


    const previousMaximumHealth =
        player.health.maximum;


    const primaryResult =
        awardSkillXP(
            player.skills,
            primarySkill,
            primaryXP
        );


    /*
     * Vitality receives the same secondary
     * combat XP rate.
     */

    const vitalityResult =
        awardSkillXP(
            player.skills,
            "vitality",
            secondaryXP
        );


    syncPlayerVitalityHealth(
        player,
        previousMaximumHealth
    );


    console.log(
        `Combat XP: ${damage} damage ` +
        `→ ${primaryXP} ${primarySkill} XP + ` +
        `${secondaryXP} Vitality XP.`
    );


    if (
        primaryResult.levelsGained > 0
    ) {

        console.log(
            `${primarySkill} reached level ` +
            `${primaryResult.currentLevel}.`
        );

    }


    if (
        vitalityResult.levelsGained > 0
    ) {

        console.log(
            `Vitality reached level ` +
            `${vitalityResult.currentLevel}. ` +
            `Maximum HP is now ` +
            `${player.health.maximum}.`
        );

    }


    return {

        combatDiscipline,

        primarySkill,

        primaryXP,

        vitalityXP:
            secondaryXP,

        primaryResult,

        vitalityResult

    };

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


    const combatStyle =
        getCombatStyle();


    const combatDiscipline =
        getPlayerCombatDiscipline(
            player
        );


    const weapon =
        getEquippedWeapon(
            player
        );


    /*
     * Check and consume ammunition/resources
     * before attempting the attack.
     */

    const resourceResult =
        consumeCombatResource(
            player,
            weapon
        );


    if (
        !resourceResult.success
    ) {

        /*
         * No resource means this weapon cannot
         * continue attacking.
         */

        stopCombat();

        return;

    }


    const combatStats =
        getEffectivePlayerCombatStats(
            player
        );


    /*
     * For Melee:
     *
     * attack = Attack skill
     * strength = Strength skill
     *
     * For Ballistics:
     *
     * attack = Ballistics skill
     * strength = Strength skill
     *
     * For Flux:
     *
     * attack = Flux skill
     * strength = Strength skill
     *
     * The existing combat engine still handles
     * the actual hit/damage calculation.
     */

    let attackLevel;


    if (
        combatDiscipline ===
        "ballistics"
    ) {

        attackLevel =
            getPlayerBallisticsLevel(
                player
            );

    } else if (
        combatDiscipline ===
        "flux"
    ) {

        attackLevel =
            getPlayerFluxLevel(
                player
            );

    } else {

        attackLevel =
            combatStats.attack;

    }


    const strengthLevel =
        combatStats.strength;


    const result =
        performAttack(
            player,
            enemy,
            attackLevel,
            combatStyle,
            strengthLevel
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

        awardCombatXPForDamage(
            player,
            result.damage,
            combatDiscipline
        );


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
            `${enemy.health.current}/${enemy.health.maximum} HP remaining. ` +
            `Style: ${combatStyle}. ` +
            `Discipline: ${combatDiscipline || "melee"}. ` +
            `Attack ${attackLevel}, ` +
            `Strength ${strengthLevel}`
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
            `Player misses ${enemy.name}. ` +
            `No combat XP awarded. ` +
            `Style: ${combatStyle}. ` +
            `Discipline: ${combatDiscipline || "melee"}. ` +
            `Attack ${attackLevel}`
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


    const playerDefense =
        getEffectivePlayerDefense(
            player
        );


    const result =
        performAttack(
            enemy,
            player,
            enemy.attack,
            COMBAT_STYLES.ACCURATE,
            enemy.attack,
            playerDefense
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
            `${player.health.current}/${player.health.maximum} HP remaining. ` +
            `Player Defense ${playerDefense}`
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
            `${enemy.name} misses player. ` +
            `Player Defense ${playerDefense}`
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


    if (
        player.isDead
    ) {

        stopCombat();

        return;

    }


    /*
     * Keep HP synchronized with Vitality even when
     * combat is not responsible for the level change.
     */

    syncPlayerVitalityHealth(
        player
    );


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

        if (
            !isTargetAlive(player) &&
            !player.isDead
        ) {

            handlePlayerDeath();

        }


        stopCombat();

        return;

    }


    /* ===================================================
       APPROACH PHASE
       =================================================== */

    if (
        !combatState.engaged
    ) {

        if (
            isWithinCombatRange(
                player,
                enemy
            )
        ) {

            combatState.engaged =
                true;


            const now =
                performance.now();


            combatState.playerNextAttackTime =
                now;


            combatState.enemyNextAttackTime =
                now;


            player.movement.moving =
                false;


            console.log(
                `Combat engaged with ${enemy.name}.`
            );

        } else {

            movePlayerTowardTarget(
                player,
                enemy
            );


            return;

        }

    }


    /* ===================================================
       ACTIVE COMBAT
       =================================================== */

    if (
        isOutsideCombatDisengagementRange(
            player,
            enemy
        )
    ) {

        console.log(
            `Player moved too far from ${enemy.name}. ` +
            `Combat disengaged.`
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


    /*
     * processPlayerAttack() can stop combat if the
     * player runs out of ammunition or Flux Crystals.
     */

    if (
        !combatState.active
    ) {

        return;

    }


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

        handlePlayerDeath();

        stopCombat();

    }

}