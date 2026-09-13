/* =======================================================
   GENERIC PLAYER XP
   ======================================================= */

/*
 * TEMPORARY LEGACY SYSTEM
 *
 * The current combat system still uses player.level
 * and player.xp.
 *
 * SpaceScape will eventually transition completely
 * to individual skill XP and calculated Combat Level.
 *
 * This module remains functional during that transition.
 */


/* =======================================================
   XP REQUIRED FOR LEVEL
   ======================================================= */

export function getXPRequiredForLevel(
    level
) {

    if (
        !Number.isFinite(level) ||
        level < 1
    ) {

        return 100;

    }


    return Math.floor(
        100 *
        Math.pow(
            level,
            1.5
        )
    );

}


/* =======================================================
   CURRENT PLAYER XP
   ======================================================= */

export function getCurrentLevelXP(
    player
) {

    if (
        !player ||
        !Number.isFinite(
            player.xp
        )
    ) {

        return 0;

    }


    return player.xp;

}


/* =======================================================
   XP TO NEXT LEVEL
   ======================================================= */

export function getXPToNextLevel(
    player
) {

    if (
        !player ||
        !Number.isFinite(
            player.level
        ) ||
        !Number.isFinite(
            player.xp
        )
    ) {

        return 0;

    }


    return Math.max(
        0,
        getXPRequiredForLevel(
            player.level
        ) -
        player.xp
    );

}


/* =======================================================
   AWARD PLAYER XP
   ======================================================= */

export function awardXP(
    player,
    amount
) {

    if (
        !player ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return {

            awarded: 0,

            levelsGained: 0

        };

    }


    player.xp += amount;


    let levelsGained = 0;


    while (
        player.xp >=
        getXPRequiredForLevel(
            player.level
        )
    ) {

        player.xp -=
            getXPRequiredForLevel(
                player.level
            );


        player.level++;


        levelsGained++;

    }


    return {

        awarded: amount,

        levelsGained

    };

}