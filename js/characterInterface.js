import {
    player,
    getPlayerAttackLevel,
    getPlayerStrengthLevel,
    getPlayerDefenseLevel,
    getPlayerVitalityLevel,
    getPlayerAttackXP,
    getPlayerStrengthXP,
    getPlayerDefenseXP,
    getPlayerVitalityXP,
    getPlayerAttackXPToNextLevel,
    getPlayerStrengthXPToNextLevel,
    getPlayerDefenseXPToNextLevel,
    getPlayerVitalityXPToNextLevel,
    setCombatStyle,
    getCombatStyle
} from "./player.js";

import {
    getPlayerCombatLevel
} from "./combatLevel.js";

import {
    getSkillLevel,
    getCurrentSkillXP,
    getSkillXPToNextLevel,
    subscribeToSkillChanges
} from "./skills.js";

import {
    getItem,
    useItem
} from "./items.js";

import {
    removeItem,
    addItem
} from "./inventory.js";

import {
    getEquippedItem,
    getEquippedAmmunitionQuantity,
    equipItem,
    unequipItem
} from "./equipment.js";


/* =======================================================
   CHARACTER TABS
   ======================================================= */

export const CHARACTER_TABS = {

    COMBAT: "combat",

    SKILLS: "skills",

    INVENTORY: "inventory",

    EQUIPMENT: "equipment",

    QUESTS: "quests",

    MAP: "map"

};


/* =======================================================
   COMBAT STYLES
   ======================================================= */

export const CHARACTER_COMBAT_STYLES = {

    ACCURATE: "accurate",

    AGGRESSIVE: "aggressive",

    DEFENSIVE: "defensive"

};


/* =======================================================
   COMBAT STYLE DEFINITIONS
   ======================================================= */

const COMBAT_STYLE_DEFINITIONS = [

    {
        style:
            CHARACTER_COMBAT_STYLES.ACCURATE,

        label:
            "Accurate",

        description:
            "Prioritizes accuracy and grants Attack XP."

    },

    {
        style:
            CHARACTER_COMBAT_STYLES.AGGRESSIVE,

        label:
            "Aggressive",

        description:
            "Prioritizes damage and grants Strength XP."

    },

    {
        style:
            CHARACTER_COMBAT_STYLES.DEFENSIVE,

        label:
            "Defensive",

        description:
            "Prioritizes defense and grants Defense XP."

    }

];


/* =======================================================
   CHARACTER TAB DEFINITIONS
   ======================================================= */

const CHARACTER_TAB_DEFINITIONS = [

    {
        tab: CHARACTER_TABS.COMBAT,
        label: "Combat",
        icon: "⚔"
    },

    {
        tab: CHARACTER_TABS.SKILLS,
        label: "Skills",
        icon: "✦"
    },

    {
        tab: CHARACTER_TABS.INVENTORY,
        label: "Inventory",
        icon: "▣"
    },

    {
        tab: CHARACTER_TABS.EQUIPMENT,
        label: "Equipment",
        icon: "◆"
    },

    {
        tab: CHARACTER_TABS.QUESTS,
        label: "Quests",
        icon: "◇"
    },

    {
        tab: CHARACTER_TABS.MAP,
        label: "Map",
        icon: "⌖"
    }

];


/* =======================================================
   EQUIPMENT SLOT DEFINITIONS
   ======================================================= */

const EQUIPMENT_SLOT_DEFINITIONS = [

    {
        slot: "head",
        label: "HEAD"
    },

    {
        slot: "body",
        label: "BODY"
    },

    {
        slot: "weapon",
        label: "WEAPON"
    },

    {
        slot: "offhand",
        label: "OFFHAND"
    },

    {
        slot: "legs",
        label: "LEGS"
    },

    {
        slot: "feet",
        label: "FEET"
    },

    {
        slot: "accessory",
        label: "ACCESSORY"
    },

    {
        slot: "ammunition",
        label: "AMMUNITION"
    }

];


/* =======================================================
   CHARACTER STATE
   ======================================================= */

const characterState = {

    isOpen: false,

    activeTab:
        CHARACTER_TABS.COMBAT,

    gameAvailable: false,

    selectedInventoryItem: null,

    selectedEquipmentSlot: null

};


/* =======================================================
   DOM ELEMENTS
   ======================================================= */

let characterButton = null;

let characterInterface = null;

let characterContent = null;


/* =======================================================
   COMBAT STYLE HELPERS
   ======================================================= */

function normalizeCombatStyle(
    style
) {

    if (
        Object.values(
            CHARACTER_COMBAT_STYLES
        ).includes(style)
    ) {

        return style;

    }

    return CHARACTER_COMBAT_STYLES.ACCURATE;

}


/* =======================================================
   COMBAT STYLE DISPLAY NAME
   ======================================================= */

function getCombatStyleDisplayName(
    style
) {

    const normalizedStyle =
        normalizeCombatStyle(
            style
        );

    const definition =
        COMBAT_STYLE_DEFINITIONS.find(
            entry =>
                entry.style ===
                normalizedStyle
        );

    if (definition) {

        return definition.label;

    }

    return "Accurate";

}


/* =======================================================
   GET CURRENT COMBAT STYLE
   ======================================================= */

export function getCharacterCombatStyle() {

    return normalizeCombatStyle(
        getCombatStyle()
    );

}


/* =======================================================
   SET COMBAT STYLE
   ======================================================= */

export function setCharacterCombatStyle(
    style
) {

    const normalizedStyle =
        normalizeCombatStyle(
            style
        );


    const changed =
        setCombatStyle(
            normalizedStyle
        );


    if (!changed) {

        return getCharacterCombatStyle();

    }


    if (
        characterState.isOpen &&
        characterState.activeTab ===
            CHARACTER_TABS.COMBAT
    ) {

        updateCharacterInterface();

    }


    return getCharacterCombatStyle();

}


/* =======================================================
   CREATE COMBAT STYLE BUTTON
   ======================================================= */

