import {
    getPlayerCombatLevel
} from "./combatLevel.js";


/* =======================================================
   CHARACTER INTERFACE
   ======================================================= */

/*
 * Permanent Character/System interface foundation.
 *
 * This module manages:
 *
 * Combat
 * Skills
 * Inventory
 * Equipment
 * Quests
 * Map
 *
 * It does not create the visual interface yet.
 *
 * The purpose of this module is to establish the
 * underlying interface state so the visual UI can
 * be built on top of a stable system.
 */


/* =======================================================
   INTERFACE TABS
   ======================================================= */

export const CHARACTER_TABS = Object.freeze({

    COMBAT:
        "combat",

    SKILLS:
        "skills",

    INVENTORY:
        "inventory",

    EQUIPMENT:
        "equipment",

    QUESTS:
        "quests",

    MAP:
        "map"

});


/* =======================================================
   VALID TABS
   ======================================================= */

const VALID_TABS = Object.freeze(
    Object.values(
        CHARACTER_TABS
    )
);


/* =======================================================
   INTERFACE STATE
   ======================================================= */

const characterInterface = {

    isOpen:
        false,

    activeTab:
        CHARACTER_TABS.COMBAT

};


/* =======================================================
   OPEN / CLOSE
   ======================================================= */

export function openCharacterInterface() {

    characterInterface.isOpen =
        true;

    return true;

}


export function closeCharacterInterface() {

    characterInterface.isOpen =
        false;

    return true;

}


export function toggleCharacterInterface() {

    characterInterface.isOpen =
        !characterInterface.isOpen;

    return characterInterface.isOpen;

}


export function isCharacterInterfaceOpen() {

    return characterInterface.isOpen;

}


/* =======================================================
   TAB MANAGEMENT
   ======================================================= */

export function setCharacterTab(
    tab
) {

    if (
        !VALID_TABS.includes(
            tab
        )
    ) {

        return false;

    }


    characterInterface.activeTab =
        tab;


    return true;

}


export function getCharacterTab() {

    return characterInterface.activeTab;

}


export function getCharacterTabs() {

    return [
        ...VALID_TABS
    ];

}


/* =======================================================
   CHARACTER SUMMARY
   ======================================================= */

export function getCharacterCombatSummary(
    player
) {

    if (!player) {

        return null;

    }


    return {

        combatLevel:
            getPlayerCombatLevel(
                player
            ),

        attack:
            player.skills?.attack?.level ?? 1,

        strength:
            player.skills?.strength?.level ?? 1,

        defense:
            player.skills?.defense?.level ?? 1,

        vitality:
            player.skills?.vitality?.level ?? 1

    };

}


/* =======================================================
   CHARACTER INTERFACE STATE
   ======================================================= */

export function getCharacterInterfaceState() {

    return {

        isOpen:
            characterInterface.isOpen,

        activeTab:
            characterInterface.activeTab

    };

}