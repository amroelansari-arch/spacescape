export const WORLD_WIDTH = 2400;

export const WORLD_HEIGHT = 1800;


export const obstacles = [

    {
        x: 450,
        y: 350,
        width: 300,
        height: 190
    },

    {
        x: 1350,
        y: 350,
        width: 300,
        height: 190
    },

    {
        x: 450,
        y: 1000,
        width: 300,
        height: 190
    },

    {
        x: 1350,
        y: 1000,
        width: 300,
        height: 190
    },

    {
        x: 600,
        y: 620,
        width: 35,
        height: 25
    },

    {
        x: 700,
        y: 650,
        width: 35,
        height: 25
    },

    {
        x: 1450,
        y: 620,
        width: 35,
        height: 25
    },

    {
        x: 1550,
        y: 650,
        width: 35,
        height: 25
    }

];


export function isColliding(x, y) {

    const half = 34 / 2;

    const playerLeft =
        x - half;

    const playerRight =
        x + half;

    const playerTop =
        y - half;

    const playerBottom =
        y + half;


    for (
        const obstacle of obstacles
    ) {

        const obstacleLeft =
            obstacle.x;

        const obstacleRight =
            obstacle.x +
            obstacle.width;

        const obstacleTop =
            obstacle.y;

        const obstacleBottom =
            obstacle.y +
            obstacle.height;


        if (

            playerRight > obstacleLeft &&

            playerLeft < obstacleRight &&

            playerBottom > obstacleTop &&

            playerTop < obstacleBottom

        ) {

            return true;

        }

    }


    return false;

}


export function updateCamera(
    player,
    world
) {

    const screenWidth =
        window.innerWidth;

    const screenHeight =
        window.innerHeight;


    let cameraX =
        player.position.x -
        screenWidth / 2;

    let cameraY =
        player.position.y -
        screenHeight / 2;


    cameraX =
        Math.max(
            0,
            Math.min(
                WORLD_WIDTH - screenWidth,
                cameraX
            )
        );


    cameraY =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT - screenHeight,
                cameraY
            )
        );


    world.style.left =
        -cameraX + "px";

    world.style.top =
        -cameraY + "px";

}