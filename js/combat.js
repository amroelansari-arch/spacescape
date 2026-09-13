export const COMBAT_STYLES = {

    ACCURATE: "accurate",

    AGGRESSIVE: "aggressive",

    DEFENSIVE: "defensive"

};


/* =======================================================
   COMBAT STYLE MODIFIERS
   ======================================================= */

export const COMBAT_STYLE_MODIFIERS = {

    accurate: {

        accuracyMultiplier: 1.15,

        damageMultiplier: 0.90,

        defenseMultiplier: 1.00

    },

    aggressive: {

        accuracyMultiplier: 0.90,

        damageMultiplier: 1.20,

        defenseMultiplier: 0.90

    },

    defensive: {

        accuracyMultiplier: 0.80,

        damageMultiplier: 0.85,

        defenseMultiplier: 1.20

    }

};


/* =======================================================
   COMBAT STYLE VALIDATION
   ======================================================= */

export function isValidCombatStyle(
    combatStyle
) {

    return (
        combatStyle ===
            COMBAT_STYLES.ACCURATE ||

        combatStyle ===
            COMBAT_STYLES.AGGRESSIVE ||

        combatStyle ===
            COMBAT_STYLES.DEFENSIVE
    );

}


/* =======================================================
   COMBAT DAMAGE
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


    target.health.current =
        Math.max(
            0,
            target.health.current -
            amount
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


    target.health.current =
        Math.min(
            target.health.maximum,
            target.health.current +
            amount
        );


    return true;

}


/* =======================================================
   TARGET STATE
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


    return (
        target.health.current > 0
    );

}


export function isTargetDead(
    target
) {

    return !isTargetAlive(
        target
    );

}


/* =======================================================
   BASE DAMAGE
   ======================================================= */

export function calculateDamage(
    attackPower,
    defense
) {

    if (
        !Number.isFinite(
            attackPower
        ) ||
        attackPower <= 0
    ) {

        return 0;

    }


    if (
        !Number.isFinite(
            defense
        ) ||
        defense < 0
    ) {

        defense = 0;

    }


    return Math.max(
        1,
        attackPower -
        defense
    );

}


/* =======================================================
   STYLE DAMAGE
   ======================================================= */

export function calculateStyledDamage(
    attackPower,
    defense,
    combatStyle = COMBAT_STYLES.ACCURATE
) {

    const baseDamage =
        calculateDamage(
            attackPower,
            defense
        );


    if (
        !isValidCombatStyle(
            combatStyle
        )
    ) {

        return baseDamage;

    }


    const modifier =
        COMBAT_STYLE_MODIFIERS[
            combatStyle
        ];


    return Math.max(
        1,
        Math.round(
            baseDamage *
            modifier.damageMultiplier
        )
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
        !Number.isFinite(
            attackPower
        ) ||
        attackPower <= 0
    ) {

        return 0;

    }


    if (
        !Number.isFinite(
            defense
        ) ||
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
   STYLE HIT CHANCE
   ======================================================= */

export function calculateStyledHitChance(
    attackPower,
    defense,
    combatStyle = COMBAT_STYLES.ACCURATE
) {

    const baseChance =
        calculateHitChance(
            attackPower,
            defense
        );


    if (
        !isValidCombatStyle(
            combatStyle
        )
    ) {

        return baseChance;

    }


    const modifier =
        COMBAT_STYLE_MODIFIERS[
            combatStyle
        ];


    return Math.max(
        0.20,
        Math.min(
            0.90,
            baseChance *
            modifier.accuracyMultiplier
        )
    );

}


/* =======================================================
   ROLL ATTACK HIT
   ======================================================= */

export function rollAttackHit(
    attackPower,
    defense,
    combatStyle = COMBAT_STYLES.ACCURATE
) {

    const hitChance =
        calculateStyledHitChance(
            attackPower,
            defense,
            combatStyle
        );


    return (
        Math.random() <
        hitChance
    );

}


/* =======================================================
   ROLL DAMAGE
   ======================================================= */

export function rollDamage(
    attackPower,
    defense,
    combatStyle = COMBAT_STYLES.ACCURATE
) {

    const maximumDamage =
        calculateStyledDamage(
            attackPower,
            defense,
            combatStyle
        );


    const minimumDamage =
        Math.max(
            1,
            Math.floor(
                maximumDamage *
                0.50
            )
        );


    if (
        maximumDamage <=
        minimumDamage
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

/*
 * attackPower controls ACCURACY.
 *
 * damagePower controls DAMAGE.
 *
 * defenseOverride allows the combat system to use
 * a calculated defense value instead of relying on
 * target.defense.
 *
 * This lets SpaceScape use:
 *
 * Attack skill     → accuracy
 * Strength skill   → damage
 * Defense skill    → incoming resistance
 */

export function performAttack(
    attacker,
    target,
    attackPower,
    combatStyle = COMBAT_STYLES.ACCURATE,
    damagePower = attackPower,
    defenseOverride = null
) {

    if (
        !attacker ||
        !target ||
        !Number.isFinite(
            attackPower
        ) ||
        attackPower <= 0
    ) {

        return {

            success: false,

            hit: false,

            damage: 0

        };

    }


    if (
        !Number.isFinite(
            damagePower
        ) ||
        damagePower <= 0
    ) {

        return {

            success: false,

            hit: false,

            damage: 0

        };

    }


    if (
        !isTargetAlive(
            attacker
        )
    ) {

        return {

            success: false,

            hit: false,

            damage: 0

        };

    }


    if (
        !isTargetAlive(
            target
        )
    ) {

        return {

            success: false,

            hit: false,

            damage: 0

        };

    }


    let defense;


    if (
        Number.isFinite(
            defenseOverride
        ) &&
        defenseOverride >= 0
    ) {

        defense =
            defenseOverride;

    } else {

        defense =
            Number.isFinite(
                target.defense
            )
                ? target.defense
                : 0;

    }


    const hit =
        rollAttackHit(
            attackPower,
            defense,
            combatStyle
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
            damagePower,
            defense,
            combatStyle
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