function createCombatStyleButton(
    definition
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "combat-style-button";


    button.dataset.style =
        definition.style;


    const selectedStyle =
        getCharacterCombatStyle();


    if (
        selectedStyle ===
        definition.style
    ) {

        button.classList.add(
            "active"
        );

    }


    const name =
        document.createElement(
            "div"
        );

    name.className =
        "combat-style-button-name";

    name.textContent =
        definition.label;


    const description =
        document.createElement(
            "div"
        );

    description.className =
        "combat-style-button-description";

    description.textContent =
        definition.description;


    button.appendChild(
        name
    );

    button.appendChild(
        description
    );


    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            setCharacterCombatStyle(
                definition.style
            );

        }
    );


    return button;

}


/* =======================================================
   CREATE COMBAT STYLE SELECTOR
   ======================================================= */

function createCombatStyleSelector() {

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "combat-style-section";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "character-section-title";

    title.textContent =
        "COMBAT STYLE";


    const current =
        document.createElement(
            "div"
        );

    current.className =
        "combat-style-current";


    const currentLabel =
        document.createElement(
            "div"
        );

    currentLabel.className =
        "combat-style-current-label";

    currentLabel.textContent =
        "CURRENT STYLE";


    const currentValue =
        document.createElement(
            "div"
        );

    currentValue.className =
        "combat-style-current-value";

    currentValue.textContent =
        getCombatStyleDisplayName(
            getCharacterCombatStyle()
        );


    current.appendChild(
        currentLabel
    );

    current.appendChild(
        currentValue
    );


    const buttonContainer =
        document.createElement(
            "div"
        );

    buttonContainer.className =
        "combat-style-options";


    for (
        const definition
        of COMBAT_STYLE_DEFINITIONS
    ) {

        buttonContainer.appendChild(
            createCombatStyleButton(
                definition
            )
        );

    }


    container.appendChild(
        title
    );

    container.appendChild(
        current
    );

    container.appendChild(
        buttonContainer
    );


    return container;

}


/* =======================================================
   STATE FUNCTIONS
   ======================================================= */

export function openCharacterInterface() {

    if (
        !characterState.gameAvailable
    ) {

        return;

    }

    characterState.isOpen =
        true;

    updateCharacterInterface();

}


export function closeCharacterInterface() {

    characterState.isOpen =
        false;

    removeInventoryItemPopup();

    removeEquipmentItemPopup();

    updateCharacterInterface();

}


export function toggleCharacterInterface() {

    if (
        !characterState.gameAvailable
    ) {

        return;

    }

    characterState.isOpen =
        !characterState.isOpen;

    updateCharacterInterface();

}


export function isCharacterInterfaceOpen() {

    return characterState.isOpen;

}


export function setCharacterTab(
    tab
) {

    if (
        !Object.values(
            CHARACTER_TABS
        ).includes(tab)
    ) {

        return false;

    }


    characterState.activeTab =
        tab;


    characterState.selectedEquipmentSlot =
        null;


    removeEquipmentItemPopup();


    if (
        tab !==
        CHARACTER_TABS.INVENTORY
    ) {

        characterState.selectedInventoryItem =
            null;

        removeInventoryItemPopup();

    }


    updateCharacterInterface();

    return true;

}


export function getCharacterTab() {

    return characterState.activeTab;

}


export function refreshCharacterInterface() {

    updateCharacterInterface();

}


export function getCharacterTabs() {

    return Object.values(
        CHARACTER_TABS
    );

}


/* =======================================================
   GAME AVAILABILITY
   ======================================================= */

export function setCharacterInterfaceAvailability(
    available
) {

    characterState.gameAvailable =
        Boolean(
            available
        );


    if (
        !characterState.gameAvailable
    ) {

        characterState.isOpen =
            false;

        characterState.selectedInventoryItem =
            null;

        characterState.selectedEquipmentSlot =
            null;

        removeInventoryItemPopup();

        removeEquipmentItemPopup();

    }


    updateCharacterInterface();

}


/* =======================================================
   COMBAT SUMMARY
   ======================================================= */

export function getCharacterCombatSummary(
    currentPlayer = player
) {

    return {

        combatLevel:
            getPlayerCombatLevel(
                currentPlayer
            ),

        attack:
            getPlayerAttackLevel(
                currentPlayer
            ),

        strength:
            getPlayerStrengthLevel(
                currentPlayer
            ),

        defense:
            getPlayerDefenseLevel(
                currentPlayer
            ),

        vitality:
            getPlayerVitalityLevel(
                currentPlayer
            )

    };

}


/* =======================================================
   FORMAT XP
   ======================================================= */

function formatXP(
    value
) {

    return Number.isFinite(
        value
    )
        ? value.toLocaleString()
        : "0";

}


/* =======================================================
   CREATE SKILL CARD
   ======================================================= */

function createSkillCard(
    skillName,
    displayName,
    skillLevel,
    currentXP,
    xpToNextLevel
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "skill-card";

    card.dataset.skill =
        skillName;


    const top =
        document.createElement(
            "div"
        );

    top.className =
        "skill-card-top";


    const name =
        document.createElement(
            "div"
        );

    name.className =
        "skill-name";

    name.textContent =
        displayName;


    const level =
        document.createElement(
            "div"
        );

    level.className =
        "skill-level";

    level.textContent =
        skillLevel >= 99
            ? "99"
            : String(
                skillLevel
            );


    top.appendChild(
        name
    );

    top.appendChild(
        level
    );


    const xp =
        document.createElement(
            "div"
        );

    xp.className =
        "skill-xp";


    if (
        skillLevel >= 99
    ) {

        xp.textContent =
            "MAX LEVEL";

    } else {

        const totalXP =
            currentXP +
            xpToNextLevel;

        xp.textContent =
            `${formatXP(currentXP)} / ${formatXP(totalXP)} XP`;

    }


    const next =
        document.createElement(
            "div"
        );

    next.className =
        "skill-next";


    if (
        skillLevel >= 99
    ) {

        next.textContent =
            "Maximum level";

    } else {

        next.textContent =
            `${formatXP(xpToNextLevel)} XP to next level`;

    }


    const progress =
        document.createElement(
            "div"
        );

    progress.className =
        "skill-progress";


    const progressBar =
        document.createElement(
            "div"
        );

    progressBar.className =
        "skill-progress-bar";


    let progressPercent =
        0;


    if (
        skillLevel >= 99
    ) {

        progressPercent =
            100;

    } else {

        const totalXP =
            currentXP +
            xpToNextLevel;


        if (
            totalXP > 0
        ) {

            progressPercent =
                (
                    currentXP /
                    totalXP
                ) *
                100;

        }

    }


    progressBar.style.width =
        `${Math.max(
            0,
            Math.min(
                100,
                progressPercent
            )
        )}%`;


    progress.appendChild(
        progressBar
    );


    card.appendChild(
        top
    );

    card.appendChild(
        xp
    );

    card.appendChild(
        next
    );

    card.appendChild(
        progress
    );


    return card;

}


