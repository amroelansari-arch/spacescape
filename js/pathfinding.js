import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    obstacles
} from "./world.js";


/* =======================================================
   PATHFINDING SETTINGS
   ======================================================= */

/*
 * Smaller cells = more precise paths.
 * Larger cells = faster calculations.
 *
 * 25px gives us a good balance for the current world.
 */

const GRID_SIZE = 25;


/*
 * Player collision half-width from world.js.
 *
 * The player is approximately 34px wide, so we
 * inflate obstacles by half that width plus a
 * small safety margin.
 */

const PLAYER_HALF_SIZE = 17;

const SAFETY_MARGIN = 3;


/* =======================================================
   GRID HELPERS
   ======================================================= */

function getGridWidth() {

    return Math.ceil(
        WORLD_WIDTH /
        GRID_SIZE
    );

}


function getGridHeight() {

    return Math.ceil(
        WORLD_HEIGHT /
        GRID_SIZE
    );

}


function worldToGrid(
    x,
    y
) {

    return {

        x: Math.max(
            0,
            Math.min(
                getGridWidth() - 1,
                Math.floor(
                    x / GRID_SIZE
                )
            )
        ),

        y: Math.max(
            0,
            Math.min(
                getGridHeight() - 1,
                Math.floor(
                    y / GRID_SIZE
                )
            )
        )

    };

}


function gridToWorld(
    gridX,
    gridY
) {

    return {

        x:
            gridX * GRID_SIZE +
            GRID_SIZE / 2,

        y:
            gridY * GRID_SIZE +
            GRID_SIZE / 2

    };

}


/* =======================================================
   OBSTACLE INFLATION
   ======================================================= */

function isPointBlocked(
    x,
    y
) {

    const padding =
        PLAYER_HALF_SIZE +
        SAFETY_MARGIN;


    for (
        const obstacle
        of obstacles
    ) {

        const left =
            obstacle.x -
            padding;

        const right =
            obstacle.x +
            obstacle.width +
            padding;

        const top =
            obstacle.y -
            padding;

        const bottom =
            obstacle.y +
            obstacle.height +
            padding;


        if (
            x >= left &&
            x <= right &&
            y >= top &&
            y <= bottom
        ) {

            return true;

        }

    }


    return false;

}


/* =======================================================
   LINE / RECTANGLE COLLISION
   ======================================================= */

function lineIntersectsRectangle(
    x1,
    y1,
    x2,
    y2,
    rectangle
) {

    const padding =
        PLAYER_HALF_SIZE +
        SAFETY_MARGIN;


    const left =
        rectangle.x -
        padding;

    const right =
        rectangle.x +
        rectangle.width +
        padding;

    const top =
        rectangle.y -
        padding;

    const bottom =
        rectangle.y +
        rectangle.height +
        padding;


    /*
     * Liang-Barsky style segment test.
     */

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    let tMin = 0;
    let tMax = 1;


    const checks = [

        [-dx, x1 - left],

        [ dx, right - x1],

        [-dy, y1 - top],

        [ dy, bottom - y1]

    ];


    for (
        const [p, q]
        of checks
    ) {

        if (p === 0) {

            if (q < 0) {
                return false;
            }

            continue;

        }


        const t =
            q / p;


        if (p < 0) {

            if (t > tMax) {
                return false;
            }

            if (t > tMin) {
                tMin = t;
            }

        } else {

            if (t < tMin) {
                return false;
            }

            if (t < tMax) {
                tMax = t;
            }

        }

    }


    return true;

}


/* =======================================================
   PATH CLEAR TEST
   ======================================================= */

function isPathClear(
    x1,
    y1,
    x2,
    y2
) {

    /*
     * World bounds.
     */

    if (
        x2 < PLAYER_HALF_SIZE ||
        x2 > WORLD_WIDTH - PLAYER_HALF_SIZE ||
        y2 < PLAYER_HALF_SIZE ||
        y2 > WORLD_HEIGHT - PLAYER_HALF_SIZE
    ) {

        return false;

    }


    for (
        const obstacle
        of obstacles
    ) {

        if (
            lineIntersectsRectangle(
                x1,
                y1,
                x2,
                y2,
                obstacle
            )
        ) {

            return false;

        }

    }


    return true;

}


/* =======================================================
   GRID NODE
   ======================================================= */

function createNode(
    x,
    y
) {

    return {

        x,
        y,

        g: Infinity,

        h: 0,

        f: Infinity,

        parent: null

    };

}


/* =======================================================
   HEURISTIC
   ======================================================= */

