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

    skills: createSkills(),

    inventory: createInventory(),

    equipment: createEquipment(),

    movement: {
        speed: 5,
        moving: false
    }
};

export function updatePlayerMovement(keys, dialogueOpen) {
    if (dialogueOpen) {
        player.movement.moving = false;
        return;
    }

    let dx = 0;
    let dy = 0;

    if (keys.w || keys.ArrowUp) {
        dy -= 1;
    }

    if (keys.s || keys.ArrowDown) {
        dy += 1;
    }

    if (keys.a || keys.ArrowLeft) {
        dx -= 1;
    }

    if (keys.d || keys.ArrowRight) {
        dx += 1;
    }

    if (dx === 0 && dy === 0) {
        player.movement.moving = false;
        return;
    }

    player.movement.moving = true;

    if (dx !== 0 && dy !== 0) {
        const diagonalSpeed =
            player.movement.speed / Math.sqrt(2);

        dx *= diagonalSpeed;
        dy *= diagonalSpeed;
    } else {
        dx *= player.movement.speed;
        dy *= player.movement.speed;
    }

    const newX = player.position.x + dx;
    const newY = player.position.y + dy;

    const minX = 20;
    const maxX = WORLD_WIDTH - 20;
    const minY = 20;
    const maxY = WORLD_HEIGHT - 20;

    const boundedX = Math.max(
        minX,
        Math.min(maxX, newX)
    );

    const boundedY = Math.max(
        minY,
        Math.min(maxY, newY)
    );

    if (!isColliding(boundedX, player.position.y)) {
        player.position.x = boundedX;
    }

    if (!isColliding(player.position.x, boundedY)) {
        player.position.y = boundedY;
    }
}

export function drawPlayer(playerElement) {
    playerElement.style.left =
        `${player.position.x - 17}px`;

    playerElement.style.top =
        `${player.position.y - 17}px`;
}

export function updatePlayerHUD(elements) {
    const {
        levelElement,
        xpElement,
        healthCurrentElement,
        healthMaximumElement,
        healthFillElement,
        energyCurrentElement,
        energyMaximumElement,
        energyFillElement
    } = elements;

    levelElement.textContent =
        player.level;

    xpElement.textContent =
        player.xp;

    healthCurrentElement.textContent =
        Math.floor(player.health.current);

    healthMaximumElement.textContent =
        Math.floor(player.health.maximum);

    energyCurrentElement.textContent =
        Math.floor(player.energy.current);

    energyMaximumElement.textContent =
        Math.floor(player.energy.maximum);

    const healthPercent =
        (player.health.current /
            player.health.maximum) * 100;

    const energyPercent =
        (player.energy.current /
            player.energy.maximum) * 100;

    healthFillElement.style.width =
        `${Math.max(0, Math.min(100, healthPercent))}%`;

    energyFillElement.style.width =
        `${Math.max(0, Math.min(100, energyPercent))}%`;

    levelElement.title =
        `Level ${player.level}`;

    xpElement.title =
        `${getXPToNextLevel(player)} XP needed for Level ${player.level + 1}`;
}