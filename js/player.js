import { createSkills } from "./skills.js";

import { createInventory } from "./inventory.js";

import { createEquipment } from "./equipment.js";

import {
    isColliding,
    WORLD_WIDTH,
    WORLD_HEIGHT
} from "./world.js";


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


export function updatePlayerMovement(
    keys,
    dialogueOpen
) {

    if (dialogueOpen) {

        player.movement.moving =
            false;

        return;

    }


    let newX =
        player.position.x;

    let newY =
        player.position.y;


    let moving =
        false;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        newY -=
            player.movement.speed;

        moving = true;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        newY +=
            player.movement.speed;

        moving = true;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        newX -=
            player.movement.speed;

        moving = true;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        newX +=
            player.movement.speed;

        moving = true;

    }


    player.movement.moving =
        moving;


    if (
        !isColliding(
            newX,
            player.position.y
        )
    ) {

        player.position.x =
            newX;

    }


    if (
        !isColliding(
            player.position.x,
            newY
        )
    ) {

        player.position.y =
            newY;

    }


    player.position.x =
        Math.max(
            20,
            Math.min(
                WORLD_WIDTH - 20,
                player.position.x
            )
        );


    player.position.y =
        Math.max(
            20,
            Math.min(
                WORLD_HEIGHT - 20,
                player.position.y
            )
        );

}


export function drawPlayer(
    playerElement
) {

    playerElement.style.left =
        player.position.x + "px";

    playerElement.style.top =
        player.position.y + "px";

}


export function updatePlayerHUD(
    elements
) {

    elements.level.textContent =
        player.level;

    elements.health.textContent =
        player.health.current;

    elements.energy.textContent =
        player.energy.current;

    elements.xp.textContent =
        player.xp;


    const healthPercent =
        (
            player.health.current /
            player.health.maximum
        ) * 100;


    const energyPercent =
        (
            player.energy.current /
            player.energy.maximum
        ) * 100;


    elements.healthBar.style.width =
        healthPercent + "%";

    elements.energyBar.style.width =
        energyPercent + "%";

}