/* =======================================================
   SKILL DISPLAY NAME
   ======================================================= */

function getSkillDisplayName(
    skillName
) {

    const names = {

        attack:
            "Attack",

        strength:
            "Strength",

        defense:
            "Defense",

        vitality:
            "Vitality",

        ballistics:
            "Ballistics",

        flux:
            "Flux",

        mining:
            "Mining",

        salvaging:
            "Salvaging",

        xenobiology:
            "Xenobiology",

        engineering:
            "Engineering",

        crafting:
            "Crafting",

        hacking:
            "Hacking",

        navigation:
            "Navigation"

    };


    return (
        names[skillName] ||
        skillName
    );

}


/* =======================================================
   CREATE SKILL SECTION
   ======================================================= */

function createSkillSection(
    titleText,
    skillNames
) {

    const section =
        document.createElement(
            "div"
        );

    section.className =
        "skills-section";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "character-section-title";

    title.textContent =
        titleText;


    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "skills-grid";


    for (
        const skillName
        of skillNames
    ) {

        const skillLevel =
            getSkillLevel(
                player.skills,
                skillName
            );


        const currentXP =
            getCurrentSkillXP(
                player.skills,
                skillName
            );


        const xpToNextLevel =
            getSkillXPToNextLevel(
                player.skills,
                skillName
            );


        const card =
            createSkillCard(
                skillName,
                getSkillDisplayName(
                    skillName
                ),
                skillLevel,
                currentXP,
                xpToNextLevel
            );


        grid.appendChild(
            card
        );

    }


    section.appendChild(
        title
    );

    section.appendChild(
        grid
    );


    return section;

}


/* =======================================================
   CREATE COMBAT SKILL CARD
   ======================================================= */

function createCombatSkillCard(
    name,
    level,
    xp,
    xpToNext
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "combat-skill-card";


    const skillName =
        document.createElement(
            "div"
        );

    skillName.className =
        "combat-skill-name";

    skillName.textContent =
        name;


    const skillLevel =
        document.createElement(
            "div"
        );

    skillLevel.className =
        "combat-skill-level";

    skillLevel.textContent =
        level;


    const skillXP =
        document.createElement(
            "div"
        );

    skillXP.className =
        "combat-skill-xp";


    if (
        level >= 99
    ) {

        skillXP.textContent =
            "MAX LEVEL";

    } else {

        const totalXP =
            xp +
            xpToNext;

        skillXP.textContent =
            `${formatXP(xp)} / ${formatXP(totalXP)} XP`;

    }


    const skillNext =
        document.createElement(
            "div"
        );

    skillNext.className =
        "combat-skill-next";


    if (
        level >= 99
    ) {

        skillNext.textContent =
            "Maximum level";

    } else {

        skillNext.textContent =
            `${formatXP(xpToNext)} XP to next level`;

    }


    card.appendChild(
        skillName
    );

    card.appendChild(
        skillLevel
    );

    card.appendChild(
        skillXP
    );

    card.appendChild(
        skillNext
    );


    return card;

}


/* =======================================================
   RENDER COMBAT TAB
   ======================================================= */

