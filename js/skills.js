/* =======================================================
   SKILL DEFINITIONS
   ======================================================= */

export const SKILL_NAMES = {

    ATTACK: "attack",

    STRENGTH: "strength",

    DEFENSE: "defense",

    VITALITY: "vitality",

    BALLISTICS: "ballistics",

    ENERGY_WEAPONS: "energyWeapons",

    MINING: "mining",

    SALVAGING: "salvaging",

    XENOBIOLOGY: "xenobiology",

    ENGINEERING: "engineering",

    CRAFTING: "crafting",

    HACKING: "hacking",

    NAVIGATION: "navigation"

};


/* =======================================================
   CREATE SKILLS
   ======================================================= */

export function createSkills() {

    return {

        /*
         * Core combat skills.
         *
         * These are the four skills that will eventually
         * determine the player's primary combat progression.
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

        vitality: {
            level: 1,
            xp: 0
        },


        /*
         * Specialized combat / technology skills.
         */

        ballistics: {
            level: 1,
            xp: 0
        },

        energyWeapons: {
            level: 1,
            xp: 0
        },


        /*
         * Non-combat skills.
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

export function getSkillXPRequiredForLevel(level) {

    if (
        !Number.isFinite(level) ||
        level < 1
    ) {
        return 100;
    }

    /*
     * Maximum skill level is currently 99.
     *
     * We are keeping the existing XP curve for now.
     * The exact SpaceScape XP curve can be tuned later.
     */

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
        !Number.isFinite(skill.level)
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
        !Number.isFinite(skill.xp)
    ) {
        return 0;
    }

    return skill.xp;

}


/* =======================================================
   XP TO NEXT SKILL LEVEL
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
        !Number.isFinite(skill.level) ||
        !Number.isFinite(skill.xp)
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
            currentLevel: 0
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
                skill.level
        };

    }

    /*
     * Skills currently cap at level 99.
     */

    const previousLevel =
        skill.level;

    /*
     * If the skill is already at 99,
     * it cannot progress further.
     */

    if (
        skill.level >= 99
    ) {

        skill.level = 99;

        skill.xp = 0;

        return {
            awarded: 0,
            levelsGained: 0,
            previousLevel: 99,
            currentLevel: 99
        };

    }


    skill.xp += amount;

    let levelsGained = 0;


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


    /*
     * Level 99 has no further progression.
     */

    if (
        skill.level >= 99
    ) {

        skill.level = 99;

        skill.xp = 0;

    }


    return {
        awarded: amount,
        levelsGained,
        previousLevel,
        currentLevel:
            skill.level
    };

}


/* =======================================================
   COMBAT SKILL ACCESS
   ======================================================= */

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
            skills.vitality

    };

}


/* =======================================================
   SPECIALIZED COMBAT SKILLS
   ======================================================= */

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

        energyWeapons:
            skills.energyWeapons

    };

}