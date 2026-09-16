/*
 * =======================================================
 * SPACESCAPE ITEM DEFINITIONS
 * =======================================================
 */

const ITEM_DEFINITIONS = {

    /* ===================================================
       MEDKIT
       =================================================== */

    medkit: {
        id: "medkit",
        name: "Medkit",
        type: "consumable",

        effect: {
            type: "heal",
            amount: 25
        }
    },


    /* ===================================================
       LASER RIFLE
       =================================================== */

    laser_rifle: {
        id: "laser_rifle",
        name: "Laser Rifle",
        type: "weapon",
        slot: "weapon",

        /*
         * Identifies the combat discipline used
         * by this weapon.
         *
         * Laser weapons are Ballistics weapons.
         */

        combatDiscipline: "ballistics",

        /*
         * Ammunition required to fire this weapon.
         */

        ammunitionType: "laser_charge",

        stats: {
            attackBonus: 5,
            strengthBonus: 2,
            defenseBonus: 0,

            accuracyBonus: 5,
            damageBonus: 1,

            weaponDamage: 5
        },

        requirements: {
            attack: 1
        }
    },


    /* ===================================================
       COMBAT SABER
       =================================================== */

    combat_saber: {
        id: "combat_saber",
        name: "Combat Saber",
        type: "weapon",
        slot: "weapon",

        /*
         * No combatDiscipline is required for melee.
         * The combat system will treat this as a
         * traditional melee weapon.
         */

        stats: {
            attackBonus: 3,
            strengthBonus: 4,
            defenseBonus: 0,

            accuracyBonus: 2,
            damageBonus: 2,

            weaponDamage: 4
        },

        requirements: {
            attack: 1
        }
    },


    /* ===================================================
       FLUX CONDUIT
       =================================================== */

    flux_conduit: {
        id: "flux_conduit",
        name: "Flux Conduit",
        type: "weapon",
        slot: "weapon",

        /*
         * The Flux Conduit is the sci-fi equivalent
         * of a traditional magic weapon.
         *
         * It does not use ammunition.
         *
         * Flux attacks instead consume Flux Crystals
         * from the player's inventory.
         */

        combatDiscipline: "flux",

        stats: {
            attackBonus: 0,
            strengthBonus: 0,
            defenseBonus: 0,

            accuracyBonus: 4,
            damageBonus: 3,

            weaponDamage: 5
        },

        requirements: {
            flux: 1
        }
    },


    /* ===================================================
       LASER CHARGES
       =================================================== */

    laser_charge: {
        id: "laser_charge",
        name: "Laser Charge",
        type: "ammunition",
        slot: "ammunition",

        /*
         * Identifies which weapon ammunition system
         * this ammunition belongs to.
         */

        ammunitionType: "laser_charge",

        stackable: true,

        maxStack: 1000
    },


    /* ===================================================
       FLUX CRYSTAL
       =================================================== */

    flux_crystal: {
        id: "flux_crystal",
        name: "Flux Crystal",
        type: "resource",
        resourceType: "flux",

        /*
         * Flux Crystals are consumed directly from
         * inventory when using Flux abilities.
         *
         * They are intentionally NOT an equipment slot.
         */

        stackable: true,

        maxStack: 1000
    },


    /* ===================================================
       COLONY HELMET
       =================================================== */

    colony_helmet: {
        id: "colony_helmet",
        name: "Colony Helmet",
        type: "armor",
        slot: "head",

        stats: {
            attackBonus: 0,
            strengthBonus: 0,
            defenseBonus: 3,

            accuracyBonus: 0,
            damageBonus: 0,

            weaponDamage: 0
        },

        requirements: {
            defense: 1
        }
    },


    /* ===================================================
       COLONY SUIT
       =================================================== */

    colony_suit: {
        id: "colony_suit",
        name: "Colony Suit",
        type: "armor",
        slot: "body",

        stats: {
            attackBonus: 0,
            strengthBonus: 0,
            defenseBonus: 5,

            accuracyBonus: 0,
            damageBonus: 0,

            weaponDamage: 0
        },

        requirements: {
            defense: 1
        }
    },


    /* ===================================================
       COLONY BOOTS
       =================================================== */

    colony_boots: {
        id: "colony_boots",
        name: "Colony Boots",
        type: "armor",
        slot: "feet",

        stats: {
            attackBonus: 0,
            strengthBonus: 0,
            defenseBonus: 2,

            accuracyBonus: 0,
            damageBonus: 0,

            weaponDamage: 0
        },

        requirements: {
            defense: 1
        }
    },


    /* ===================================================
       XENIUM ORE
       =================================================== */

    xenium_ore: {
        id: "xenium_ore",
        name: "Xenium Ore",
        type: "resource",
        resourceType: "ore",

        stackable: true,

        maxStack: 1000
    },


    /* ===================================================
       SCRAP METAL
       =================================================== */

    scrap_metal: {
        id: "scrap_metal",
        name: "Scrap Metal",
        type: "resource",
        resourceType: "scrap",

        stackable: true,

        maxStack: 1000
    },


    /* ===================================================
       DENSE XENIUM ORE
       =================================================== */

    dense_xenium_ore: {
        id: "dense_xenium_ore",
        name: "Dense Xenium Ore",
        type: "resource",
        resourceType: "ore",

        stackable: true,

        maxStack: 1000
    }

};


/* =======================================================
   GET ITEM
   ======================================================= */

export function getItem(
    itemId
) {

    if (!itemId) {
        return null;
    }

    return (
        ITEM_DEFINITIONS[itemId] ||
        null
    );

}


/* =======================================================
   ITEM EXISTS
   ======================================================= */

export function itemExists(
    itemId
) {

    return getItem(
        itemId
    ) !== null;

}


/* =======================================================
   GET ALL ITEMS
   ======================================================= */

export function getAllItems() {

    return Object.values(
        ITEM_DEFINITIONS
    );

}


/* =======================================================
   USE ITEM
   ======================================================= */

export function useItem(
    player,
    inventory,
    itemId
) {

    if (
        !player ||
        !inventory ||
        !itemId
    ) {

        return false;

    }


    const item =
        getItem(
            itemId
        );


    if (!item) {
        return false;
    }


    if (
        item.type !==
        "consumable"
    ) {

        return false;

    }


    if (
        !Array.isArray(
            inventory.items
        )
    ) {

        return false;

    }


    const inventoryItem =
        inventory.items.find(
            currentItem =>
                currentItem.id ===
                itemId
        );


    if (!inventoryItem) {
        return false;
    }


    if (
        inventoryItem.quantity <= 0
    ) {

        return false;

    }


    if (
        item.effect &&
        item.effect.type ===
        "heal"
    ) {

        player.health.current =
            Math.min(
                player.health.maximum,
                player.health.current +
                item.effect.amount
            );

    }


    inventoryItem.quantity--;


    if (
        inventoryItem.quantity === 0
    ) {

        inventory.items =
            inventory.items.filter(
                currentItem =>
                    currentItem.id !==
                    itemId
            );

    }


    return true;

}