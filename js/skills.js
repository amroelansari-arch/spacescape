/* =======================================================
   SKILL DEFINITIONS
   ======================================================= */

export const SKILL_NAMES = {

    ATTACK: "attack",
    STRENGTH: "strength",
    DEFENSE: "defense",
    VITALITY: "vitality",

    BALLISTICS: "ballistics",
    FLUX: "flux",

    MINING: "mining",
    SALVAGING: "salvaging",
    XENOBIOLOGY: "xenobiology",
    ENGINEERING: "engineering",
    CRAFTING: "crafting",
    HACKING: "hacking",
    NAVIGATION: "navigation"

};


/* =======================================================
   SKILL CHANGE LISTENERS
   ======================================================= */

const skillChangeListeners =
    new Set();


export function subscribeToSkillChanges(
    listener
) {

    if (
        typeof listener !==
        "function"
    ) {

        return () => {};

    }


    skillChangeListeners.add(
        listener
    );


    return () => {

        skillChangeListeners.delete(
            listener
        );

    };

}


function notifySkillChanged(
    skills,
    skillName,
    result
) {

    for (
        const listener
        of skillChangeListeners
    ) {

        try {

            listener(
                skills,
                skillName,
                result
            );

        } catch (error) {

            console.error(
                "Skill listener error:",
                error
            );

        }

    }

}


/* =======================================================
   CREATE SKILLS
   ======================================================= */

export function createSkills() {

    return {

        /*
         * MELEE COMBAT
         */

        attack: {
            level: 1,
            xp: 0
        },

        strength: {
            level: 1,
            xp: 0
        },

        defense: {
            level: 1,
            xp: 0
        },


        /*
         * GENERAL COMBAT
         */

        vitality: {
            level: 1,
            xp: 0
        },


        /*
         * RANGED / EXOTIC COMBAT
         */

        ballistics: {
            level: 1,
            xp: 0
        },

        flux: {
            level: 1,
            xp: 0
        },


        /*
         * NON-COMBAT SKILLS
         */

        mining: {
            level: 1,
            xp: 0
        },

        salvaging: {
            level: 1,
            xp: 0
        },

        xenobiology: {
            level: 1,
            xp: 0
        },

        engineering: {
            level: 1,
            xp: 0
        },

        crafting: {
            level: 1,
            xp: 0
        },

        hacking: {
            level: 1,
            xp: 0
        },

        navigation: {
            level: 1,
            xp: 0
        }

    };

}


/* =======================================================
   SKILL XP
   ======================================================= */

export function getSkillXPRequiredForLevel(
    level
) {

    if (
        !Number.isFinite(level) ||
        level < 1
    ) {

        return 100;

    }


    return Math.floor(
        100 *
        Math.pow(
            level,
            1.5
        )
    );

}


/* =======================================================
   SKILL ACCESS
   ======================================================= */

export function getSkill(
    skills,
    skillName
) {

    if (
        !skills ||
        typeof skills !== "object" ||
        !skills[skillName]
    ) {

        return null;

    }


    return skills[skillName];

}


/* =======================================================
   SKILL LEVEL
   ======================================================= */

export function getSkillLevel(
    skills,
    skillName
) {

    const skill =
        getSkill(
            skills,
            skillName
        );


    if (
        !skill ||
        !Number.isFinite(
            skill.level
        )
    ) {

        return 1;

    }


    return skill.level;

}


/* =======================================================
   CURRENT SKILL XP
   ======================================================= */

export function getCurrentSkillXP(
    skills,
    skillName
) {

    const skill =
        getSkill(
            skills,
            skillName
        );


    if (
        !skill ||
        !Number.isFinite(
            skill.xp
        )
    ) {

        return 0;

    }


    return skill.xp;

}


/* =======================================================
   XP TO NEXT LEVEL
   ======================================================= */

export function getSkillXPToNextLevel(
    skills,
    skillName
) {

    const skill =
        getSkill(
            skills,
            skillName
        );


    if (
        !skill ||
        !Number.isFinite(
            skill.level
        ) ||
        !Number.isFinite(
            skill.xp
        )
    ) {

        return 0;

    }


    if (
        skill.level >= 99
    ) {

        return 0;

    }


    return Math.max(

        0,

        getSkillXPRequiredForLevel(
            skill.level
        ) -
        skill.xp

    );

}


/* =======================================================
   AWARD SKILL XP
   ======================================================= */

export function awardSkillXP(
    skills,
    skillName,
    amount
) {

    const skill =
        getSkill(
            skills,
            skillName
        );


    if (!skill) {

        return {

            awarded: 0,
            levelsGained: 0,
            previousLevel: 0,
            currentLevel: 0,
            leveledUp: false

        };

    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return {

            awarded: 0,
            levelsGained: 0,

            previousLevel:
                skill.level,

            currentLevel:
                skill.level,

            leveledUp: false

        };

    }


    const previousLevel =
        skill.level;


    if (
        skill.level >= 99
    ) {

        skill.level = 99;
        skill.xp = 0;


        const result = {

            awarded: 0,

            levelsGained: 0,

            previousLevel: 99,

            currentLevel: 99,

            leveledUp: false

        };


        notifySkillChanged(
            skills,
            skillName,
            result
        );


        return result;

    }


    skill.xp += amount;


    let levelsGained =
        0;


    while (
        skill.level < 99 &&
        skill.xp >=
        getSkillXPRequiredForLevel(
            skill.level
        )
    ) {

        skill.xp -=
            getSkillXPRequiredForLevel(
                skill.level
            );


        skill.level++;

        levelsGained++;

    }


    if (
        skill.level >= 99
    ) {

        skill.level = 99;
        skill.xp = 0;

    }


    const result = {

        awarded:
            amount,

        levelsGained,

        previousLevel,

        currentLevel:
            skill.level,

        leveledUp:
            levelsGained > 0

    };


    notifySkillChanged(
        skills,
        skillName,
        result
    );


    /*
     * Emit a browser event for player-facing
     * progression UI.
     */

    if (
        result.leveledUp &&
        typeof window !==
        "undefined"
    ) {

        window.dispatchEvent(

            new CustomEvent(
                "spacescape:skillLevelUp",
                {

                    detail: {

                        skillName,

                        previousLevel,

                        currentLevel:
                            skill.level,

                        levelsGained

                    }

                }
            )

        );

    }


    return result;

}


/* =======================================================
   COMBAT SKILLS
   ======================================================= */

/*
 * All six skills that participate directly
 * in the combat system.
 *
 * Melee:
 *   Attack
 *   Strength
 *   Defense
 *
 * General:
 *   Vitality
 *
 * Ranged / Exotic:
 *   Ballistics
 *   Flux
 */

export function getCombatSkills(
    skills
) {

    if (
        !skills ||
        typeof skills !== "object"
    ) {

        return null;

    }


    return {

        attack:
            skills.attack,

        strength:
            skills.strength,

        defense:
            skills.defense,

        vitality:
            skills.vitality,

        ballistics:
            skills.ballistics,

        flux:
            skills.flux

    };

}


/* =======================================================
   SPECIALIZED COMBAT SKILLS
   ======================================================= */

/*
 * Ballistics and Flux are the two combat
 * disciplines outside of the three-part
 * Melee system.
 */

export function getSpecializedCombatSkills(
    skills
) {

    if (
        !skills ||
        typeof skills !== "object"
    ) {

        return null;

    }


    return {

        ballistics:
            skills.ballistics,

        flux:
            skills.flux

    };

}