function heuristic(
    a,
    b
) {

    const dx =
        Math.abs(
            a.x -
            b.x
        );

    const dy =
        Math.abs(
            a.y -
            b.y
        );


    /*
     * Octile distance.
     */

    const diagonal =
        Math.min(
            dx,
            dy
        );

    const straight =
        Math.max(
            dx,
            dy
        ) -
        diagonal;


    return (
        diagonal *
        Math.SQRT2
    ) + straight;

}


/* =======================================================
   NEIGHBORS
   ======================================================= */

const NEIGHBOR_DIRECTIONS = [

    { x:  1, y:  0, cost: 1 },

    { x: -1, y:  0, cost: 1 },

    { x:  0, y:  1, cost: 1 },

    { x:  0, y: -1, cost: 1 },

    { x:  1, y:  1, cost: Math.SQRT2 },

    { x: -1, y:  1, cost: Math.SQRT2 },

    { x:  1, y: -1, cost: Math.SQRT2 },

    { x: -1, y: -1, cost: Math.SQRT2 }

];


/* =======================================================
   NODE KEY
   ======================================================= */

function nodeKey(
    x,
    y
) {

    return `${x},${y}`;

}


/* =======================================================
   RECONSTRUCT PATH
   ======================================================= */

function reconstructPath(
    endNode
) {

    const path = [];


    let current =
        endNode;


    while (current) {

        path.push(
            gridToWorld(
                current.x,
                current.y
            )
        );


        current =
            current.parent;

    }


    path.reverse();


    return path;

}


/* =======================================================
   A* PATHFINDING
   ======================================================= */

function calculateGridPath(
    start,
    destination
) {

    const startGrid =
        worldToGrid(
            start.x,
            start.y
        );


    const destinationGrid =
        worldToGrid(
            destination.x,
            destination.y
        );


    const gridWidth =
        getGridWidth();

    const gridHeight =
        getGridHeight();


    const openSet = [];

    const openMap =
        new Map();

    const closedSet =
        new Set();


    const startNode =
        createNode(
            startGrid.x,
            startGrid.y
        );


    startNode.g =
        0;


    startNode.h =
        heuristic(
            startGrid,
            destinationGrid
        );


    startNode.f =
        startNode.h;


    openSet.push(
        startNode
    );


    openMap.set(
        nodeKey(
            startNode.x,
            startNode.y
        ),
        startNode
    );


    let iterations = 0;

    const maximumIterations =
        gridWidth *
        gridHeight;


    while (
        openSet.length > 0 &&
        iterations <
        maximumIterations
    ) {

        iterations++;


        /*
         * Find lowest f-score.
         */

        let currentIndex = 0;


        for (
            let i = 1;
            i < openSet.length;
            i++
        ) {

            if (
                openSet[i].f <
                openSet[currentIndex].f
            ) {

                currentIndex = i;

            }

        }


        const current =
            openSet[
                currentIndex
            ];


        openSet.splice(
            currentIndex,
            1
        );


        openMap.delete(
            nodeKey(
                current.x,
                current.y
            )
        );


        const currentKey =
            nodeKey(
                current.x,
                current.y
            );


        closedSet.add(
            currentKey
        );


        /*
         * Destination reached.
         */

        if (
            current.x ===
                destinationGrid.x &&
            current.y ===
                destinationGrid.y
        ) {

            return reconstructPath(
                current
            );

        }


        for (
            const direction
            of NEIGHBOR_DIRECTIONS
        ) {

            const neighborX =
                current.x +
                direction.x;

            const neighborY =
                current.y +
                direction.y;


            if (
                neighborX < 0 ||
                neighborX >= gridWidth ||
                neighborY < 0 ||
                neighborY >= gridHeight
            ) {

                continue;

            }


            const neighborKey =
                nodeKey(
                    neighborX,
                    neighborY
                );


            if (
                closedSet.has(
                    neighborKey
                )
            ) {

                continue;

            }


            const neighborWorld =
                gridToWorld(
                    neighborX,
                    neighborY
                );


            /*
             * The player cannot occupy
             * a blocked grid cell.
             */

            if (
                isPointBlocked(
                    neighborWorld.x,
                    neighborWorld.y
                )
            ) {

                continue;

            }


            /*
             * Prevent diagonal corner cutting.
             *
             * Without this, the player could
             * squeeze diagonally between two
             * buildings.
             */

            if (
                direction.x !== 0 &&
                direction.y !== 0
            ) {

                const horizontal =
                    gridToWorld(
                        current.x +
                            direction.x,
                        current.y
                    );

                const vertical =
                    gridToWorld(
                        current.x,
                        current.y +
                            direction.y
                    );


                if (
                    isPointBlocked(
                        horizontal.x,
                        horizontal.y
                    ) ||
                    isPointBlocked(
                        vertical.x,
                        vertical.y
                    )
                ) {

                    continue;

                }

            }


            const tentativeG =
                current.g +
                direction.cost;


            let neighbor =
                openMap.get(
                    neighborKey
                );


            if (!neighbor) {

                neighbor =
                    createNode(
                        neighborX,
                        neighborY
                    );


                neighbor.g =
                    tentativeG;


                neighbor.h =
                    heuristic(
                        {
                            x:
                                neighborX,
                            y:
                                neighborY
                        },
                        destinationGrid
                    );


                neighbor.f =
                    neighbor.g +
                    neighbor.h;


                neighbor.parent =
                    current;


                openSet.push(
                    neighbor
                );


                openMap.set(
                    neighborKey,
                    neighbor
                );


                continue;

            }


            if (
                tentativeG <
                neighbor.g
            ) {

                neighbor.g =
                    tentativeG;


                neighbor.f =
                    tentativeG +
                    neighbor.h;


                neighbor.parent =
                    current;

            }

        }

    }


    return null;

}


