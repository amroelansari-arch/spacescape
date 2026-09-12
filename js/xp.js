export function getXPRequiredForLevel(level) {

    if (level <= 1) {

        return 100;

    }

    return Math.floor(
        100 * Math.pow(level, 1.5)
    );

}


export function awardXP(player, amount) {

    if (amount <= 0) {

        return;

    }

    player.xp += amount;


    while (
        player.xp >=
        getXPRequiredForLevel(player.level)
    ) {

        player.xp -=
            getXPRequiredForLevel(player.level);

        player.level++;

    }

}