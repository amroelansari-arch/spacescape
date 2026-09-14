import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    obstacles
} from "./world.js";


/* =======================================================
   PATHFINDING SETTINGS
   ======================================================= */

const GRID_SIZE = 25;

const PLAYER_HALF_SIZE = 17;

const SAFETY_MARGIN = 3;


/*
 * How far around a requested destination we
 * are willing to search for a usable grid cell.
 *
 * This is especially important near building
 * corners where the clicked pixel may be walkable
 * but the center of its grid cell is not.
 */

const DESTINATION_SEARCH_RADIUS = 10;


/*
 * Same idea for the player's starting position.
 */

const START_SEARCH_RADIUS = 6;


/* =======================================================
   GRID DIMENSIONS
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


/* =======================================================
   WORLD → GRID
   ======================================================= */

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


/* =======================================================
   GRID → WORLD
   ======================================================= */

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
   BLOCKED POINT
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
   VALID WORLD POSITION
   ======================================================= */

function isValidWorldPosition(
    x,
    y
) {

    if (
        x < PLAYER_HALF_SIZE ||
        x >
            WORLD_WIDTH -
            PLAYER_HALF_SIZE
    ) {

        return false;

    }


    if (
        y < PLAYER_HALF_SIZE ||
        y >
            WORLD_HEIGHT -
            PLAYER_HALF_SIZE
    ) {

        return false;

    }


    return !isPointBlocked(
        x,
        y
    );

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
     * Segment bounding-box rejection.
     */

    const segmentLeft =
        Math.min(
            x1,
            x2
        );

    const segmentRight =
        Math.max(
            x1,
            x2
        );

    const segmentTop =
        Math.min(
            y1,
            y2
        );

    const segmentBottom =
        Math.max(
            y1,
            y2
        );


    if (
        segmentRight < left ||
        segmentLeft > right ||
        segmentBottom < top ||
        segmentTop > bottom
    ) {

        return false;

    }


    /*
     * If either endpoint is inside the
     * inflated obstacle, the path is blocked.
     */

    if (
        x1 >= left &&
        x1 <= right &&
        y1 >= top &&
        y1 <= bottom
    ) {

        return true;

    }


    if (
        x2 >= left &&
        x2 <= right &&
        y2 >= top &&
        y2 <= bottom
    ) {

        return true;

    }


    /*
     * Parametric line-segment test.
     */

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    let tMin = 0;

    let tMax = 1;


    const boundaries = [

        {
            p: -dx,
            q: x1 - left
        },

        {
            p: dx,
            q: right - x1
        },

        {
            p: -dy,
            q: y1 - top
        },

        {
            p: dy,
            q: bottom - y1
        }

    ];


    for (
        const boundary
        of boundaries
    ) {

        const p =
            boundary.p;

        const q =
            boundary.q;


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
   DIRECT PATH TEST
   ======================================================= */

function isPathClear(
    x1,
    y1,
    x2,
    y2
) {

    if (
        x2 < PLAYER_HALF_SIZE ||
        x2 >
            WORLD_WIDTH -
            PLAYER_HALF_SIZE ||
        y2 < PLAYER_HALF_SIZE ||
        y2 >
            WORLD_HEIGHT -
            PLAYER_HALF_SIZE
    ) {

        return false;

    }


    /*
     * Check every obstacle.
     */

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
   NODE
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
    ) +
    straight;

}


/* =======================================================
   NEIGHBORS
   ======================================================= */

const NEIGHBOR_DIRECTIONS = [

    {
        x: 1,
        y: 0,
        cost: 1
    },

    {
        x: -1,
        y: 0,
        cost: 1
    },

    {
        x: 0,
        y: 1,
        cost: 1
    },

    {
        x: 0,
        y: -1,
        cost: 1
    },

    {
        x: 1,
        y: 1,
        cost: Math.SQRT2
    },

    {
        x: -1,
        y: 1,
        cost: Math.SQRT2
    },

    {
        x: 1,
        y: -1,
        cost: Math.SQRT2
    },

    {
        x: -1,
        y: -1,
        cost: Math.SQRT2
    }

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
   GRID CELL VALIDATION
   ======================================================= */

function isGridCellWalkable(
    gridX,
    gridY
) {

    if (
        gridX < 0 ||
        gridX >= getGridWidth() ||
        gridY < 0 ||
        gridY >= getGridHeight()
    ) {

        return false;

    }


    const worldPoint =
        gridToWorld(
            gridX,
            gridY
        );


    return isValidWorldPosition(
        worldPoint.x,
        worldPoint.y
    );

}


/* =======================================================
   FIND NEAREST WALKABLE CELL
   ======================================================= */

function findNearestWalkableCell(
    requestedGridX,
    requestedGridY,
    searchRadius
) {

    /*
     * If the requested cell itself works,
     * use it immediately.
     */

    if (
        isGridCellWalkable(
            requestedGridX,
            requestedGridY
        )
    ) {

        return {

            x: requestedGridX,

            y: requestedGridY

        };

    }


    let bestCell = null;

    let bestDistance =
        Infinity;


    /*
     * Search outward in rings.
     */

    for (
        let radius = 1;
        radius <= searchRadius;
        radius++
    ) {

        for (
            let x =
                requestedGridX -
                radius;

            x <=
                requestedGridX +
                radius;

            x++
        ) {

            for (
                let y =
                    requestedGridY -
                    radius;

                y <=
                    requestedGridY +
                    radius;

                y++
            ) {

                /*
                 * Only examine the current
                 * outer ring.
                 */

                const distanceFromCenter =
                    Math.max(
                        Math.abs(
                            x -
                            requestedGridX
                        ),
                        Math.abs(
                            y -
                            requestedGridY
                        )
                    );


                if (
                    distanceFromCenter !==
                    radius
                ) {

                    continue;

                }


                if (
                    !isGridCellWalkable(
                        x,
                        y
                    )
                ) {

                    continue;

                }


                const dx =
                    x -
                    requestedGridX;

                const dy =
                    y -
                    requestedGridY;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <
                    bestDistance
                ) {

                    bestDistance =
                        distance;


                    bestCell = {

                        x,

                        y

                    };

                }

            }

        }


        /*
         * If we found something on this
         * ring, it is the nearest usable
         * area around the destination.
         */

        if (bestCell) {

            return bestCell;

        }

    }


    return null;

}


/* =======================================================
   RECONSTRUCT GRID PATH
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
   A* GRID PATH
   ======================================================= */

function calculateGridPath(
    startCell,
    destinationCell
) {

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
            startCell.x,
            startCell.y
        );


    startNode.g =
        0;


    startNode.h =
        heuristic(
            startCell,
            destinationCell
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


        let currentIndex =
            0;


        for (
            let i = 1;
            i < openSet.length;
            i++
        ) {

            if (
                openSet[i].f <
                openSet[
                    currentIndex
                ].f
            ) {

                currentIndex =
                    i;

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


        if (
            current.x ===
                destinationCell.x &&
            current.y ===
                destinationCell.y
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


            if (
                !isGridCellWalkable(
                    neighborX,
                    neighborY
                )
            ) {

                continue;

            }


            /*
             * Prevent diagonal corner cutting.
             */

            if (
                direction.x !== 0 &&
                direction.y !== 0
            ) {

                if (
                    !isGridCellWalkable(
                        current.x +
                            direction.x,
                        current.y
                    ) ||
                    !isGridCellWalkable(
                        current.x,
                        current.y +
                            direction.y
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
                        destinationCell
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
    gridPath,
    destination
) {

    if (
        !Array.isArray(
            gridPath
        ) ||
        gridPath.length === 0
    ) {

        return null;

    }


    const points = [

        {
            x: start.x,

            y: start.y
        },

        ...gridPath,

        {
            x:
                destination.x,

            y:
                destination.y
        }

    ];


    const smoothed = [];


    let currentIndex =
        0;


    while (
        currentIndex <
        points.length - 1
    ) {

        let furthestIndex =
            currentIndex + 1;


        for (
            let i =
                currentIndex + 2;

            i <
                points.length;

            i++
        ) {

            if (
                isPathClear(
                    points[
                        currentIndex
                    ].x,

                    points[
                        currentIndex
                    ].y,

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
   REMOVE REDUNDANT POINTS
   ======================================================= */

function removeRedundantPoints(
    path
) {

    if (
        !Array.isArray(path) ||
        path.length <= 1
    ) {

        return path;

    }


    const result = [];


    for (
        const point
        of path
    ) {

        const previous =
            result[
                result.length - 1
            ];


        if (!previous) {

            result.push(
                point
            );

            continue;

        }


        const distance =
            Math.sqrt(
                Math.pow(
                    point.x -
                    previous.x,
                    2
                ) +
                Math.pow(
                    point.y -
                    previous.y,
                    2
                )
            );


        if (
            distance >= 5
        ) {

            result.push(
                point
            );

        }

    }


    return result;

}


/* =======================================================
   PUBLIC FIND PATH
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


    const start = {

        x: startX,

        y: startY

    };


    /* ===================================================
       DIRECT ROUTE
       =================================================== */

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
                x:
                    destination.x,

                y:
                    destination.y
            }

        ];

    }


    /* ===================================================
       CONVERT TO GRID
       =================================================== */

    const requestedStartCell =
        worldToGrid(
            start.x,
            start.y
        );


    const requestedDestinationCell =
        worldToGrid(
            destination.x,
            destination.y
        );


    /* ===================================================
       RECOVER BLOCKED START CELL
       =================================================== */

    const startCell =
        findNearestWalkableCell(
            requestedStartCell.x,
            requestedStartCell.y,
            START_SEARCH_RADIUS
        );


    if (!startCell) {

        console.warn(
            "No usable starting pathfinding cell found."
        );


        return null;

    }


    /* ===================================================
       RECOVER BLOCKED DESTINATION CELL
       =================================================== */

    const destinationCell =
        findNearestWalkableCell(
            requestedDestinationCell.x,
            requestedDestinationCell.y,
            DESTINATION_SEARCH_RADIUS
        );


    if (!destinationCell) {

        console.warn(
            "No usable destination pathfinding cell found."
        );


        return null;

    }


    /* ===================================================
       GRID PATH
       =================================================== */

    const gridPath =
        calculateGridPath(
            startCell,
            destinationCell
        );


    if (
        !gridPath
    ) {

        /*
         * There may still be a valid route
         * to another nearby destination cell.
         *
         * Try nearby cells in order of distance.
         */

        const alternatives =
            findNearbyDestinationCells(
                requestedDestinationCell.x,
                requestedDestinationCell.y,
                DESTINATION_SEARCH_RADIUS
            );


        for (
            const alternative
            of alternatives
        ) {

            const alternativePath =
                calculateGridPath(
                    startCell,
                    alternative
                );


            if (
                alternativePath
            ) {

                const smoothed =
                    smoothPath(
                        start,
                        alternativePath,
                        destination
                    );


                if (
                    smoothed &&
                    smoothed.length > 0
                ) {

                    const finalPoint =
                        smoothed[
                            smoothed.length - 1
                        ];


                    if (
                        isPathClear(
                            finalPoint.x,
                            finalPoint.y,
                            destination.x,
                            destination.y
                        )
                    ) {

                        smoothed.push({
                            x:
                                destination.x,

                            y:
                                destination.y
                        });

                    }


                    return removeRedundantPoints(
                        smoothed
                    );

                }

            }

        }


        console.warn(
            "No valid path found."
        );


        return null;

    }


    /* ===================================================
       SMOOTH PATH
       =================================================== */

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


    /* ===================================================
       EXACT DESTINATION
       =================================================== */

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

            x:
                destination.x,

            y:
                destination.y

        });

    }


    return removeRedundantPoints(
        smoothedPath
    );

}


/* =======================================================
   FIND NEARBY DESTINATION CELLS
   ======================================================= */

function findNearbyDestinationCells(
    centerX,
    centerY,
    radius
) {

    const cells = [];


    for (
        let x =
            centerX -
            radius;

        x <=
            centerX +
            radius;

        x++
    ) {

        for (
            let y =
                centerY -
                radius;

            y <=
                centerY +
                radius;

            y++
        ) {

            if (
                !isGridCellWalkable(
                    x,
                    y
                )
            ) {

                continue;

            }


            const dx =
                x -
                centerX;

            const dy =
                y -
                centerY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            cells.push({

                x,

                y,

                distance

            });

        }

    }


    cells.sort(
        (
            a,
            b
        ) =>
            a.distance -
            b.distance
    );


    return cells;

}


/* =======================================================
   PUBLIC DIRECT WALK TEST
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