function renderCombatTab() {

    characterContent.innerHTML =
        "";


    const summary =
        getCharacterCombatSummary(
            player
        );


    const combatLevelPanel =
        document.createElement(
            "div"
        );

    combatLevelPanel.className =
        "combat-level-panel";


    const combatLabel =
        document.createElement(
            "div"
        );

    combatLabel.className =
        "combat-level-label";

    combatLabel.textContent =
        "COMBAT LEVEL";


    const combatLevel =
        document.createElement(
            "div"
        );

    combatLevel.className =
        "combat-level-value";

    combatLevel.textContent =
        summary.combatLevel;


    combatLevelPanel.appendChild(
        combatLabel
    );

    combatLevelPanel.appendChild(
        combatLevel
    );


    characterContent.appendChild(
        combatLevelPanel
    );


    const skillsTitle =
        document.createElement(
            "div"
        );

    skillsTitle.className =
        "character-section-title";

    skillsTitle.textContent =
        "COMBAT SKILLS";


    characterContent.appendChild(
        skillsTitle
    );


    const combatGrid =
        document.createElement(
            "div"
        );

    combatGrid.className =
        "combat-skill-grid";


    const combatSkills = [

        [
            "Attack",
            summary.attack,
            getPlayerAttackXP(),
            getPlayerAttackXPToNextLevel()
        ],

        [
            "Strength",
            summary.strength,
            getPlayerStrengthXP(),
            getPlayerStrengthXPToNextLevel()
        ],

        [
            "Defense",
            summary.defense,
            getPlayerDefenseXP(),
            getPlayerDefenseXPToNextLevel()
        ],

        [
            "Vitality",
            summary.vitality,
            getPlayerVitalityXP(),
            getPlayerVitalityXPToNextLevel()
        ]

    ];


    for (
        const [
            name,
            level,
            xp,
            xpToNext
        ]
        of combatSkills
    ) {

        combatGrid.appendChild(
            createCombatSkillCard(
                name,
                level,
                xp,
                xpToNext
            )
        );

    }


    characterContent.appendChild(
        combatGrid
    );


    characterContent.appendChild(
        createCombatStyleSelector()
    );


    const statusTitle =
        document.createElement(
            "div"
        );

    statusTitle.className =
        "character-section-title";

    statusTitle.textContent =
        "CURRENT STATUS";


    characterContent.appendChild(
        statusTitle
    );


    const status =
        document.createElement(
            "div"
        );

    status.className =
        "character-status-grid";


    const currentStyle =
        getCharacterCombatStyle();


    const equippedWeapon =
        getEquippedItem(
            player.equipment,
            "weapon"
        );


    const equippedAmmunition =
        getEquippedItem(
            player.equipment,
            "ammunition"
        );


    const weapon =
        equippedWeapon
            ? getItem(
                equippedWeapon.id
            )
            : null;


    const ammunition =
        equippedAmmunition
            ? getItem(
                equippedAmmunition.id
            )
            : null;


    const statusRows = [

        [
            "Health",
            `${player.health.current} / ${player.health.maximum}`
        ],

        [
            "Energy",
            `${player.energy.current} / ${player.energy.maximum}`
        ],

        [
            "Combat Style",
            getCombatStyleDisplayName(
                currentStyle
            )
        ],

        [
            "Weapon",
            weapon
                ? weapon.name
                : "None"
        ],

        [
            "Ammunition",
            ammunition
                ? `${ammunition.name} ×${getEquippedAmmunitionQuantity(player.equipment)}`
                : "None"
        ]

    ];


    for (
        const [
            label,
            value
        ]
        of statusRows
    ) {

        const row =
            document.createElement(
                "div"
            );

        row.className =
            "character-status-row";


        const labelElement =
            document.createElement(
                "span"
            );

        labelElement.textContent =
            label;


        const valueElement =
            document.createElement(
                "strong"
            );

        valueElement.textContent =
            value;


        row.appendChild(
            labelElement
        );

        row.appendChild(
            valueElement
        );


        status.appendChild(
            row
        );

    }


    characterContent.appendChild(
        status
    );

}


/* =======================================================
   RENDER SKILLS TAB
   ======================================================= */

function renderSkillsTab() {

    characterContent.innerHTML =
        "";


    const heading =
        document.createElement(
            "div"
        );

    heading.className =
        "character-skills-heading";

    heading.textContent =
        "SKILLS";


    const description =
        document.createElement(
            "div"
        );

    description.className =
        "character-skills-description";

    description.textContent =
        "Train your abilities to improve your character and unlock new capabilities.";


    characterContent.appendChild(
        heading
    );

    characterContent.appendChild(
        description
    );


    characterContent.appendChild(
        createSkillSection(
            "COMBAT",
            [
                "attack",
                "strength",
                "defense",
                "vitality"
            ]
        )
    );


    characterContent.appendChild(
        createSkillSection(
            "COMBAT SPECIALIZATION",
            [
                "ballistics",
                "flux"
            ]
        )
    );


    characterContent.appendChild(
        createSkillSection(
            "GATHERING",
            [
                "mining",
                "salvaging",
                "xenobiology"
            ]
        )
    );


    characterContent.appendChild(
        createSkillSection(
            "TECHNICAL",
            [
                "engineering",
                "crafting",
                "hacking",
                "navigation"
            ]
        )
    );

}


/* =======================================================
   INVENTORY ITEM SYMBOL
   ======================================================= */

function getInventoryItemSymbol(
    item
) {

    if (!item) {

        return "•";

    }


    if (
        item.type ===
        "consumable"
    ) {

        return "+";

    }


    if (
        item.type ===
        "ammunition"
    ) {

        return "▰";

    }


    if (
        item.type ===
        "weapon"
    ) {

        return "◆";

    }


    if (
        item.type ===
        "armor"
    ) {

        return "◇";

    }


    if (
        item.type ===
        "equipment"
    ) {

        return "▣";

    }


    return "•";

}


/* =======================================================
   REMOVE INVENTORY POPUP
   ======================================================= */

function removeInventoryItemPopup() {

    if (!characterInterface) {

        return;

    }


    const existingPopup =
        characterInterface.querySelector(
            ".inventory-item-popup-overlay"
        );


    if (existingPopup) {

        existingPopup.remove();

    }

}


/* =======================================================
   REMOVE EQUIPMENT POPUP
   ======================================================= */

function removeEquipmentItemPopup() {

    if (!characterInterface) {

        return;

    }


    const existingPopup =
        characterInterface.querySelector(
            ".equipment-item-popup-overlay"
        );


    if (existingPopup) {

        existingPopup.remove();

    }

}


/* =======================================================
   CREATE INVENTORY SLOT
   ======================================================= */

function createInventorySlot(
    inventoryItem,
    slotIndex
) {

    const slot =
        document.createElement(
            "div"
        );

    slot.className =
        "skill-card inventory-slot";


    if (inventoryItem) {

        slot.classList.add(
            "inventory-slot-filled"
        );

        slot.style.cursor =
            "pointer";

    } else {

        slot.classList.add(
            "inventory-slot-empty"
        );

        slot.style.cursor =
            "default";

    }


    if (!inventoryItem) {

        const emptyLabel =
            document.createElement(
                "div"
            );

        emptyLabel.className =
            "skill-name";

        emptyLabel.textContent =
            `SLOT ${slotIndex + 1}`;

        emptyLabel.style.opacity =
            "0.35";


        slot.appendChild(
            emptyLabel
        );


        return slot;

    }


    const item =
        getItem(
            inventoryItem.id
        );


    if (!item) {

        return slot;

    }


    if (
        characterState.selectedInventoryItem ===
        inventoryItem.id
    ) {

        slot.classList.add(
            "inventory-slot-selected"
        );

    }


    const top =
        document.createElement(
            "div"
        );

    top.className =
        "skill-card-top";


    const itemName =
        document.createElement(
            "div"
        );

    itemName.className =
        "skill-name";

    itemName.textContent =
        item.name;


    const quantity =
        document.createElement(
            "div"
        );

    quantity.className =
        "skill-level";

    quantity.textContent =
        `×${inventoryItem.quantity}`;


    top.appendChild(
        itemName
    );

    top.appendChild(
        quantity
    );


    const symbol =
        document.createElement(
            "div"
        );

    symbol.className =
        "inventory-item-symbol";

    symbol.textContent =
        getInventoryItemSymbol(
            item
        );


    const type =
        document.createElement(
            "div"
        );

    type.className =
        "skill-next";

    type.textContent =
        String(
            item.type
        ).toUpperCase();


    slot.appendChild(
        top
    );

    slot.appendChild(
        symbol
    );

    slot.appendChild(
        type
    );


    slot.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            characterState.selectedInventoryItem =
                inventoryItem.id;

            updateCharacterInterface();

        }
    );


    return slot;

}


