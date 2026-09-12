/* =======================================================
   APPLY DAMAGE
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
   HEAL TARGET
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
   TARGET ALIVE
   ======================================================= */

export function isTargetAlive(
    target
) {
    if (
        !target ||
        !target.health
    ) {
        return false;
    }

    return target.health.current > 0;
}


/* =======================================================
   TARGET DEAD
   ======================================================= */

export function isTargetDead(
    target
) {
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
   HIT CHANCE
   ======================================================= */

export function calculateHitChance(
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

    const chance =
        attackPower /
        (
            attackPower +
            defense
        );

    return Math.max(
        0.20,
        Math.min(
            0.90,
            chance
        )
    );
}


/* =======================================================
   HIT ROLL
   ======================================================= */

export function rollAttackHit(
    attackPower,
    defense
) {
    const hitChance =
        calculateHitChance(
            attackPower,
            defense
        );

    return Math.random() < hitChance;
}


/* =======================================================
   DAMAGE ROLL
   ======================================================= */

export function rollDamage(
    attackPower,
    defense
) {
    const maximumDamage =
        calculateDamage(
            attackPower,
            defense
        );

    const minimumDamage =
        Math.max(
            1,
            Math.floor(
                maximumDamage * 0.50
            )
        );

    if (
        maximumDamage <= minimumDamage
    ) {
        return maximumDamage;
    }

    return (
        Math.floor(
            Math.random() *
            (
                maximumDamage -
                minimumDamage +
                1
            )
        ) +
        minimumDamage
    );
}


/* =======================================================
   PERFORM ATTACK
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
        return {
            success: false,
            hit: false,
            damage: 0
        };
    }

    if (!isTargetAlive(attacker)) {
        return {
            success: false,
            hit: false,
            damage: 0
        };
    }

    if (!isTargetAlive(target)) {
        return {
            success: false,
            hit: false,
            damage: 0
        };
    }

    const defense =
        Number.isFinite(target.defense)
            ? target.defense
            : 0;

    const hit =
        rollAttackHit(
            attackPower,
            defense
        );

    if (!hit) {
        return {
            success: true,
            hit: false,
            damage: 0
        };
    }

    const damage =
        rollDamage(
            attackPower,
            defense
        );

    applyDamage(
        target,
        damage
    );

    return {
        success: true,
        hit: true,
        damage
    };
}