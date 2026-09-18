/*
 * =======================================================
 * SPACESCAPE EQUIPMENT STATS
 * =======================================================
 *
 * Centralizes all combat/stat bonuses provided by equipment.
 *
 * Equipment stores item IDs.
 * This module resolves those IDs through items.js.
 *
 * Ammunition is an equipment slot, but ammunition itself
 * does not provide combat stat bonuses.
 * =======================================================
 */

import {
    getItem
} from "./items.js";


/* =======================================================
   DEFAULT EQUIPMENT STATS
   ======================================================= */

const EMPTY_STATS = {

    attackBonus: 0,

    strengthBonus: 0,

    defenseBonus: 0,

    accuracyBonus: 0,

    damageBonus: 0,

    weaponDamage: 0

};


/* =======================================================
   GET ITEM EQUIPMENT STATS
   ======================================================= */

export function getItemEquipmentStats(
    item
) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return {
            ...EMPTY_STATS
        };

    }


    /*
     * Ammunition does not contribute combat stats.
     */

    if (
        item.type === "ammunition" ||
        item.slot === "ammunition"
    ) {

        return {
            ...EMPTY_STATS
        };

    }


    const stats =
        item.stats ||
        {};


    return {

        attackBonus:
            Number.isFinite(
                stats.attackBonus
            )
                ? stats.attackBonus
                : 0,

        strengthBonus:
            Number.isFinite(
                stats.strengthBonus
            )
                ? stats.strengthBonus
                : 0,

        defenseBonus:
            Number.isFinite(
                stats.defenseBonus
            )
                ? stats.defenseBonus
                : 0,

        accuracyBonus:
            Number.isFinite(
                stats.accuracyBonus
            )
                ? stats.accuracyBonus
                : 0,

        damageBonus:
            Number.isFinite(
                stats.damageBonus
            )
                ? stats.damageBonus
                : 0,

        weaponDamage:
            Number.isFinite(
                stats.weaponDamage
            )
                ? stats.weaponDamage
                : 0

    };

}


/* =======================================================
   GET EQUIPMENT ITEM
   ======================================================= */

function resolveEquippedItem(
    equippedItem
) {

    if (
        !equippedItem ||
        !equippedItem.id
    ) {

        return null;

    }


    return getItem(
        equippedItem.id
    );

}


/* =======================================================
   CALCULATE EQUIPMENT STATS
   ======================================================= */

export function getEquipmentStats(
    equipment
) {

    const totals = {

        ...EMPTY_STATS

    };


    if (
        !equipment ||
        typeof equipment !== "object"
    ) {

        return totals;

    }


    for (
        const slot of Object.keys(
            equipment
        )
    ) {

        /*
         * Ammunition is intentionally skipped.
         *
         * The slot exists for combat ammunition
         * management, not stat bonuses.
         */

        if (
            slot === "ammunition"
        ) {

            continue;

        }


        const equippedItem =
            resolveEquippedItem(
                equipment[slot]
            );


        if (!equippedItem) {
            continue;
        }


        const stats =
            getItemEquipmentStats(
                equippedItem
            );


        totals.attackBonus +=
            stats.attackBonus;

        totals.strengthBonus +=
            stats.strengthBonus;

        totals.defenseBonus +=
            stats.defenseBonus;

        totals.accuracyBonus +=
            stats.accuracyBonus;

        totals.damageBonus +=
            stats.damageBonus;

        totals.weaponDamage +=
            stats.weaponDamage;

    }


    return totals;

}


/* =======================================================
   EFFECTIVE PLAYER COMBAT STATS
   ======================================================= */

/*
 * Returns the combat values after equipment bonuses
 * have been applied.
 *
 * Melee:
 *
 *     Attack    -> Attack skill + attackBonus
 *     Strength  -> Strength skill + strengthBonus
 *     Defense   -> Defense skill + defenseBonus
 *
 * Ballistics:
 *
 *     Ballistics -> Ballistics skill + attackBonus
 *
 * Flux:
 *
 *     Flux -> Flux skill + attackBonus
 *
 * General accuracy/damage/weapon bonuses are returned
 * separately because combat.js applies those during the
 * actual attack calculation.
 */

