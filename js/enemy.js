export function createEnemy(
    name = "Enemy",
    level = 1,
    maximumHealth = 50,
    attack = 5,
    defense = 2,
    xpReward = null
) {
    const calculatedXPReward =
        Number.isFinite(xpReward) &&
        xpReward > 0
            ? xpReward
            : Math.max(
                25,
                level * 25
            );

    return {
        id: crypto.randomUUID(),

        name,

        level,

        health: {
            current: maximumHealth,
            maximum: maximumHealth
        },

        attack,

        defense,

        xpReward:
            calculatedXPReward
    };
}