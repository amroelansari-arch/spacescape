/* =======================================================
   CREATE ENEMY COLLECTION
   ======================================================= */

export function createEnemyCollection() {
    return [];
}


/* =======================================================
   ENEMY VALIDATION
   ======================================================= */

export function isValidEnemy(enemy) {
    return (
        !!enemy &&
        typeof enemy === "object" &&
        !!enemy.id &&
        !!enemy.health &&
        Number.isFinite(enemy.health.current) &&
        Number.isFinite(enemy.health.maximum)
    );
}


/* =======================================================
   ENEMY ACTIVE CHECK
   ======================================================= */

export function isEnemyActive(enemy) {
    return (
        isValidEnemy(enemy) &&
        enemy.health.current > 0
    );
}


/* =======================================================
   DISTANCE CALCULATION
   ======================================================= */

export function getDistance(
    x1,
    y1,
    x2,
    y2
) {
    if (
        !Number.isFinite(x1) ||
        !Number.isFinite(y1) ||
        !Number.isFinite(x2) ||
        !Number.isFinite(y2)
    ) {
        return Infinity;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
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
        !isValidEnemy(enemy)
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
                isValidEnemy(enemy) &&
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
            !isEnemyActive(enemy) ||
            !enemy.position ||
            !Number.isFinite(enemy.position.x) ||
            !Number.isFinite(enemy.position.y)
        ) {
            continue;
        }

        const distance =
            getDistance(
                x,
                y,
                enemy.position.x,
                enemy.position.y
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
            !isEnemyActive(enemy) ||
            !enemy.position ||
            !Number.isFinite(enemy.position.x) ||
            !Number.isFinite(enemy.position.y)
        ) {
            continue;
        }

        const distance =
            getDistance(
                x,
                y,
                enemy.position.x,
                enemy.position.y
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
            isEnemyActive(enemy)
    );
}


/* =======================================================
   REMOVE DEAD ENEMIES
   ======================================================= */

export function removeDeadEnemies(
    enemies
) {
    if (!Array.isArray(enemies)) {
        return 0;
    }

    const originalCount =
        enemies.length;

    for (let i = enemies.length - 1; i >= 0; i--) {

        if (!isEnemyActive(enemies[i])) {
            enemies.splice(i, 1);
        }
    }

    return (
        originalCount -
        enemies.length
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