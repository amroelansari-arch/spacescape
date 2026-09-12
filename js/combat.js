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


/* =======================================================
   DAMAGE CALCULATION
   ======================================================= */

export function calculateDamage(
    attackPower,
    defense
) {
    if (
        !Number.isFinite(attackPower) ||
        attackPower <= 0
    ) {
        return 0;
    }

    if (
        !Number.isFinite(defense) ||
        defense < 0
    ) {
        defense = 0;
    }

    return Math.max(
        1,
        attackPower - defense
    );
}


/* =======================================================
   ATTACK
   ======================================================= */

export function performAttack(
    attacker,
    target,
    attackPower
) {
    if (
        !attacker ||
        !target ||
        !Number.isFinite(attackPower) ||
        attackPower <= 0
    ) {
        return false;
    }

    if (!isTargetAlive(attacker)) {
        return false;
    }

    if (!isTargetAlive(target)) {
        return false;
    }

    const defense =
        Number.isFinite(target.defense)
            ? target.defense
            : 0;

    const damage =
        calculateDamage(
            attackPower,
            defense
        );

    return applyDamage(
        target,
        damage
    );
}