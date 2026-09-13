import { createSkills } from "./skills.js";

import {
    createInventory
} from "./inventory.js";

import {
    createEquipment
} from "./equipment.js";

import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    isColliding
} from "./world.js";

import {
    getSkillLevel,
    getCurrentSkillXP,
    getSkillXPToNextLevel
} from "./skills.js";

import {
    COMBAT_STYLES,
    isValidCombatStyle
} from "./combat.js";


/* =======================================================
   PLAYER
   ======================================================= */

export const player = {

    position: {
        x: 1200,
        y: 900
    },

    respawnPosition: {
        x: 1200,
        y: 900
    },

    health: {
        current: 100,
        maximum: 100
    },

    energy: {
        current: 100,
        maximum: 100
    },


    /*
     * Current combat stats.
     *
     * These remain temporarily while the combat
     * calculation is transitioned to use the
     * individual combat skills directly.
     */

    attack: 10,

    defense: 5,


    /*
     * Current passive combat style.
     *
     * Accurate is the default.
     */

    combatStyle:
        COMBAT_STYLES.ACCURATE,


    isDead: false,


    /*
     * Individual SpaceScape skills.
     *
     * These are now the authoritative progression
     * system for player skills.
     */

    skills:
        createSkills(),


    inventory:
        createInventory(),


    equipment:
        createEquipment(),


    movement: {

        speed: 5,

        moving: false

    }

};


/* =======================================================
   COMBAT STYLE
   ======================================================= */

export function setCombatStyle(
    combatStyle
) {

    if (
        !isValidCombatStyle(
            combatStyle
        )
    ) {

        return false;

    }


    player.combatStyle =
        combatStyle;


    console.log(
        `Combat style changed to: ${combatStyle}`
    );


    return true;

}


export function getCombatStyle() {

    return player.combatStyle;

}


/* =======================================================
   COMBAT SKILL HELPERS
   ======================================================= */

export function getPlayerAttackLevel() {

    return getSkillLevel(
        player.skills,
        "attack"
    );

}


export function getPlayerStrengthLevel() {

    return getSkillLevel(
        player.skills,
        "strength"
    );

}


export function getPlayerDefenseLevel() {

    return getSkillLevel(
        player.skills,
        "defense"
    );

}


export function getPlayerVitalityLevel() {

    return getSkillLevel(
        player.skills,
        "vitality"
    );

}


/* =======================================================
   COMBAT SKILL XP HELPERS
   ======================================================= */

export function getPlayerAttackXP() {

    return getCurrentSkillXP(
        player.skills,
        "attack"
    );

}


export function getPlayerStrengthXP() {

    return getCurrentSkillXP(
        player.skills,
        "strength"
    );

}


export function getPlayerDefenseXP() {

    return getCurrentSkillXP(
        player.skills,
        "defense"
    );

}


export function getPlayerVitalityXP() {

    return getCurrentSkillXP(
        player.skills,
        "vitality"
    );

}


export function getPlayerAttackXPToNextLevel() {

    return getSkillXPToNextLevel(
        player.skills,
        "attack"
    );

}


export function getPlayerStrengthXPToNextLevel() {

    return getSkillXPToNextLevel(
        player.skills,
        "strength"
    );

}


export function getPlayerDefenseXPToNextLevel() {

    return getSkillXPToNextLevel(
        player.skills,
        "defense"
    );

}


export function getPlayerVitalityXPToNextLevel() {

    return getSkillXPToNextLevel(
        player.skills,
        "vitality"
    );

}


/* =======================================================
   PLAYER DEATH
   ======================================================= */

export function handlePlayerDeath() {

    if (player.isDead) {

        return false;

    }


    player.health.current = 0;

    player.isDead = true;

    player.movement.moving = false;


    console.log(
        "Player died."
    );


    return true;

}


/* =======================================================
   PLAYER RESPAWN
   ======================================================= */

export function respawnPlayer() {

    player.position.x =
        player.respawnPosition.x;

    player.position.y =
        player.respawnPosition.y;


    player.health.current =
        player.health.maximum;

    player.energy.current =
        player.energy.maximum;


    player.isDead = false;

    player.movement.moving = false;


    console.log(
        `Player respawned at ` +
        `${player.position.x}, ${player.position.y}.`
    );

}


