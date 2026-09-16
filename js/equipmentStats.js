/*
 * =======================================================
 * SPACESCAPE EQUIPMENT STATS
 * =======================================================
 *
 * Centralizes all combat/stat bonuses provided by equipment.
 *
 * Equipment itself stores item IDs.
 * This module resolves those IDs through items.js.
 *
 * This keeps combat from needing to understand individual
 * item definitions.
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


    const equipmentStats =
        getEquipmentStats(
            player
                ? player.equipment
                : null
        );


    return {

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

        accuracyBonus:
            equipmentStats.accuracyBonus,

        damageBonus:
            equipmentStats.damageBonus,

        weaponDamage:
            equipmentStats.weaponDamage

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
        typeof item.requirements !== "object"
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
        const skillName of Object.keys(
            requirements
        )
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
        const skillName of Object.keys(
            requirements
        )
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