/*
 * =======================================================
 * SPACESCAPE EQUIPMENT SYSTEM
 * =======================================================
 */

import {
    meetsEquipmentRequirements,
    getFailedEquipmentRequirement
} from "./equipmentStats.js";


export const EQUIPMENT_SLOTS = [

    "head",
    "body",
    "weapon",
    "offhand",
    "legs",
    "feet",
    "accessory",
    "ammunition"

];


/* =======================================================
   CREATE EQUIPMENT
   ======================================================= */

export function createEquipment() {

    return {

        head: null,
        body: null,
        weapon: null,
        offhand: null,
        legs: null,
        feet: null,
        accessory: null,

        /*
         * Ammunition is a dedicated equipment slot.
         *
         * Stored as:
         *
         * {
         *     id: "laser_charge",
         *     quantity: 25
         * }
         */

        ammunition: null

    };

}


/* =======================================================
   VALIDATION
   ======================================================= */

export function isValidEquipment(
    equipment
) {

    if (
        !equipment ||
        typeof equipment !== "object"
    ) {

        return false;

    }

    return EQUIPMENT_SLOTS.every(
        slot =>
            Object.prototype.hasOwnProperty.call(
                equipment,
                slot
            )
    );

}


export function isValidEquipmentSlot(
    slot
) {

    return EQUIPMENT_SLOTS.includes(
        slot
    );

}


/* =======================================================
   AMMUNITION CHECK
   ======================================================= */

export function isAmmunitionItem(
    item
) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return false;

    }

    return (
        item.type === "ammunition" ||
        item.slot === "ammunition"
    );

}


/* =======================================================
   GET EQUIPPED ITEM
   ======================================================= */

export function getEquippedItem(
    equipment,
    slot
) {

    if (
        !isValidEquipment(equipment) ||
        !isValidEquipmentSlot(slot)
    ) {

        return null;

    }

    return equipment[slot];

}


/* =======================================================
   GET EQUIPPED AMMUNITION QUANTITY
   ======================================================= */

export function getEquippedAmmunitionQuantity(
    equipment
) {

    if (
        !isValidEquipment(equipment)
    ) {

        return 0;

    }

    const ammunition =
        equipment.ammunition;


    if (
        !ammunition ||
        !Number.isFinite(
            ammunition.quantity
        )
    ) {

        return 0;

    }


    return Math.max(
        0,
        ammunition.quantity
    );

}


/* =======================================================
   CHECK WHETHER ITEM IS EQUIPPED
   ======================================================= */

export function isItemEquipped(
    equipment,
    itemId
) {

    if (
        !isValidEquipment(equipment) ||
        !itemId
    ) {

        return false;

    }

    return EQUIPMENT_SLOTS.some(
        slot =>
            equipment[slot] &&
            equipment[slot].id === itemId
    );

}


/* =======================================================
   FIND ITEM SLOT
   ======================================================= */

export function findEquipmentSlot(
    equipment,
    itemId
) {

    if (
        !isValidEquipment(equipment) ||
        !itemId
    ) {

        return null;

    }

    for (
        const slot of EQUIPMENT_SLOTS
    ) {

        if (
            equipment[slot] &&
            equipment[slot].id === itemId
        ) {

            return slot;

        }

    }

    return null;

}


/* =======================================================
   EQUIP ITEM
   ======================================================= */

