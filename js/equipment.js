/*
 * =======================================================
 * SPACESCAPE EQUIPMENT SYSTEM
 * =======================================================
 *
 * Handles equipped items and equipment slots.
 *
 * Equipment slots:
 * head
 * body
 * weapon
 * offhand
 * legs
 * feet
 * accessory
 * =======================================================
 */

export const EQUIPMENT_SLOTS = [
    "head",
    "body",
    "weapon",
    "offhand",
    "legs",
    "feet",
    "accessory"
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
        accessory: null
    };
}


/* =======================================================
   VALIDATION
   ======================================================= */

export function isValidEquipment(equipment) {
    if (!equipment) {
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


export function isValidEquipmentSlot(slot) {
    return EQUIPMENT_SLOTS.includes(slot);
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

    for (const slot of EQUIPMENT_SLOTS) {
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
    item
) {
    if (
        !isValidEquipment(equipment) ||
        !item ||
        !item.id
    ) {
        return {
            success: false,
            reason: "invalid_item"
        };
    }

    if (
        item.type !== "weapon" &&
        item.type !== "equipment" &&
        item.type !== "armor"
    ) {
        return {
            success: false,
            reason: "not_equippable"
        };
    }

    if (!isValidEquipmentSlot(item.slot)) {
        return {
            success: false,
            reason: "invalid_slot"
        };
    }

    const slot = item.slot;

    const previousItem =
        equipment[slot];

    equipment[slot] = {
        id: item.id
    };

    return {
        success: true,
        slot,
        item,
        previousItem
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

    equipment[slot] = null;

    return {
        success: true,
        slot,
        item: equippedItem
    };
}


/* =======================================================
   GET ALL EQUIPPED ITEMS
   ======================================================= */

export function getEquippedItems(
    equipment
) {
    if (!isValidEquipment(equipment)) {
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
                item: equipment[slot]
            })
        );
}


/* =======================================================
   CLEAR EQUIPMENT
   ======================================================= */

export function clearEquipment(
    equipment
) {
    if (!isValidEquipment(equipment)) {
        return;
    }

    for (const slot of EQUIPMENT_SLOTS) {
        equipment[slot] = null;
    }
}