/* =======================================================
   CREATE INVENTORY ACTION BUTTON
   ======================================================= */

function createInventoryActionButton(
    label,
    enabled,
    action,
    primary = false
) {

    const button =
        document.createElement(
            "button"
        );

    button.className =
        "inventory-item-popup-button";


    if (primary) {

        button.classList.add(
            "primary"
        );

    }


    button.textContent =
        label;

    button.disabled =
        !enabled;


    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (!enabled) {

                return;

            }


            action();

        }
    );


    return button;

}


/* =======================================================
   RENDER INVENTORY TAB
   ======================================================= */

function renderInventoryTab() {

    characterContent.innerHTML =
        "";


    removeInventoryItemPopup();


    const inventory =
        player.inventory;


    if (
        !inventory ||
        !Array.isArray(
            inventory.items
        )
    ) {

        return;

    }


    const heading =
        document.createElement(
            "div"
        );

    heading.className =
        "character-skills-heading";

    heading.textContent =
        "INVENTORY";


    const usedSlots =
        inventory.items.length;


    const capacity =
        inventory.capacity;


    const capacityText =
        document.createElement(
            "div"
        );

    capacityText.className =
        "character-skills-description";

    capacityText.textContent =
        `${usedSlots} / ${capacity} SLOTS USED`;


    characterContent.appendChild(
        heading
    );

    characterContent.appendChild(
        capacityText
    );


    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "skills-grid inventory-grid";


    for (
        let index = 0;
        index < capacity;
        index++
    ) {

        const inventoryItem =
            inventory.items[index] ||
            null;


        grid.appendChild(
            createInventorySlot(
                inventoryItem,
                index
            )
        );

    }


    characterContent.appendChild(
        grid
    );


    const selectedItemId =
        characterState.selectedInventoryItem;


    if (!selectedItemId) {

        return;

    }


    const selectedInventoryItem =
        inventory.items.find(
            item =>
                item.id ===
                selectedItemId
        );


    if (!selectedInventoryItem) {

        characterState.selectedInventoryItem =
            null;

        return;

    }


    const selectedItem =
        getItem(
            selectedInventoryItem.id
        );


    if (!selectedItem) {

        characterState.selectedInventoryItem =
            null;

        return;

    }


    createInventoryItemPopup(
        selectedInventoryItem,
        selectedItem
    );

}
/* =======================================================
   EQUIPMENT SLOT SYMBOL
   ======================================================= */

function getEquipmentSlotSymbol(
    slot
) {

    const symbols = {

        head: "◈",

        body: "▣",

        weapon: "◆",

        offhand: "◇",

        legs: "▥",

        feet: "⌄",

        accessory: "✦",

        ammunition: "▰"

    };


    return (
        symbols[slot] ||
        "•"
    );

}


/* =======================================================
   CREATE EQUIPMENT SLOT
   ======================================================= */

function createEquipmentSlot(
    definition
) {

    const equippedItem =
        getEquippedItem(
            player.equipment,
            definition.slot
        );


    const slot =
        document.createElement(
            "div"
        );

    slot.className =
        "skill-card inventory-slot";


    if (equippedItem) {

        slot.classList.add(
            "inventory-slot-filled"
        );

        slot.style.cursor =
            "pointer";

    } else {

        slot.classList.add(
            "inventory-slot-empty"
        );

        slot.style.cursor =
            "default";

    }


    const top =
        document.createElement(
            "div"
        );

    top.className =
        "skill-card-top";


    const slotName =
        document.createElement(
            "div"
        );

    slotName.className =
        "skill-name";

    slotName.textContent =
        definition.label;


    top.appendChild(
        slotName
    );


    slot.appendChild(
        top
    );


    if (!equippedItem) {

        const emptySymbol =
            document.createElement(
                "div"
            );

        emptySymbol.className =
            "inventory-item-symbol";

        emptySymbol.textContent =
            getEquipmentSlotSymbol(
                definition.slot
            );

        emptySymbol.style.opacity =
            "0.25";


        const emptyText =
            document.createElement(
                "div"
            );

        emptyText.className =
            "skill-next";

        emptyText.textContent =
            "EMPTY";


        slot.appendChild(
            emptySymbol
        );

        slot.appendChild(
            emptyText
        );


        return slot;

    }


    const item =
        getItem(
            equippedItem.id
        );


    if (!item) {

        return slot;

    }


    const symbol =
        document.createElement(
            "div"
        );

    symbol.className =
        "inventory-item-symbol";

    symbol.textContent =
        getInventoryItemSymbol(
            item
        );


    const itemName =
        document.createElement(
            "div"
        );

    itemName.className =
        "skill-next";

    if (
        definition.slot ===
        "ammunition"
    ) {

        itemName.textContent =
            `${item.name} ×${getEquippedAmmunitionQuantity(player.equipment)}`;

    } else {

        itemName.textContent =
            item.name;

    }


    slot.appendChild(
        symbol
    );

    slot.appendChild(
        itemName
    );


    if (
        characterState.selectedEquipmentSlot ===
        definition.slot
    ) {

        slot.classList.add(
            "inventory-slot-selected"
        );

    }


    slot.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            characterState.selectedEquipmentSlot =
                definition.slot;

            updateCharacterInterface();

        }
    );


    return slot;

}