export function equipItem(
    equipment,
    item,
    player = null,
    quantity = null
) {

    if (
        !isValidEquipment(equipment) ||
        !item ||
        typeof item !== "object" ||
        !item.id
    ) {

        return {

            success: false,
            reason: "invalid_item"

        };

    }


    const isAmmunition =
        isAmmunitionItem(item);


    /*
     * Ammunition is a valid equipment type.
     *
     * All other equippable items continue to use
     * the existing weapon/equipment/armor types.
     */

    if (
        !isAmmunition &&
        item.type !== "weapon" &&
        item.type !== "equipment" &&
        item.type !== "armor"
    ) {

        return {

            success: false,
            reason: "not_equippable"

        };

    }


    /*
     * Ammunition must use the ammunition slot.
     */

    if (
        isAmmunition &&
        item.slot !== "ammunition"
    ) {

        return {

            success: false,
            reason: "invalid_ammunition_slot"

        };

    }


    /*
     * Non-ammunition items must use a normal
     * equipment slot.
     */

    if (
        !isValidEquipmentSlot(
            item.slot
        )
    ) {

        return {

            success: false,
            reason: "invalid_slot"

        };

    }


    /*
     * Prevent non-ammunition items from being
     * placed in the ammunition slot.
     */

    if (
        !isAmmunition &&
        item.slot === "ammunition"
    ) {

        return {

            success: false,
            reason: "invalid_equipment_slot"

        };

    }


    /*
     * Requirements are enforced when a player
     * object is supplied.
     *
     * This allows direct equipment-system tests
     * without requiring a player object.
     */

    if (
        player &&
        !meetsEquipmentRequirements(
            player,
            item
        )
    ) {

        return {

            success: false,

            reason:
                "requirements_not_met",

            requirement:
                getFailedEquipmentRequirement(
                    player,
                    item
                )

        };

    }


    const slot =
        item.slot;


    const previousItem =
        equipment[slot];


    /* ===================================================
       AMMUNITION STACKING
       =================================================== */

    if (isAmmunition) {

        let ammunitionQuantity =
            quantity;


        /*
         * If no explicit quantity was supplied,
         * use the quantity carried by the item.
         */

        if (
            !Number.isFinite(
                ammunitionQuantity
            )
        ) {

            ammunitionQuantity =
                item.quantity;

        }


        /*
         * If the item does not specify a quantity,
         * treat it as one unit.
         */

        if (
            !Number.isFinite(
                ammunitionQuantity
            )
        ) {

            ammunitionQuantity =
                1;

        }


        ammunitionQuantity =
            Math.floor(
                ammunitionQuantity
            );


        if (
            ammunitionQuantity <= 0
        ) {

            return {

                success: false,
                reason: "invalid_quantity"

            };

        }


        /*
         * -------------------------------------------------
         * SAME AMMUNITION TYPE:
         *
         * Stack the new ammunition onto the existing
         * ammunition stack instead of replacing it.
         *
         * Example:
         *
         * Existing: 91 Laser Charges
         * New:      100 Laser Charges
         *
         * Result:   191 Laser Charges
         *
         * The existing stack does NOT get returned to
         * inventory.
         * -------------------------------------------------
         */

        if (
            previousItem &&
            previousItem.id === item.id
        ) {

            const previousQuantity =
                Number.isFinite(
                    previousItem.quantity
                )
                    ? Math.max(
                        0,
                        Math.floor(
                            previousItem.quantity
                        )
                    )
                    : 0;


            const newQuantity =
                previousQuantity +
                ammunitionQuantity;


            equipment[slot] = {

                id:
                    previousItem.id,

                quantity:
                    newQuantity

            };


            return {

                success: true,

                slot,

                item,

                /*
                 * Nothing was displaced.
                 *
                 * This is important because callers
                 * that handle inventory rollback must
                 * NOT put the old ammunition stack back
                 * into inventory.
                 */

                previousItem: null,

                stacked: true,

                addedQuantity:
                    ammunitionQuantity,

                quantity:
                    newQuantity

            };

        }


        /*
         * -------------------------------------------------
         * DIFFERENT AMMUNITION TYPE:
         *
         * Preserve normal equipment-slot replacement
         * behavior.
         *
         * Example:
         *
         * Laser Charges equipped
         * Player equips Flux Crystals
         *
         * Laser Charges are returned as previousItem
         * so the calling inventory system can put them
         * back into inventory.
         * -------------------------------------------------
         */

        equipment[slot] = {

            id:
                item.id,

            quantity:
                ammunitionQuantity

        };


        return {

            success: true,

            slot,

            item,

            previousItem,

            stacked: false,

            addedQuantity:
                ammunitionQuantity,

            quantity:
                ammunitionQuantity

        };

    }


    /* ===================================================
       NORMAL EQUIPMENT
       =================================================== */

    equipment[slot] = {

        id:
            item.id

    };


    return {

        success: true,

        slot,

        item,

        previousItem,

        stacked: false,

        quantity: null

    };

}


/* =======================================================
   CONSUME AMMUNITION
   ======================================================= */

export function consumeAmmunition(
    equipment,
    amount = 1
) {

    if (
        !isValidEquipment(equipment)
    ) {

        return {

            success: false,
            reason: "invalid_equipment",
            consumed: 0,
            remaining: 0

        };

    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return {

            success: false,
            reason: "invalid_amount",
            consumed: 0,
            remaining:
                getEquippedAmmunitionQuantity(
                    equipment
                )

        };

    }


    const ammunition =
        equipment.ammunition;


    if (!ammunition) {

        return {

            success: false,
            reason: "no_ammunition_equipped",
            consumed: 0,
            remaining: 0

        };

    }


    if (
        !Number.isFinite(
            ammunition.quantity
        ) ||
        ammunition.quantity <= 0
    ) {

        equipment.ammunition =
            null;

        return {

            success: false,
            reason: "ammunition_empty",
            consumed: 0,
            remaining: 0

        };

    }


    const requestedAmount =
        Math.floor(
            amount
        );


    const consumed =
        Math.min(
            requestedAmount,
            ammunition.quantity
        );


    ammunition.quantity -=
        consumed;


    const remaining =
        ammunition.quantity;


    /*
     * Automatically clear the slot when
     * the ammunition stack reaches zero.
     */

    if (
        ammunition.quantity <= 0
    ) {

        equipment.ammunition =
            null;

    }


    return {

        success:
            consumed === requestedAmount,

        reason:
            consumed === requestedAmount
                ? null
                : "insufficient_ammunition",

        consumed,

        remaining

    };

}
/* =======================================================
   UNEQUIP ITEM
   ======================================================= */

export function unequipItem(
    equipment,
    slot
) {

    if (
        !isValidEquipment(equipment) ||
        !isValidEquipmentSlot(slot)
    ) {

        return {

            success: false,
            reason: "invalid_slot"

        };

    }


    const equippedItem =
        equipment[slot];


    if (!equippedItem) {

        return {

            success: false,
            reason: "slot_empty"

        };

    }


    equipment[slot] =
        null;


    return {

        success: true,

        slot,

        item:
            equippedItem

    };

}


/* =======================================================
   GET ALL EQUIPPED ITEMS
   ======================================================= */

export function getEquippedItems(
    equipment
) {

    if (
        !isValidEquipment(equipment)
    ) {

        return [];

    }

    return EQUIPMENT_SLOTS

        .filter(
            slot =>
                equipment[slot] !== null
        )

        .map(
            slot => ({

                slot,

                item:
                    equipment[slot]

            })
        );

}


/* =======================================================
   CLEAR EQUIPMENT
   ======================================================= */

export function clearEquipment(
    equipment
) {

    if (
        !isValidEquipment(equipment)
    ) {

        return;

    }


    for (
        const slot of EQUIPMENT_SLOTS
    ) {

        equipment[slot] =
            null;

    }

}