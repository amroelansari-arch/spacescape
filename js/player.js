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
    getXPToNextLevel
} from "./xp.js";

import {
    getSkillLevel,
    getSkillXPToNextLevel
} from "./skills.js";


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


    /*
     * Health remains a direct player resource for now.
     *
     * Later, maximum health will be derived from
     * the Vitality skill.
     */

    health: {
        current: 100,
        maximum: 100
    },


    /*
     * Energy remains in the player architecture,
     * but we are NOT implementing Energy abilities
     * or regeneration in this batch.
     */

    energy: {
        current: 100,
        maximum: 100
    },


    /*
     * LEGACY PLAYER LEVEL
     *
     * This remains temporarily because the current
     * combat system still uses the generic XP system.
     *
     * It will eventually be replaced by calculated
     * SpaceScape Combat Level.
     */

    level: 1,

    xp: 0,


    /*
     * LEGACY COMBAT STATS
     *
     * These remain temporarily so existing combat
     * continues functioning while the new skill
     * architecture is introduced.
     */

    attack: 10,

    defense: 5,


    isDead: false,


    /*
     * Individual SpaceScape skills.
     *
     * These are now the foundation of the long-term
     * character progression system.
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
   COMBAT SKILL HELPERS
   ======================================================= */

/*
 * These functions expose the new individual combat
 * skills without changing the existing combat system yet.
 */


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
   COMBAT SKILL XP
   ======================================================= */

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
   LEGACY LEVEL UP
   ======================================================= */

/*
 * TEMPORARY
 *
 * The current combat system still uses the generic
 * player level. Therefore this function remains intact
 * for this batch.
 *
 * We will replace this system after the individual
 * combat skills and combat styles are implemented.
 */

export function applyLevelUp() {

    player.health.maximum += 10;

    player.energy.maximum += 10;

    player.attack += 2;

    player.defense += 1;


    /*
     * Leveling increases maximum HP and Energy,
     * but does not automatically restore either one.
     */

    console.log(
        `Level up! Player is now level ${player.level}.`
    );

    console.log(
        `Legacy stats increased: ` +
        `Health ${player.health.maximum}, ` +
        `Energy ${player.energy.maximum}, ` +
        `Attack ${player.attack}, ` +
        `Defense ${player.defense}.`
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
     * The current HUD still displays the legacy
     * player level and XP.
     *
     * This will be changed to Combat Level and
     * individual skill information when the
     * Character Interface is built.
     */

    if (levelElement) {

        levelElement.textContent =
            player.level;

    }


    if (xpElement) {

        xpElement.textContent =
            player.xp;

        xpElement.title =
            `${getXPToNextLevel(player)} XP to next level`;

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