/* =======================================================
   CREATE EQUIPMENT ITEM POPUP
   ======================================================= */

function createEquipmentItemPopup(
    slot,
    item
) {

    removeEquipmentItemPopup();


    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "inventory-item-popup-overlay equipment-item-popup-overlay";


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                characterState.selectedEquipmentSlot =
                    null;

                removeEquipmentItemPopup();

                updateCharacterInterface();

            }

        }
    );


    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "inventory-item-popup";


    popup.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    const header =
        document.createElement(
            "div"
        );

    header.className =
        "inventory-item-popup-header";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "inventory-item-popup-title";

    title.textContent =
        item.name;


    const closeButton =
        document.createElement(
            "button"
        );

    closeButton.className =
        "inventory-item-popup-close";

    closeButton.textContent =
        "×";

    closeButton.title =
        "Close";


    closeButton.addEventListener(
        "click",
        () => {

            characterState.selectedEquipmentSlot =
                null;

            removeEquipmentItemPopup();

            updateCharacterInterface();

        }
    );


    header.appendChild(
        title
    );

    header.appendChild(
        closeButton
    );


    const info =
        document.createElement(
            "div"
        );

    info.className =
        "inventory-item-popup-info";


    const equippedQuantity =
        slot === "ammunition"
            ? getEquippedAmmunitionQuantity(
                player.equipment
            )
            : null;


    const type =
        document.createElement(
            "div"
        );

    type.className =
        "inventory-item-popup-type";


    if (
        slot === "ammunition"
    ) {

        type.textContent =
            `${String(
                item.type
            ).toUpperCase()} • EQUIPPED • QUANTITY ${equippedQuantity}`;

    } else {

        type.textContent =
            `${String(
                item.type
            ).toUpperCase()} • EQUIPPED`;

    }


    info.appendChild(
        type
    );


    const slotText =
        document.createElement(
            "div"
        );

    slotText.className =
        "inventory-item-popup-effect";

    slotText.textContent =
        `Slot: ${String(
            slot
        ).toUpperCase()}`;


    info.appendChild(
        slotText
    );


    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "inventory-item-popup-actions";


    const unequipButton =
        createInventoryActionButton(
            "UNEQUIP",
            true,
            () => {

                const quantity =
                    slot === "ammunition"
                        ? getEquippedAmmunitionQuantity(
                            player.equipment
                        )
                        : 1;


                if (
                    quantity <= 0
                ) {

                    return;

                }


                /*
                 * Add the item back to inventory FIRST.
                 * If inventory is full, the item remains
                 * equipped and nothing is lost.
                 */

                const added =
                    addItem(
                        player.inventory,
                        item.id,
                        quantity
                    );


                if (!added) {

                    return;

                }


                const result =
                    unequipItem(
                        player.equipment,
                        slot
                    );


                if (!result.success) {

                    removeItem(
                        player.inventory,
                        item.id,
                        quantity
                    );

                    return;

                }


                characterState.selectedEquipmentSlot =
                    null;


                updateCharacterInterface();

            },
            true
        );


    actions.appendChild(
        unequipButton
    );


    popup.appendChild(
        header
    );

    popup.appendChild(
        info
    );

    popup.appendChild(
        actions
    );


    overlay.appendChild(
        popup
    );


    characterInterface.appendChild(
        overlay
    );

}


/* =======================================================
   EQUIP INVENTORY ITEM
   ======================================================= */

function equipInventoryItem(
    itemId
) {

    const item =
        getItem(
            itemId
        );


    if (!item) {

        return false;

    }


    const isAmmunition =
        item.type === "ammunition" ||
        item.slot === "ammunition";


    if (
        !isAmmunition &&
        item.type !== "weapon" &&
        item.type !== "equipment" &&
        item.type !== "armor"
    ) {

        return false;

    }


    if (!item.slot) {

        return false;

    }


    const inventoryItem =
        player.inventory.items.find(
            currentItem =>
                currentItem.id ===
                itemId
        );


    if (!inventoryItem) {

        return false;

    }


    const quantityToEquip =
        isAmmunition
            ? inventoryItem.quantity
            : 1;


    if (
        !Number.isFinite(
            quantityToEquip
        ) ||
        quantityToEquip <= 0
    ) {

        return false;

    }


    const currentEquippedItem =
        getEquippedItem(
            player.equipment,
            item.slot
        );


    const currentEquippedQuantity =
        (
            isAmmunition &&
            currentEquippedItem &&
            Number.isFinite(
                currentEquippedItem.quantity
            )
        )
            ? currentEquippedItem.quantity
            : 0;


    /*
     * Remove the inventory item first.
     *
     * For ammunition, the entire stack is moved
     * into the ammunition equipment slot.
     */

    const removed =
        removeItem(
            player.inventory,
            itemId,
            quantityToEquip
        );


    if (!removed) {

        return false;

    }


    const result =
        equipItem(
            player.equipment,
            item,
            player,
            isAmmunition
                ? quantityToEquip
                : null
        );


    if (!result.success) {

        addItem(
            player.inventory,
            itemId,
            quantityToEquip
        );

        return false;

    }


    /*
     * Return the previously equipped item
     * to inventory.
     */

    if (
        currentEquippedItem &&
        currentEquippedItem.id
    ) {

        const previousQuantity =
            (
                isAmmunition &&
                Number.isFinite(
                    currentEquippedItem.quantity
                )
            )
                ? currentEquippedItem.quantity
                : 1;


        const returned =
            addItem(
                player.inventory,
                currentEquippedItem.id,
                previousQuantity
            );


        if (!returned) {

            /*
             * Roll back the newly equipped item.
             */

            unequipItem(
                player.equipment,
                item.slot
            );


            /*
             * Restore the newly selected
             * inventory stack.
             */

            addItem(
                player.inventory,
                itemId,
                quantityToEquip
            );


            /*
             * Restore the previous equipment.
             */

            const previousItem =
                getItem(
                    currentEquippedItem.id
                );


            if (previousItem) {

                equipItem(
                    player.equipment,
                    previousItem,
                    player,
                    isAmmunition
                        ? previousQuantity
                        : null
                );

            }


            return false;

        }

    }


    characterState.selectedInventoryItem =
        null;


    removeInventoryItemPopup();


    return true;

}


