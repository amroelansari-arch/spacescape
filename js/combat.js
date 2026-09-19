import {
    getEquipmentStats
} from "./equipmentStats.js";


/* =======================================================
   COMBAT DISCIPLINES
   ======================================================= */

export const COMBAT_DISCIPLINES = {

    MELEE: "melee",

    BALLISTICS: "ballistics",

    FLUX: "flux"

};


/* =======================================================
   COMBAT STYLES
   ======================================================= */

export const COMBAT_STYLES = {

    ACCURATE: "accurate",

    AGGRESSIVE: "aggressive",

    DEFENSIVE: "defensive",

    CONTROLLED: "controlled",

    RAPID: "rapid"

};


/* =======================================================
   COMBAT STYLE DEFINITIONS
   ======================================================= */

/*
 * Each style has:
 *
 * - discipline
 * - displayName
 * - accuracyMultiplier
 * - damageMultiplier
 * - defenseMultiplier
 * - attackSpeedMultiplier
 * - xpDistribution
 *
 * xpDistribution values are percentages.
 *
 * Example:
 *
 * accurate melee:
 * Attack 100%
 *
 * controlled melee:
 * Attack 33.33%
 * Strength 33.33%
 * Defense 33.34%
 *
 * Ballistics defensive:
 * Ballistics 50%
 * Defense 50%
 *
 * Flux defensive:
 * Flux 50%
 * Defense 50%
 *
 * Vitality is NOT included here.
 *
 * Vitality receives its separate secondary combat XP
 * allocation inside combatSystem.js.
 */

export const COMBAT_STYLE_DEFINITIONS = {

    accurate: {

        style: COMBAT_STYLES.ACCURATE,

        displayName: "Accurate",

        disciplines: [

            COMBAT_DISCIPLINES.MELEE,

            COMBAT_DISCIPLINES.BALLISTICS,

            COMBAT_DISCIPLINES.FLUX

        ],

        accuracyMultiplier: 1.15,

        damageMultiplier: 0.90,

        defenseMultiplier: 1.00,

        attackSpeedMultiplier: 1.00,

        xpDistribution: {

            attack: 1.00,

            strength: 0.00,

            defense: 0.00,

            ballistics: 1.00,

            flux: 1.00

        }

    },


    aggressive: {

        style: COMBAT_STYLES.AGGRESSIVE,

        displayName: "Aggressive",

        disciplines: [

            COMBAT_DISCIPLINES.MELEE

        ],

        accuracyMultiplier: 0.90,

        damageMultiplier: 1.20,

        defenseMultiplier: 0.90,

        attackSpeedMultiplier: 1.00,

        xpDistribution: {

            attack: 0.00,

            strength: 1.00,

            defense: 0.00,

            ballistics: 0.00,

            flux: 0.00

        }

    },


    defensive: {

        style: COMBAT_STYLES.DEFENSIVE,

        displayName: "Defensive",

        disciplines: [

            COMBAT_DISCIPLINES.MELEE,

            COMBAT_DISCIPLINES.BALLISTICS,

            COMBAT_DISCIPLINES.FLUX

        ],

        accuracyMultiplier: 0.80,

        damageMultiplier: 0.85,

        defenseMultiplier: 1.20,

        attackSpeedMultiplier: 1.00,

        xpDistribution: {

            attack: 0.00,

            strength: 0.00,

            defense: 0.00,

            ballistics: 0.00,

            flux: 0.00

        }

    },


    controlled: {

        style: COMBAT_STYLES.CONTROLLED,

        displayName: "Controlled",

        disciplines: [

            COMBAT_DISCIPLINES.MELEE

        ],

        accuracyMultiplier: 1.00,

        damageMultiplier: 1.00,

        defenseMultiplier: 1.00,

        attackSpeedMultiplier: 1.00,

        xpDistribution: {

            attack: 1 / 3,

            strength: 1 / 3,

            defense: 1 / 3,

            ballistics: 0.00,

            flux: 0.00

        }

    },


    rapid: {

        style: COMBAT_STYLES.RAPID,

        displayName: "Rapid",

        disciplines: [

            COMBAT_DISCIPLINES.BALLISTICS

        ],

        accuracyMultiplier: 0.95,

        damageMultiplier: 1.00,

        defenseMultiplier: 1.00,

        attackSpeedMultiplier: 0.75,

        xpDistribution: {

            attack: 0.00,

            strength: 0.00,

            defense: 0.00,

            ballistics: 1.00,

            flux: 0.00

        }

    }

};


