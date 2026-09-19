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

import {
    getPlayerCombatLevel
} from "./combatLevel.js";


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

    combatStyle:
        COMBAT_STYLES.ACCURATE,

    isDead: false,

    skills:
        createSkills(),

    inventory:
        createInventory(),

    equipment:
        createEquipment(),

    movement: {

        speed: 5,

        moving: false,

        target: null,

        /*
         * Pathfinding waypoints.
         */

        path: [],

        pathIndex: 0

    }

};


/* =======================================================
   MOVEMENT TARGET
   ======================================================= */

export function setMovementTarget(
    type,
    id,
    x,
    y,
    arrivalDistance = 0,
    path = null
) {

    if (
        typeof type !== "string" ||
        !type ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {

        return false;

    }


    if (
        !Number.isFinite(
            arrivalDistance
        ) ||
        arrivalDistance < 0
    ) {

        arrivalDistance = 0;

    }


    player.movement.target = {

        type,

        id:
            id || null,

        x,

        y,

        arrivalDistance

    };


    player.movement.path =
        Array.isArray(path)
            ? path
            : [];


    player.movement.pathIndex =
        0;


    return true;

}


export function setMovementPath(
    path
) {

    if (
        !Array.isArray(path) ||
        path.length === 0
    ) {

        player.movement.path =
            [];

        player.movement.pathIndex =
            0;

        return false;

    }


    player.movement.path =
        path;


    player.movement.pathIndex =
        0;


    return true;

}


export function getMovementTarget() {

    return player.movement.target;

}


export function clearMovementTarget() {

    player.movement.target =
        null;

    player.movement.path =
        [];

    player.movement.pathIndex =
        0;

    player.movement.moving =
        false;

}


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
   COMBAT SKILLS
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
   COMBAT LEVEL
   ======================================================= */

export function getPlayerCombatLevelValue() {

    return getPlayerCombatLevel(
        player
    );

}


/* =======================================================
   COMBAT XP
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


    player.health.current =
        0;

    player.isDead =
        true;

    clearMovementTarget();


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


    player.isDead =
        false;

    clearMovementTarget();


    console.log(
        `Player respawned at ` +
        `${player.position.x}, ${player.position.y}.`
    );

}


/* =======================================================
   GET CURRENT MOVEMENT POINT
   ======================================================= */

function getCurrentMovementPoint() {

    const path =
        player.movement.path;


    const index =
        player.movement.pathIndex;


    if (
        Array.isArray(path) &&
        index < path.length
    ) {

        return path[index];

    }


    if (
        player.movement.target
    ) {

        return {

            x:
                player.movement.target.x,

            y:
                player.movement.target.y

        };

    }


    return null;

}


/* =======================================================
   ADVANCE PATH
   ======================================================= */

function advanceMovementPath() {

    if (
        !Array.isArray(
            player.movement.path
        )
    ) {

        return;

    }


    player.movement.pathIndex++;


    if (
        player.movement.pathIndex >=
        player.movement.path.length
    ) {

        player.movement.path =
            [];

        player.movement.pathIndex =
            0;

    }

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


    /* ===================================================
       KEYBOARD MOVEMENT
       =================================================== */

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


    /*
     * Manual movement cancels automatic
     * pathfinding.
     */

    if (
        dx !== 0 ||
        dy !== 0
    ) {

        clearMovementTarget();

    }


    /* ===================================================
       AUTOMATIC PATH MOVEMENT
       =================================================== */

    if (
        dx === 0 &&
        dy === 0 &&
        player.movement.target
    ) {

        const target =
            player.movement.target;


        const movementPoint =
            getCurrentMovementPoint();


        if (!movementPoint) {

            player.movement.moving =
                false;

            return;

        }


        const targetDX =
            movementPoint.x -
            player.position.x;


        const targetDY =
            movementPoint.y -
            player.position.y;


        const distance =
            Math.sqrt(
                targetDX * targetDX +
                targetDY * targetDY
            );


        /*
         * Waypoints can be reached with a
         * small tolerance.
         */

        const isFinalPoint =
            !Array.isArray(
                player.movement.path
            ) ||
            player.movement.pathIndex >=
                player.movement.path.length - 1;


        const arrivalDistance =
            isFinalPoint
                ? target.arrivalDistance
                : 2;


        /*
         * Waypoint reached.
         */

        if (
            distance <=
            arrivalDistance
        ) {

            /*
             * If this was the final point,
             * snap exactly to the destination.
             */

            if (
                isFinalPoint &&
                target.type === "ground"
            ) {

                player.position.x =
                    target.x;

                player.position.y =
                    target.y;

            }


            if (
                !isFinalPoint
            ) {

                advanceMovementPath();

            } else {

                clearMovementTarget();

            }


            return;

        }


        /*
         * Move toward current waypoint.
         */

        dx =
            targetDX /
            distance;

        dy =
            targetDY /
            distance;

    }


    /* ===================================================
       NO MOVEMENT
       =================================================== */

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


    const movementPoint =
        getCurrentMovementPoint();


    /*
     * Prevent overshooting a waypoint.
     */

    if (movementPoint) {

        const remainingX =
            movementPoint.x -
            player.position.x;

        const remainingY =
            movementPoint.y -
            player.position.y;

        const remainingDistance =
            Math.sqrt(
                remainingX * remainingX +
                remainingY * remainingY
            );


        if (
            remainingDistance <=
            player.movement.speed
        ) {

            player.position.x =
                movementPoint.x;

            player.position.y =
                movementPoint.y;


            const path =
                player.movement.path;


            const index =
                player.movement.pathIndex;


            if (
                Array.isArray(path) &&
                index <
                    path.length - 1
            ) {

                advanceMovementPath();

                return;

            }


            if (
                player.movement.target
            ) {

                const target =
                    player.movement.target;


                if (
                    target.type ===
                    "ground"
                ) {

                    player.position.x =
                        target.x;

                    player.position.y =
                        target.y;

                }

            }


            clearMovementTarget();

            return;

        }

    }


    const newX =
        player.position.x +
        dx;


    const newY =
        player.position.y +
        dy;


    /* ===================================================
       X COLLISION
       =================================================== */

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


    /* ===================================================
       Y COLLISION
       =================================================== */

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
     * The top-left HUD Level is the
     * player's overall Combat Level.
     *
     * It is NOT the Attack level.
     *
     * Combat Level is calculated from:
     *
     * Attack
     * Strength
     * Defense
     * Vitality
     *
     * through combatLevel.js.
     */

    const combatLevel =
        getPlayerCombatLevel(
            player
        );


    /*
     * Keep the existing XP display tied
     * to Attack XP for now.
     *
     * This can be changed later if we
     * decide the HUD should display
     * overall Combat XP instead.
     */

    const attackLevel =
        getPlayerAttackLevel();


    const attackXP =
        getPlayerAttackXP();


    if (levelElement) {

        levelElement.textContent =
            combatLevel;

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