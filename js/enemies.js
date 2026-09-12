/* =======================================================
   CREATE ENEMY COLLECTION
   ======================================================= */

export function createEnemyCollection() {
    return [];
}


/* =======================================================
   ADD ENEMY
   ======================================================= */

export function addEnemy(
    enemies,
    enemy
) {
    if (
        !Array.isArray(enemies) ||
        !enemy
    ) {
        return false;
    }

    enemies.push(enemy);

    return true;
}


/* =======================================================
   FIND ENEMY BY ID
   ======================================================= */

export function findEnemyById(
    enemies,
    enemyId
) {
    if (
        !Array.isArray(enemies) ||
        !enemyId
    ) {
        return null;
    }

    return (
        enemies.find(
            enemy =>
                enemy &&
                enemy.id === enemyId
        ) || null
    );
}


/* =======================================================
   FIND NEAREST ENEMY
   ======================================================= */

export function findNearestEnemy(
    enemies,
    x,
    y
) {
    if (
        !Array.isArray(enemies) ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {
        return null;
    }

    let nearestEnemy = null;
    let nearestDistance = Infinity;

    for (const enemy of enemies) {

        if (
            !enemy ||
            !enemy.position ||
            !enemy.health ||
            enemy.health.current <= 0
        ) {
            continue;
        }

        if (
            !Number.isFinite(enemy.position.x) ||
            !Number.isFinite(enemy.position.y)
        ) {
            continue;
        }

        const dx =
            enemy.position.x - x;

        const dy =
            enemy.position.y - y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestEnemy = enemy;
        }
    }

    return nearestEnemy;
}


/* =======================================================
   FIND ENEMIES WITHIN RANGE
   ======================================================= */

export function findEnemiesWithinRange(
    enemies,
    x,
    y,
    range
) {
    if (
        !Array.isArray(enemies) ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(range) ||
        range < 0
    ) {
        return [];
    }

    const enemiesInRange = [];

    for (const enemy of enemies) {

        if (
            !enemy ||
            !enemy.position ||
            !enemy.health ||
            enemy.health.current <= 0
        ) {
            continue;
        }

        if (
            !Number.isFinite(enemy.position.x) ||
            !Number.isFinite(enemy.position.y)
        ) {
            continue;
        }

        const dx =
            enemy.position.x - x;

        const dy =
            enemy.position.y - y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance <= range) {
            enemiesInRange.push(enemy);
        }
    }

    return enemiesInRange;
}


/* =======================================================
   REMOVE ENEMY
   ======================================================= */

export function removeEnemy(
    enemies,
    enemy
) {
    if (
        !Array.isArray(enemies) ||
        !enemy
    ) {
        return false;
    }

    const index =
        enemies.indexOf(enemy);

    if (index === -1) {
        return false;
    }

    enemies.splice(index, 1);

    return true;
}


/* =======================================================
   GET ACTIVE ENEMIES
   ======================================================= */

export function getActiveEnemies(
    enemies
) {
    if (!Array.isArray(enemies)) {
        return [];
    }

    return enemies.filter(
        enemy =>
            enemy &&
            enemy.health &&
            enemy.health.current > 0
    );
}


/* =======================================================
   GET ENEMY COUNT
   ======================================================= */

export function getEnemyCount(
    enemies
) {
    if (!Array.isArray(enemies)) {
        return 0;
    }

    return enemies.length;
}


/* =======================================================
   CLEAR ENEMIES
   ======================================================= */

export function clearEnemies(
    enemies
) {
    if (!Array.isArray(enemies)) {
        return;
    }

    enemies.length = 0;
}