/* =======================================================
   MOVEMENT
   ======================================================= */

export function updatePlayerMovement() {

    if (player.isDead) {

        player.movement.moving =
            false;

        return;

    }


    if (
        document
            .getElementById("dialogue")
            ?.classList
            .contains("active")
    ) {

        player.movement.moving =
            false;

        return;

    }


    let dx = 0;

    let dy = 0;


    if (
        keys["w"] ||
        keys["ArrowUp"]
    ) {

        dy -= 1;

    }


    if (
        keys["s"] ||
        keys["ArrowDown"]
    ) {

        dy += 1;

    }


    if (
        keys["a"] ||
        keys["ArrowLeft"]
    ) {

        dx -= 1;

    }


    if (
        keys["d"] ||
        keys["ArrowRight"]
    ) {

        dx += 1;

    }


    if (
        dx === 0 &&
        dy === 0
    ) {

        player.movement.moving =
            false;

        return;

    }


    player.movement.moving =
        true;


    const magnitude =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    dx =
        dx /
        magnitude *
        player.movement.speed;


    dy =
        dy /
        magnitude *
        player.movement.speed;


    const newX =
        player.position.x +
        dx;


    const newY =
        player.position.y +
        dy;


    if (
        newX >= 0 &&
        newX <= WORLD_WIDTH &&
        !isColliding(
            newX,
            player.position.y
        )
    ) {

        player.position.x =
            newX;

    }


    if (
        newY >= 0 &&
        newY <= WORLD_HEIGHT &&
        !isColliding(
            player.position.x,
            newY
        )
    ) {

        player.position.y =
            newY;

    }

}


/* =======================================================
   DRAW PLAYER
   ======================================================= */

export function drawPlayer() {

    const playerElement =
        document.getElementById(
            "player"
        );


    if (!playerElement) {

        return;

    }


    playerElement.style.left =
        `${player.position.x}px`;


    playerElement.style.top =
        `${player.position.y}px`;


    playerElement.style.opacity =
        player.isDead
            ? "0.45"
            : "1";

}


/* =======================================================
   PLAYER HUD
   ======================================================= */

export function updatePlayerHUD() {

    const levelElement =
        document.getElementById(
            "level"
        );


    const xpElement =
        document.getElementById(
            "xp"
        );


    const healthElement =
        document.getElementById(
            "health"
        );


    const healthBar =
        document.getElementById(
            "health-bar"
        );


    const energyElement =
        document.getElementById(
            "energy"
        );


    const energyBar =
        document.getElementById(
            "energy-bar"
        );


    /*
     * The old generic player level and XP system
     * has been retired.
     *
     * Until the permanent Character Interface is
     * built, the existing HUD uses Attack as the
     * temporary primary combat progression display.
     */

    const attackLevel =
        getPlayerAttackLevel();


    const attackXP =
        getPlayerAttackXP();


    if (levelElement) {

        levelElement.textContent =
            attackLevel;

    }


    if (xpElement) {

        xpElement.textContent =
            attackXP;

        xpElement.title =
            `${getPlayerAttackXPToNextLevel()} XP to Attack level ${attackLevel + 1}`;

    }


    if (healthElement) {

        healthElement.textContent =
            `${player.health.current}/${player.health.maximum}`;

    }


    if (healthBar) {

        healthBar.style.width =
            `${(
                player.health.current /
                player.health.maximum
            ) * 100}%`;

    }


    if (energyElement) {

        energyElement.textContent =
            `${player.energy.current}/${player.energy.maximum}`;

    }


    if (energyBar) {

        energyBar.style.width =
            `${(
                player.energy.current /
                player.energy.maximum
            ) * 100}%`;

    }

}


/* =======================================================
   KEYBOARD INPUT
   ======================================================= */

const keys = {};


window.addEventListener(
    "keydown",
    event => {

        keys[event.key] = true;

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.key] = false;

    }
);