export function getEffectivePlayerCombatStats(
    player
) {

    const baseAttack =
        player &&
        player.skills &&
        player.skills.attack &&
        Number.isFinite(
            player.skills.attack.level
        )
            ? player.skills.attack.level
            : 1;


    const baseStrength =
        player &&
        player.skills &&
        player.skills.strength &&
        Number.isFinite(
            player.skills.strength.level
        )
            ? player.skills.strength.level
            : 1;


    const baseDefense =
        player &&
        player.skills &&
        player.skills.defense &&
        Number.isFinite(
            player.skills.defense.level
        )
            ? player.skills.defense.level
            : 1;


    const baseBallistics =
        player &&
        player.skills &&
        player.skills.ballistics &&
        Number.isFinite(
            player.skills.ballistics.level
        )
            ? player.skills.ballistics.level
            : 1;


    const baseFlux =
        player &&
        player.skills &&
        player.skills.flux &&
        Number.isFinite(
            player.skills.flux.level
        )
            ? player.skills.flux.level
            : 1;


    const equipmentStats =
        getEquipmentStats(
            player
                ? player.equipment
                : null
        );


    return {

        /*
         * MELEE
         */

        attack:
            Math.max(
                1,
                baseAttack +
                equipmentStats.attackBonus
            ),

        strength:
            Math.max(
                1,
                baseStrength +
                equipmentStats.strengthBonus
            ),

        defense:
            Math.max(
                1,
                baseDefense +
                equipmentStats.defenseBonus
            ),


        /*
         * BALLISTICS
         *
         * Uses the Ballistics skill as its
         * base attack level and receives the
         * general equipment attack bonus.
         */

        ballistics:
            Math.max(
                1,
                baseBallistics +
                equipmentStats.attackBonus
            ),


        /*
         * FLUX
         *
         * Uses the Flux skill as its base
         * attack level and receives the general
         * equipment attack bonus.
         */

        flux:
            Math.max(
                1,
                baseFlux +
                equipmentStats.attackBonus
            ),


        /*
         * SECONDARY COMBAT BONUSES
         *
         * These remain separate because combat.js
         * applies them during the attack itself.
         */

        accuracyBonus:
            equipmentStats.accuracyBonus,

        damageBonus:
            equipmentStats.damageBonus,

        weaponDamage:
            equipmentStats.weaponDamage,


        /*
         * Expose the raw equipment bonuses too.
         *
         * This is useful for combat debugging and
         * future systems without requiring another
         * equipment-stat calculation.
         */

        attackBonus:
            equipmentStats.attackBonus,

        strengthBonus:
            equipmentStats.strengthBonus,

        defenseBonus:
            equipmentStats.defenseBonus

    };

}


/* =======================================================
   EQUIPMENT REQUIREMENTS
   ======================================================= */

export function getEquipmentRequirements(
    item
) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return {};

    }


    if (
        !item.requirements ||
        typeof item.requirements !==
        "object"
    ) {

        return {};

    }


    return {
        ...item.requirements
    };

}


/* =======================================================
   CHECK EQUIPMENT REQUIREMENTS
   ======================================================= */

export function meetsEquipmentRequirements(
    player,
    item
) {

    if (
        !player ||
        !item
    ) {

        return false;

    }


    const requirements =
        getEquipmentRequirements(
            item
        );


    if (
        Object.keys(
            requirements
        ).length === 0
    ) {

        return true;

    }


    for (
        const skillName of
        Object.keys(requirements)
    ) {

        const requiredLevel =
            requirements[
                skillName
            ];


        /*
         * Ignore malformed requirement values
         * rather than accidentally blocking equipment.
         */

        if (
            !Number.isFinite(
                requiredLevel
            )
        ) {

            continue;

        }


        const currentLevel =
            player.skills &&
            player.skills[
                skillName
            ] &&
            Number.isFinite(
                player.skills[
                    skillName
                ].level
            )
                ? player.skills[
                    skillName
                ].level
                : 1;


        if (
            currentLevel <
            requiredLevel
        ) {

            return false;

        }

    }


    return true;

}


/* =======================================================
   GET FAILED EQUIPMENT REQUIREMENT
   ======================================================= */

export function getFailedEquipmentRequirement(
    player,
    item
) {

    if (
        !player ||
        !item
    ) {

        return null;

    }


    const requirements =
        getEquipmentRequirements(
            item
        );


    for (
        const skillName of
        Object.keys(requirements)
    ) {

        const requiredLevel =
            requirements[
                skillName
            ];


        if (
            !Number.isFinite(
                requiredLevel
            )
        ) {

            continue;

        }


        const currentLevel =
            player.skills &&
            player.skills[
                skillName
            ] &&
            Number.isFinite(
                player.skills[
                    skillName
                ].level
            )
                ? player.skills[
                    skillName
                ].level
                : 1;


        if (
            currentLevel <
            requiredLevel
        ) {

            return {

                skillName,

                requiredLevel,

                currentLevel

            };

        }

    }


    return null;

}