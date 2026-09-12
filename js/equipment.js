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
   EQUIPMENT SLOTS
   ======================================================= */

const EQUIPMENT_SLOTS = [
    "head",
    "body",
    "weapon",
    "offhand",
    "legs",
    "feet",
    "accessory"
];


/* =======================================================
   SLOT VALIDATION
   ======================================================= */

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
        !equipment ||
        !isValidEquipmentSlot(slot)
    ) {
        return null;
    }

    return equipment[slot];
}


/* =======================================================
   EQUIP ITEM
   ======================================================= */

export function equipItem(
    equipment,
    slot,
    itemId
) {
    if (
        !equipment ||
        !isValidEquipmentSlot(slot) ||
        !itemId
    ) {
        return false;
    }

    equipment[slot] = itemId;

    return true;
}


/* =======================================================
   UNEQUIP ITEM
   ======================================================= */

export function unequipItem(
    equipment,
    slot
) {
    if (
        !equipment ||
        !isValidEquipmentSlot(slot)
    ) {
        return false;
    }

    if (equipment[slot] === null) {
        return false;
    }

    equipment[slot] = null;

    return true;
}


/* =======================================================
   CHECK EQUIPPED ITEM
   ======================================================= */

export function isItemEquipped(
    equipment,
    itemId
) {
    if (
        !equipment ||
        !itemId
    ) {
        return false;
    }

    return EQUIPMENT_SLOTS.some(
        slot => equipment[slot] === itemId
    );
}


/* =======================================================
   CLEAR EQUIPMENT
   ======================================================= */

export function clearEquipment(equipment) {
    if (!equipment) {
        return;
    }

    for (const slot of EQUIPMENT_SLOTS) {
        equipment[slot] = null;
    }
}