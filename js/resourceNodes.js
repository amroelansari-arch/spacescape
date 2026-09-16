/* =======================================================
   RESOURCE NODE SYSTEM
   ======================================================= */

const resourceNodes = [];

const RESOURCE_NODE_DEFINITIONS = {

    /* ===================================================
       XENIUM ORE
       =================================================== */

    xenium_ore: {
        id: "xenium_ore",
        name: "Xenium Ore",
        resourceType: "ore",

        gatheringSkill: "mining",
        requiredLevel: 1,

        quantity: 1,
        xpReward: 10,

        rewardItem: "xenium_ore",

        gatheringDistance: 45,
        gatheringDuration: 2500,
        respawnTime: 10000
    },


    /* ===================================================
       DAMAGED SUPPLY CRATE
       =================================================== */

    damaged_supply_crate: {
        id: "damaged_supply_crate",
        name: "Damaged Supply Crate",
        resourceType: "scrap",

        gatheringSkill: "salvaging",
        requiredLevel: 1,

        quantity: 1,
        xpReward: 10,

        rewardItem: "scrap_metal",

        gatheringDistance: 45,
        gatheringDuration: 2500,
        respawnTime: 10000
    },


    /* ===================================================
       DENSE XENIUM DEPOSIT
       =================================================== */

    dense_xenium_deposit: {
        id: "dense_xenium_deposit",
        name: "Dense Xenium Deposit",
        resourceType: "ore",

        gatheringSkill: "mining",
        requiredLevel: 5,

        quantity: 1,
        xpReward: 25,

        rewardItem: "dense_xenium_ore",

        gatheringDistance: 45,
        gatheringDuration: 3500,
        respawnTime: 15000
    }

};


/* =======================================================
   RESOURCE NODE CREATION
   ======================================================= */

export function createResourceNode(
    resourceId,
    x,
    y
) {

    if (
        typeof resourceId !== "string" ||
        !resourceId ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {

        return null;

    }


    const definition =
        RESOURCE_NODE_DEFINITIONS[
            resourceId
        ];


    if (!definition) {

        return null;

    }


    const resourceNode = {

        id:
            crypto.randomUUID(),

        resourceId:
            definition.id,

        name:
            definition.name,

        resourceType:
            definition.resourceType,

        gatheringSkill:
            definition.gatheringSkill,

        requiredLevel:
            definition.requiredLevel,

        quantity:
            definition.quantity,

        xpReward:
            definition.xpReward,

        rewardItem:
            definition.rewardItem,

        gatheringDistance:
            definition.gatheringDistance,

        gatheringDuration:
            definition.gatheringDuration,

        respawnTime:
            definition.respawnTime,

        position: {
            x,
            y
        },

        depleted:
            false,

        respawnAt:
            0

    };


    resourceNodes.push(
        resourceNode
    );


    return resourceNode;

}


/* =======================================================
   RESOURCE NODE ACCESS
   ======================================================= */

export function getResourceNodes() {

    return resourceNodes;

}


export function getResourceNodeById(
    resourceNodeId
) {

    return (
        resourceNodes.find(
            node =>
                node.id ===
                resourceNodeId
        ) || null
    );

}


export function getResourceNodesByResourceId(
    resourceId
) {

    return resourceNodes.filter(
        node =>
            node.resourceId ===
            resourceId
    );

}


/* =======================================================
   RESOURCE NODE DISTANCE
   ======================================================= */

export function getDistanceToResourceNode(
    player,
    resourceNode
) {

    if (
        !player ||
        !resourceNode ||
        !player.position ||
        !resourceNode.position
    ) {

        return Infinity;

    }


    const dx =
        player.position.x -
        resourceNode.position.x;


    const dy =
        player.position.y -
        resourceNode.position.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


export function isWithinResourceGatheringDistance(
    player,
    resourceNode
) {

    if (
        !player ||
        !resourceNode
    ) {

        return false;

    }


    return (
        getDistanceToResourceNode(
            player,
            resourceNode
        ) <=
        resourceNode.gatheringDistance
    );

}


/* =======================================================
   RESOURCE NODE STATE
   ======================================================= */

export function isResourceNodeDepleted(
    resourceNode
) {

    return Boolean(
        resourceNode &&
        resourceNode.depleted
    );

}


export function depleteResourceNode(
    resourceNode
) {

    if (!resourceNode) {

        return false;

    }


    if (
        resourceNode.depleted
    ) {

        return false;

    }


    resourceNode.depleted =
        true;


    resourceNode.respawnAt =
        performance.now() +
        resourceNode.respawnTime;


    return true;

}


export function restoreResourceNode(
    resourceNode
) {

    if (!resourceNode) {

        return false;

    }


    resourceNode.depleted =
        false;


    resourceNode.respawnAt =
        0;


    return true;

}


/* =======================================================
   RESOURCE NODE RESPAWNING
   ======================================================= */

export function updateResourceNodeRespawns() {

    const now =
        performance.now();


    for (
        const resourceNode
        of resourceNodes
    ) {

        if (
            !resourceNode.depleted
        ) {

            continue;

        }


        if (
            resourceNode.respawnAt <= 0
        ) {

            continue;

        }


        if (
            now <
            resourceNode.respawnAt
        ) {

            continue;

        }


        restoreResourceNode(
            resourceNode
        );


        console.log(
            `${resourceNode.name} respawned.`
        );

    }

}


/* =======================================================
   RESOURCE NODE REMOVAL
   ======================================================= */

export function removeResourceNode(
    resourceNode
) {

    if (!resourceNode) {

        return false;

    }


    const index =
        resourceNodes.indexOf(
            resourceNode
        );


    if (
        index === -1
    ) {

        return false;

    }


    resourceNodes.splice(
        index,
        1
    );


    return true;

}


/* =======================================================
   RESOURCE NODE RESET
   ======================================================= */

export function clearResourceNodes() {

    resourceNodes.length = 0;

}


/* =======================================================
   RESOURCE DEFINITIONS
   ======================================================= */

export function getResourceDefinition(
    resourceId
) {

    return (
        RESOURCE_NODE_DEFINITIONS[
            resourceId
        ] || null
    );

}


export function getAllResourceDefinitions() {

    return Object.values(
        RESOURCE_NODE_DEFINITIONS
    );

}