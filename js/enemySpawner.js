/* =======================================================
   SPAWN ENEMY
   ======================================================= */

export function spawnEnemy(
    enemyFactory,
    name,
    level,
    maximumHealth,
    attack,
    defense,
    x,
    y
) {
    if (
        typeof enemyFactory !== "function" ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {
        return null;
    }

    const enemy =
        enemyFactory(
            name,
            level,
            maximumHealth,
            attack,
            defense
        );

    if (!enemy) {
        return null;
    }

    enemy.position = {
        x,
        y
    };

    return enemy;
}