/* =======================================================
   PATH SMOOTHING
   ======================================================= */

function smoothPath(
    start,
    path,
    destination
) {

    if (
        !Array.isArray(path) ||
        path.length === 0
    ) {

        return null;

    }


    const points = [

        {
            x: start.x,
            y: start.y
        },

        ...path,

        {
            x: destination.x,
            y: destination.y
        }

    ];


    const smoothed = [];


    let currentIndex = 0;


    while (
        currentIndex <
        points.length - 1
    ) {

        let furthestIndex =
            currentIndex + 1;


        /*
         * Look as far ahead as possible.
         *
         * If the player can travel directly
         * to that point, intermediate grid
         * points are unnecessary.
         */

        for (
            let i =
                currentIndex + 2;
            i < points.length;
            i++
        ) {

            if (
                isPathClear(
                    points[currentIndex].x,
                    points[currentIndex].y,
                    points[i].x,
                    points[i].y
                )
            ) {

                furthestIndex =
                    i;

            } else {

                break;

            }

        }


        smoothed.push(
            points[
                furthestIndex
            ]
        );


        currentIndex =
            furthestIndex;

    }


    return smoothed;

}


/* =======================================================
   PUBLIC PATHFINDING FUNCTION
   ======================================================= */

export function findPath(
    startX,
    startY,
    destinationX,
    destinationY
) {

    if (
        !Number.isFinite(startX) ||
        !Number.isFinite(startY) ||
        !Number.isFinite(destinationX) ||
        !Number.isFinite(destinationY)
    ) {

        return null;

    }


    const start = {

        x: startX,
        y: startY

    };


    const destination = {

        x: Math.max(
            PLAYER_HALF_SIZE,
            Math.min(
                WORLD_WIDTH -
                    PLAYER_HALF_SIZE,
                destinationX
            )
        ),

        y: Math.max(
            PLAYER_HALF_SIZE,
            Math.min(
                WORLD_HEIGHT -
                    PLAYER_HALF_SIZE,
                destinationY
            )
        )

    };


    /*
     * If the destination can be reached
     * directly, don't run A* at all.
     */

    if (
        isPathClear(
            start.x,
            start.y,
            destination.x,
            destination.y
        )
    ) {

        return [

            {
                x: destination.x,
                y: destination.y
            }

        ];

    }


    const gridPath =
        calculateGridPath(
            start,
            destination
        );


    if (
        !gridPath
    ) {

        console.warn(
            "No valid path found."
        );


        return null;

    }


    const smoothedPath =
        smoothPath(
            start,
            gridPath,
            destination
        );


    if (
        !smoothedPath ||
        smoothedPath.length === 0
    ) {

        return null;

    }


    /*
     * Always finish at the exact clicked
     * coordinate when the final segment
     * is safe.
     */

    const finalPoint =
        smoothedPath[
            smoothedPath.length - 1
        ];


    if (
        isPathClear(
            finalPoint.x,
            finalPoint.y,
            destination.x,
            destination.y
        )
    ) {

        smoothedPath.push({
            x: destination.x,
            y: destination.y
        });

    }


    return smoothedPath;

}


/* =======================================================
   PUBLIC PATH VALIDATION
   ======================================================= */

export function canWalkDirectly(
    startX,
    startY,
    destinationX,
    destinationY
) {

    return isPathClear(
        startX,
        startY,
        destinationX,
        destinationY
    );

}