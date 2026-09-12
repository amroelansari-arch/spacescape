/* =======================================================
   CREATE ENEMY
   ======================================================= */

export function createEnemy(
    name = "Enemy",
    level = 1,
    maximumHealth = 50,
    attack = 5,
    defense = 2
) {
    return {
        name,
        level,

        health: {
            current: maximumHealth,
            maximum: maximumHealth
        },

        attack,
        defense
    };
}