/* =======================================================
   CREATE EQUIPMENT ACTION FROM INVENTORY
   ======================================================= */

function createEquipmentInventoryAction(
    item
) {

    if (!item) {

        return null;

    }


    const isAmmunition =
        item.type === "ammunition" ||
        item.slot === "ammunition";


    const canEquip =
        (
            isAmmunition ||
            item.type === "weapon" ||
            item.type === "equipment" ||
            item.type === "armor"
        ) &&
        Boolean(
            item.slot
        );


    if (!canEquip) {

        return null;

    }


    return createInventoryActionButton(
        isAmmunition
            ? "EQUIP AMMO"
            : "EQUIP",
        true,
        () => {

            const equipped =
                equipInventoryItem(
                    item.id
                );


            if (!equipped) {

                return;

            }


            updateCharacterInterface();

        },
        true
    );

}


/* =======================================================
   GET INVENTORY POPUP ACTIONS
   ======================================================= */

function getInventoryPopupActions(
    inventoryItem,
    item
) {

    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "inventory-item-popup-actions";


    const canUse =
        item.type ===
        "consumable";


    const useButton =
        createInventoryActionButton(
            "USE",
            canUse,
            () => {

                const used =
                    useItem(
                        player,
                        player.inventory,
                        inventoryItem.id
                    );


                if (!used) {

                    return;

                }


                const stillExists =
                    player.inventory.items.some(
                        currentItem =>
                            currentItem.id ===
                            inventoryItem.id
                    );


                if (!stillExists) {

                    characterState.selectedInventoryItem =
                        null;

                }


                updateCharacterInterface();

            },
            true
        );


    const equipButton =
        createEquipmentInventoryAction(
            item
        );


    const dropButton =
        createInventoryActionButton(
            "DROP 1",
            true,
            () => {

                const removed =
                    removeItem(
                        player.inventory,
                        inventoryItem.id,
                        1
                    );


                if (!removed) {

                    return;

                }


                const stillExists =
                    player.inventory.items.some(
                        currentItem =>
                            currentItem.id ===
                            inventoryItem.id
                    );


                if (!stillExists) {

                    characterState.selectedInventoryItem =
                        null;

                }


                updateCharacterInterface();

            }
        );


    if (equipButton) {

        actions.appendChild(
            equipButton
        );

    }


    actions.appendChild(
        useButton
    );

    actions.appendChild(
        dropButton
    );


    return actions;

}


/* =======================================================
   RENDER EQUIPMENT TAB
   ======================================================= */

function renderEquipmentTab() {

    characterContent.innerHTML =
        "";


    removeEquipmentItemPopup();


    const heading =
        document.createElement(
            "div"
        );

    heading.className =
        "character-skills-heading";

    heading.textContent =
        "EQUIPMENT";


    const description =
        document.createElement(
            "div"
        );

    description.className =
        "character-skills-description";

    description.textContent =
        "Manage weapons, armor, gear, and ammunition currently equipped by your character.";


    characterContent.appendChild(
        heading
    );

    characterContent.appendChild(
        description
    );


    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "skills-grid inventory-grid";


    for (
        const definition
        of EQUIPMENT_SLOT_DEFINITIONS
    ) {

        grid.appendChild(
            createEquipmentSlot(
                definition
            )
        );

    }


    characterContent.appendChild(
        grid
    );


    const selectedSlot =
        characterState.selectedEquipmentSlot;


    if (!selectedSlot) {

        return;

    }


    const equippedItem =
        getEquippedItem(
            player.equipment,
            selectedSlot
        );


    if (!equippedItem) {

        characterState.selectedEquipmentSlot =
            null;

        return;

    }


    const item =
        getItem(
            equippedItem.id
        );


    if (!item) {

        characterState.selectedEquipmentSlot =
            null;

        return;

    }


    createEquipmentItemPopup(
        selectedSlot,
        item
    );

}


/* =======================================================
   CREATE INVENTORY ITEM POPUP
   ======================================================= */

function createInventoryItemPopup(
    inventoryItem,
    item
) {

    removeInventoryItemPopup();


    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "inventory-item-popup-overlay";


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                characterState.selectedInventoryItem =
                    null;

                removeInventoryItemPopup();

                updateCharacterInterface();

            }

        }
    );


    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "inventory-item-popup";


    popup.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    const header =
        document.createElement(
            "div"
        );

    header.className =
        "inventory-item-popup-header";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "inventory-item-popup-title";

    title.textContent =
        item.name;


    const closeButton =
        document.createElement(
            "button"
        );

    closeButton.className =
        "inventory-item-popup-close";

    closeButton.textContent =
        "×";

    closeButton.title =
        "Close";


    closeButton.addEventListener(
        "click",
        () => {

            characterState.selectedInventoryItem =
                null;

            removeInventoryItemPopup();

            updateCharacterInterface();

        }
    );


    header.appendChild(
        title
    );

    header.appendChild(
        closeButton
    );


    const info =
        document.createElement(
            "div"
        );

    info.className =
        "inventory-item-popup-info";


    const type =
        document.createElement(
            "div"
        );

    type.className =
        "inventory-item-popup-type";

    type.textContent =
        `${String(
            item.type
        ).toUpperCase()} • QUANTITY ${inventoryItem.quantity}`;


    info.appendChild(
        type
    );


    if (
        item.effect &&
        item.effect.type ===
            "heal"
    ) {

        const effect =
            document.createElement(
                "div"
            );

        effect.className =
            "inventory-item-popup-effect";

        effect.textContent =
            `Restores ${item.effect.amount} HP.`;


        info.appendChild(
            effect
        );

    }


    const actions =
        getInventoryPopupActions(
            inventoryItem,
            item
        );


    popup.appendChild(
        header
    );

    popup.appendChild(
        info
    );

    popup.appendChild(
        actions
    );


    overlay.appendChild(
        popup
    );


    characterInterface.appendChild(
        overlay
    );

}