/* =======================================================
   DEFAULT STYLES BY DISCIPLINE
   ======================================================= */

export const DEFAULT_COMBAT_STYLES = {

    [COMBAT_DISCIPLINES.MELEE]: [

        COMBAT_STYLES.ACCURATE,

        COMBAT_STYLES.AGGRESSIVE,

        COMBAT_STYLES.DEFENSIVE,

        COMBAT_STYLES.CONTROLLED

    ],

    [COMBAT_DISCIPLINES.BALLISTICS]: [

        COMBAT_STYLES.ACCURATE,

        COMBAT_STYLES.RAPID,

        COMBAT_STYLES.DEFENSIVE

    ],

    [COMBAT_DISCIPLINES.FLUX]: [

        COMBAT_STYLES.ACCURATE,

        COMBAT_STYLES.DEFENSIVE

    ]

};


/* =======================================================
   COMBAT STYLE MODIFIERS
   ======================================================= */

export const COMBAT_STYLE_MODIFIERS = {

    accurate: {

        accuracyMultiplier: 1.15,

        damageMultiplier: 0.90,

        defenseMultiplier: 1.00,

        attackSpeedMultiplier: 1.00

    },

    aggressive: {

        accuracyMultiplier: 0.90,

        damageMultiplier: 1.20,

        defenseMultiplier: 0.90,

        attackSpeedMultiplier: 1.00

    },

    defensive: {

        accuracyMultiplier: 0.80,

        damageMultiplier: 0.85,

        defenseMultiplier: 1.20,

        attackSpeedMultiplier: 1.00

    },

    controlled: {

        accuracyMultiplier: 1.00,

        damageMultiplier: 1.00,

        defenseMultiplier: 1.00,

        attackSpeedMultiplier: 1.00

    },

    rapid: {

        accuracyMultiplier: 0.95,

        damageMultiplier: 1.00,

        defenseMultiplier: 1.00,

        attackSpeedMultiplier: 0.75

    }

};


/* =======================================================
   COMBAT STYLE HELPERS
   ======================================================= */

export function getCombatStyleDefinition(
    combatStyle
) {

    if (
        !combatStyle ||
        !COMBAT_STYLE_DEFINITIONS[
            combatStyle
        ]
    ) {

        return null;

    }


    return COMBAT_STYLE_DEFINITIONS[
        combatStyle
    ];

}


export function getCombatStyleDisplayName(
    combatStyle
) {

    const definition =
        getCombatStyleDefinition(
            combatStyle
        );


    if (!definition) {

        return "Unknown";

    }


    return definition.displayName;

}


export function isValidCombatStyle(
    combatStyle
) {

    return Boolean(
        getCombatStyleDefinition(
            combatStyle
        )
    );

}


export function isCombatStyleValidForDiscipline(
    combatStyle,
    discipline
) {

    const definition =
        getCombatStyleDefinition(
            combatStyle
        );


    if (!definition || !discipline) {

        return false;

    }


    return definition.disciplines.includes(
        discipline
    );

}


export function getCombatStylesForDiscipline(
    discipline
) {

    if (!discipline) {

        return [];

    }


    const styles =
        Object.values(
            COMBAT_STYLE_DEFINITIONS
        );


    return styles
        .filter(
            definition =>
                definition.disciplines.includes(
                    discipline
                )
        )
        .map(
            definition =>
                definition.style
        );

}


