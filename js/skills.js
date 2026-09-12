export function createSkills() {

    return {

        ballistics: {
            level: 1,
            xp: 0
        },

        energyWeapons: {
            level: 1,
            xp: 0
        },

        defense: {
            level: 1,
            xp: 0
        },

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

    if (level < 1) {
        return 100;
    }

    return Math.floor(
        100 * Math.pow(level, 1.5)
    );
}


/* =======================================================
   SKILL ACCESS
   ======================================================= */

export function getSkill(skills, skillName) {

    if (!skills || !skills[skillName]) {
        return null;
    }

    return skills[skillName];
}


/* =======================================================
   CURRENT SKILL XP
   ======================================================= */

export function getCurrentSkillXP(skills, skillName) {

    const skill =
        getSkill(skills, skillName);

    if (!skill) {
        return 0;
    }

    return skill.xp;
}


/* =======================================================
   XP TO NEXT SKILL LEVEL
   ======================================================= */

export function getSkillXPToNextLevel(skills, skillName) {

    const skill =
        getSkill(skills, skillName);

    if (!skill) {
        return 0;
    }

    return Math.max(
        0,
        getSkillXPRequiredForLevel(skill.level) -
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
        getSkill(skills, skillName);

    if (!skill) {
        return;
    }

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return;
    }

    skill.xp += amount;

    while (
        skill.xp >=
        getSkillXPRequiredForLevel(skill.level)
    ) {

        skill.xp -=
            getSkillXPRequiredForLevel(skill.level);

        skill.level++;
    }
}