/* =======================================================
   RENDER PLACEHOLDER TAB
   ======================================================= */

function renderComingSoonTab(
    title
) {

    characterContent.innerHTML =
        "";


    const container =
        document.createElement(
            "div"
        );

    container.className =
        "character-coming-soon";


    const heading =
        document.createElement(
            "div"
        );

    heading.className =
        "character-coming-soon-title";

    heading.textContent =
        title;


    const message =
        document.createElement(
            "div"
        );

    message.className =
        "character-coming-soon-text";

    message.textContent =
        "This system is under construction.";


    container.appendChild(
        heading
    );

    container.appendChild(
        message
    );


    characterContent.appendChild(
        container
    );

}


/* =======================================================
   UPDATE INTERFACE
   ======================================================= */

function updateCharacterInterface() {

    if (
        !characterInterface ||
        !characterButton
    ) {

        return;

    }


    if (
        characterState.gameAvailable
    ) {

        characterButton.style.display =
            "block";

    } else {

        characterButton.style.display =
            "none";


        characterInterface.classList.remove(
            "character-interface-open"
        );


        removeInventoryItemPopup();

        removeEquipmentItemPopup();


        return;

    }


    if (
        characterState.isOpen
    ) {

        characterInterface.classList.add(
            "character-interface-open"
        );

    } else {

        characterInterface.classList.remove(
            "character-interface-open"
        );


        removeInventoryItemPopup();

        removeEquipmentItemPopup();

    }


    const tabButtons =
        characterInterface.querySelectorAll(
            ".character-interface-tab"
        );


    tabButtons.forEach(
        button => {

            if (
                button.dataset.tab ===
                characterState.activeTab
            ) {

                button.classList.add(
                    "active"
                );

            } else {

                button.classList.remove(
                    "active"
                );

            }

        }
    );


    if (
        !characterState.isOpen
    ) {

        return;

    }


    switch (
        characterState.activeTab
    ) {

        case CHARACTER_TABS.COMBAT:

            renderCombatTab();

            break;


        case CHARACTER_TABS.SKILLS:

            renderSkillsTab();

            break;


        case CHARACTER_TABS.INVENTORY:

            renderInventoryTab();

            break;


        case CHARACTER_TABS.EQUIPMENT:

            renderEquipmentTab();

            break;


        case CHARACTER_TABS.QUESTS:

            renderComingSoonTab(
                "QUESTS"
            );

            break;


        case CHARACTER_TABS.MAP:

            renderComingSoonTab(
                "MAP"
            );

            break;

    }

}


/* =======================================================
   CREATE CHARACTER INTERFACE
   ======================================================= */

function createCharacterInterface() {

    if (
        characterInterface
    ) {

        return;

    }


    /* ===================================================
       CHARACTER BUTTON
       =================================================== */

    characterButton =
        document.createElement(
            "button"
        );

    characterButton.id =
        "character-button";

    characterButton.textContent =
        "CHARACTER";


    characterButton.addEventListener(
        "click",
        () => {

            toggleCharacterInterface();

        }
    );


    document.body.appendChild(
        characterButton
    );


    /* ===================================================
       CHARACTER WINDOW
       =================================================== */

    characterInterface =
        document.createElement(
            "div"
        );

    characterInterface.id =
        "character-interface";


    /* ===================================================
       TOP NAVIGATION
       =================================================== */

    const tabs =
        document.createElement(
            "div"
        );

    tabs.className =
        "character-interface-tabs";


    for (
        const definition
        of CHARACTER_TAB_DEFINITIONS
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "character-interface-tab";

        button.dataset.tab =
            definition.tab;

        button.title =
            definition.label;


        const icon =
            document.createElement(
                "span"
            );

        icon.className =
            "character-interface-tab-icon";

        icon.textContent =
            definition.icon;


        button.appendChild(
            icon
        );


        button.addEventListener(
            "click",
            () => {

                setCharacterTab(
                    definition.tab
                );

            }
        );


        tabs.appendChild(
            button
        );

    }


    /* ===================================================
       MINIMIZE BUTTON
       =================================================== */

    const minimizeButton =
        document.createElement(
            "button"
        );

    minimizeButton.className =
        "character-interface-minimize";

    minimizeButton.textContent =
        "—";

    minimizeButton.title =
        "Minimize Character";


    minimizeButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            closeCharacterInterface();

        }
    );


    tabs.appendChild(
        minimizeButton
    );


    /* ===================================================
       CONTENT
       =================================================== */

    characterContent =
        document.createElement(
            "div"
        );

    characterContent.className =
        "character-interface-content";


    characterInterface.appendChild(
        tabs
    );

    characterInterface.appendChild(
        characterContent
    );


    document.body.appendChild(
        characterInterface
    );


    updateCharacterInterface();

}


/* =======================================================
   KEYBOARD SHORTCUT
   ======================================================= */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "c" &&
            event.key !== "C"
        ) {

            return;

        }


        if (
            event.target &&
            (
                event.target.tagName ===
                "INPUT" ||

                event.target.tagName ===
                "TEXTAREA"
            )
        ) {

            return;

        }


        if (
            !characterState.gameAvailable
        ) {

            return;

        }


        toggleCharacterInterface();

    }
);


/* =======================================================
   SKILL XP LIVE SYNCHRONIZATION
   ======================================================= */

subscribeToSkillChanges(
    skills => {

        if (
            skills !==
            player.skills
        ) {

            return;

        }


        if (
            !characterState.isOpen
        ) {

            return;

        }


        if (
            characterState.activeTab !==
            CHARACTER_TABS.SKILLS
        ) {

            return;

        }


        updateCharacterInterface();

    }
);


/* =======================================================
   INITIALIZE
   ======================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        createCharacterInterface
    );

} else {

    createCharacterInterface();

}