import { createSkills } from "./skills.js";
import { createInventory } from "./inventory.js";
import { createEquipment } from "./equipment.js";

import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    isColliding
} from "./world.js";

import {
    getXPRequiredForLevel,
    getXPToNextLevel
} from "./xp.js";


/* =======================================================
   PLAYER
   ======================================================= */

export const player = {
    position: {
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

    level: 1,

    xp: 0,

    attack: 10,

    defense: 5,

    skills: createSkills(),

    inventory: createInventory(),

    equipment: createEquipment(),

    movement: {
        speed: 5,
        moving: false
    }
};


/* =======================================================
   LEVEL UP
   ======================================================= */

export function applyLevelUp() {

    player.health.maximum += 10;

    player.energy.maximum += 10;

    player.attack += 2;

    player.defense += 1;

    player.health.current =
        player.health.maximum;

    player.energy.current =
        player.energy.maximum;

    console.log(
        `Level up! Player is now level ${player.level}.`
    );

    console.log(
        `Stats increased: ` +
        `Health ${player.health.maximum}, ` +
        `Energy ${player.energy.maximum}, ` +
        `Attack ${player.attack}, ` +
        `Defense ${player.defense}.`
    );
}


/* =======================================================
   MOVEMENT
   ======================================================= */

export function updatePlayerMovement() {

    if (
        document
            .getElementById("dialogue")
            ?.classList
            .contains("active")
    ) {
        player.movement.moving = false;
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
        player.movement.moving = false;
        return;
    }

    player.movement.moving = true;

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
        player.position.x + dx;

    const newY =
        player.position.y + dy;

    if (
        newX >= 0 &&
        newX <= WORLD_WIDTH &&
        !isColliding(
            newX,
            player.position.y
        )
    ) {
        player.position.x = newX;
    }

    if (
        newY >= 0 &&
        newY <= WORLD_HEIGHT &&
        !isColliding(
            player.position.x,
            newY
        )
    ) {
        player.position.y = newY;
    }
}


/* =======================================================
   DRAW PLAYER
   ======================================================= */

export function drawPlayer() {

    const playerElement =
        document.getElementById("player");

    if (!playerElement) {
        return;
    }

    playerElement.style.left =
        `${player.position.x}px`;

    playerElement.style.top =
        `${player.position.y}px`;
}


/* =======================================================
   PLAYER HUD
   ======================================================= */

export function updatePlayerHUD() {

    const levelElement =
        document.getElementById("level");

    const xpElement =
        document.getElementById("xp");

    const healthElement =
        document.getElementById("health");

    const healthBar =
        document.getElementById("health-bar");

    const energyElement =
        document.getElementById("energy");

    const energyBar =
        document.getElementById("energy-bar");


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