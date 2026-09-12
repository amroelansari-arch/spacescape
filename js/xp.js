export function getXPRequiredForLevel(level) {
    if (level < 1) {
        return 100;
    }

    return Math.floor(
        100 * Math.pow(level, 1.5)
    );
}

export function getCurrentLevelXP(player) {
    return player.xp;
}

export function getXPToNextLevel(player) {
    return Math.max(
        0,
        getXPRequiredForLevel(player.level) - player.xp
    );
}

export function awardXP(player, amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
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