 /* =======================================================
    DAMAGE
    ======================================================= */

export function applyDamage(
    target,
    amount
) {
    if (
        !target ||
        !target.health ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return false;
    }

    target.health.current = Math.max(
        0,
        target.health.current - amount
    );

    return true;
}


/* =======================================================
   HEAL
   ======================================================= */

export function healTarget(
    target,
    amount
) {
    if (
        !target ||
        !target.health ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return false;
    }

    target.health.current = Math.min(
        target.health.maximum,
        target.health.current + amount
    );

    return true;
}


/* =======================================================
   HEALTH CHECKS
   ======================================================= */

export function isTargetAlive(target) {
    if (
        !target ||
        !target.health
    ) {
        return false;
    }

    return target.health.current > 0;
}


export function isTargetDead(target) {
    return !isTargetAlive(target);
}