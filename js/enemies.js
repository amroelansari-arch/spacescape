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