/* =======================================================
   XP DISTRIBUTION
   ======================================================= */

export function getCombatStyleXPDistribution(
    combatStyle
) {

    const definition =
        getCombatStyleDefinition(
            combatStyle
        );


    if (!definition) {

        return {

            attack: 0,

            strength: 0,

            defense: 0,

            ballistics: 0,

            flux: 0

        };

    }


    return {

        attack:
            definition.xpDistribution.attack || 0,

        strength:
            definition.xpDistribution.strength || 0,

        defense:
            definition.xpDistribution.defense || 0,

        ballistics:
            definition.xpDistribution.ballistics || 0,

        flux:
            definition.xpDistribution.flux || 0

    };

}


/* =======================================================
   ATTACK SPEED
   ======================================================= */

export function getCombatStyleAttackSpeedMultiplier(
    combatStyle
) {

    const definition =
        getCombatStyleDefinition(
            combatStyle
        );


    if (!definition) {

        return 1.00;

    }


    return Number.isFinite(
        definition.attackSpeedMultiplier
    )
        ? definition.attackSpeedMultiplier
        : 1.00;

}


/* =======================================================
   STYLE MODIFIER
   ======================================================= */

export function getCombatStyleModifier(
    combatStyle
) {

    if (
        !isValidCombatStyle(
            combatStyle
        )
    ) {

        return {

            accuracyMultiplier: 1.00,

            damageMultiplier: 1.00,

            defenseMultiplier: 1.00,

            attackSpeedMultiplier: 1.00

        };

    }


    return COMBAT_STYLE_MODIFIERS[
        combatStyle
    ];

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
   GET EQUIPMENT COMBAT BONUSES
   ======================================================= */

function getEquipmentCombatBonuses(
    attacker
) {

    if (
        !attacker ||
        !attacker.equipment
    ) {

        return {

            accuracyBonus: 0,

            damageBonus: 0,

            weaponDamage: 0

        };

    }


    const equipmentStats =
        getEquipmentStats(
            attacker.equipment
        );


    return {

        accuracyBonus:
            Number.isFinite(
                equipmentStats.accuracyBonus
            )
                ? equipmentStats.accuracyBonus
                : 0,

        damageBonus:
            Number.isFinite(
                equipmentStats.damageBonus
            )
                ? equipmentStats.damageBonus
                : 0,

        weaponDamage:
            Number.isFinite(
                equipmentStats.weaponDamage
            )
                ? equipmentStats.weaponDamage
                : 0

    };

}


/* =======================================================
   PERFORM ATTACK
   ======================================================= */

/*
 * attackPower controls ACCURACY.
 *
 * damagePower controls CHARACTER DAMAGE.
 *
 * weaponDamage controls WEAPON POWER.
 *
 * defenseOverride allows the combat system to use
 * a calculated defense value instead of relying on
 * target.defense.
 *
 * Attack skill + equipment attackBonus are supplied
 * through attackPower by combatSystem.js.
 *
 * Strength skill + equipment strengthBonus are supplied
 * through damagePower by combatSystem.js.
 *
 * Ballistics and Flux are supplied through attackPower
 * by combatSystem.js when those disciplines are active.
 *
 * Equipment accuracyBonus is added to attackPower
 * for the actual hit calculation.
 *
 * Equipment damageBonus and weaponDamage are added
 * to damagePower for the actual damage calculation.
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


    const equipmentBonuses =
        getEquipmentCombatBonuses(
            attacker
        );


    const effectiveAttackPower =
        Math.max(
            1,
            attackPower +
            equipmentBonuses.accuracyBonus
        );


    const effectiveDamagePower =
        Math.max(
            1,
            damagePower +
            equipmentBonuses.damageBonus +
            equipmentBonuses.weaponDamage
        );


    const hit =
        rollAttackHit(
            effectiveAttackPower,
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
            effectiveDamagePower,
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