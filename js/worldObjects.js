/* =======================================================
   WORLD OBJECT SYSTEM
   ======================================================= */

const worldObjects = [];


/* =======================================================
   CREATE WORLD OBJECT
   ======================================================= */

export function createWorldObject({
    id = crypto.randomUUID(),
    type = "world_object",
    name = "World Object",
    x = 0,
    y = 0,
    interactionDistance = 85,
    interactionType = "generic"
} = {}) {

    if (
        typeof id !== "string" ||
        typeof type !== "string" ||
        typeof name !== "string" ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(interactionDistance)
    ) {
        return null;
    }


    const worldObject = {

        id,

        type,

        name,

        position: {
            x,
            y
        },

        interactionDistance,

        interactionType

    };


    worldObjects.push(
        worldObject
    );


    return worldObject;

}


/* =======================================================
   GET WORLD OBJECTS
   ======================================================= */

export function getWorldObjects() {

    return worldObjects;

}


/* =======================================================
   GET WORLD OBJECT BY ID
   ======================================================= */

export function getWorldObjectById(
    objectId
) {

    return (
        worldObjects.find(
            object =>
                object.id === objectId
        ) || null
    );

}


/* =======================================================
   GET NEARBY WORLD OBJECT
   ======================================================= */

export function getNearbyWorldObject(
    player
) {

    if (
        !player ||
        !player.position
    ) {

        return null;

    }


    let closestObject = null;

    let closestDistance =
        Infinity;


    for (
        const object
        of worldObjects
    ) {

        const dx =
            player.position.x -
            object.position.x;

        const dy =
            player.position.y -
            object.position.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <=
            object.interactionDistance &&
            distance < closestDistance
        ) {

            closestObject =
                object;

            closestDistance =
                distance;

        }

    }


    return closestObject;

}


/* =======================================================
   DISTANCE TO WORLD OBJECT
   ======================================================= */

export function getDistanceToWorldObject(
    player,
    worldObject
) {

    if (
        !player ||
        !player.position ||
        !worldObject ||
        !worldObject.position
    ) {

        return Infinity;

    }


    const dx =
        player.position.x -
        worldObject.position.x;

    const dy =
        player.position.y -
        worldObject.position.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =======================================================
   REMOVE WORLD OBJECT
   ======================================================= */

export function removeWorldObject(
    worldObject
) {

    const index =
        worldObjects.indexOf(
            worldObject
        );


    if (index === -1) {
        return false;
    }


    worldObjects.splice(
        index,
        1
    );


    return true;

}


/* =======================================================
   CLEAR WORLD OBJECTS
   ======================================================= */

export function clearWorldObjects() {

    worldObjects.length = 0;

}