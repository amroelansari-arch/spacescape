/* =======================================================
   SPACESCAPE COMBAT LEVEL
   ======================================================= */

/*
 * Combat Level is a derived statistic.
 *
 * It is NOT an independent skill and does not
 * contain its own XP.
 *
 * Current formula:
 *
 * (Attack + Strength + Defense + Vitality) / 4
 *
 * The result is rounded down.
 *
 * Specialized combat skills such as Ballistics
 * and Energy Weapons are intentionally excluded
 * for now.
 */


/* =======================================================
   CONSTANTS
   ======================================================= */

const MIN_COMBAT_LEVEL = 1;
const MAX_COMBAT_LEVEL = 99;


/* =======================================================
   COMBAT LEVEL CALCULATION
   ======================================================= */

export function calculateCombatLevel(
    player
) {

    if (
        !player ||
        !player.skills
    ) {

        return MIN_COMBAT_LEVEL;

    }


    const attack =
        Number.isFinite(
            player.skills.attack?.level
        )
            ? player.skills.attack.level
            : 1;


    const strength =
        Number.isFinite(
            player.skills.strength?.level
        )
            ? player.skills.strength.level
            : 1;


    const defense =
        Number.isFinite(
            player.skills.defense?.level
        )
            ? player.skills.defense.level
            : 1;


    const vitality =
        Number.isFinite(
            player.skills.vitality?.level
        )
            ? player.skills.vitality.level
            : 1;


    const combatLevel =
        Math.floor(
            (
                attack +
                strength +
                defense +
                vitality
            ) / 4
        );


    return Math.max(
        MIN_COMBAT_LEVEL,
        Math.min(
            MAX_COMBAT_LEVEL,
            combatLevel
        )
    );

}


/* =======================================================
   PLAYER COMBAT LEVEL
   ======================================================= */

export function getPlayerCombatLevel(
    player
) {

    return calculateCombatLevel(
        player
    );

}