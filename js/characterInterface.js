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
    getPlayerVitalityXPToNextLevel
} from "./player.js";

import {
    getPlayerCombatLevel
} from "./combatLevel.js";

import {
    getSkillLevel,
    getCurrentSkillXP,
    getSkillXPToNextLevel
} from "./skills.js";

import {
    getItem,
    useItem
} from "./items.js";

import {
    removeItem
} from "./inventory.js";


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
   CHARACTER STATE
   ======================================================= */

const characterState = {
    isOpen: false,
    activeTab: CHARACTER_TABS.COMBAT,
    gameAvailable: false,
    selectedInventoryItem: null
};


/* =======================================================
   DOM ELEMENTS
   ======================================================= */

let characterButton = null;
let characterInterface = null;
let characterContent = null;


/* =======================================================
   STATE FUNCTIONS
   ======================================================= */

export function openCharacterInterface() {

    if (!characterState.gameAvailable) {
        return;
    }

    characterState.isOpen = true;

    updateCharacterInterface();

}


export function closeCharacterInterface() {

    characterState.isOpen = false;

    updateCharacterInterface();

}


export function toggleCharacterInterface() {

    if (!characterState.gameAvailable) {
        return;
    }

    characterState.isOpen =
        !characterState.isOpen;

    updateCharacterInterface();

}


export function isCharacterInterfaceOpen() {

    return characterState.isOpen;

}


export function setCharacterTab(tab) {

    if (
        !Object.values(
            CHARACTER_TABS
        ).includes(tab)
    ) {
        return false;
    }

    characterState.activeTab =
        tab;

    if (
        tab !== CHARACTER_TABS.INVENTORY
    ) {

        characterState.selectedInventoryItem =
            null;

    }

    updateCharacterInterface();

    return true;

}


export function getCharacterTab() {

    return characterState.activeTab;

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
        Boolean(available);

    if (
        !characterState.gameAvailable
    ) {

        characterState.isOpen =
            false;

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

function formatXP(value) {

    return Number.isFinite(value)
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
            : String(skillLevel);


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

        energyWeapons:
            "Energy Weapons",

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
                player,
                skillName
            );

        const currentXP =
            getCurrentSkillXP(
                player,
                skillName
            );

        const xpToNextLevel =
            getSkillXPToNextLevel(
                player,
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
            getPlayerAttackXP(player),
            getPlayerAttackXPToNextLevel(player)
        ],

        [
            "Strength",
            summary.strength,
            getPlayerStrengthXP(player),
            getPlayerStrengthXPToNextLevel(player)
        ],

        [
            "Defense",
            summary.defense,
            getPlayerDefenseXP(player),
            getPlayerDefenseXPToNextLevel(player)
        ],

        [
            "Vitality",
            summary.vitality,
            getPlayerVitalityXP(player),
            getPlayerVitalityXPToNextLevel(player)
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
            player.combatStyle
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
                "energyWeapons"
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
   INVENTORY ITEM ICON
   ======================================================= */

function getInventoryItemSymbol(
    item
) {

    if (!item) {
        return "•";
    }

    if (item.type === "consumable") {
        return "+";
    }

    if (item.type === "weapon") {
        return "◆";
    }

    return "•";

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
        "skill-card";

    slot.style.cursor =
        inventoryItem
            ? "pointer"
            : "default";

    slot.style.minHeight =
        "100px";


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

        slot.style.border =
            "1px solid #f0c75e";

        slot.style.boxShadow =
            "0 0 12px rgba(240,199,94,0.25)";

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

    symbol.textContent =
        getInventoryItemSymbol(
            item
        );

    symbol.style.fontSize =
        "30px";

    symbol.style.margin =
        "8px 0";

    symbol.style.textAlign =
        "center";


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
        () => {

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
    action
) {

    const button =
        document.createElement(
            "button"
        );

    button.textContent =
        label;

    button.disabled =
        !enabled;

    button.style.padding =
        "9px 14px";

    button.style.marginRight =
        "8px";

    button.style.cursor =
        enabled
            ? "pointer"
            : "not-allowed";

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


    /* ---------------------------------------------------
       HEADER
       --------------------------------------------------- */

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


    /* ---------------------------------------------------
       INVENTORY GRID
       --------------------------------------------------- */

    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "skills-grid";


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


    /* ---------------------------------------------------
       SELECTED ITEM
       --------------------------------------------------- */

    const selectedItemId =
        characterState.selectedInventoryItem;


    const selectedInventoryItem =
        selectedItemId
            ? inventory.items.find(
                item =>
                    item.id ===
                    selectedItemId
            )
            : null;


    if (
        !selectedInventoryItem
    ) {

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


    const selectedTitle =
        document.createElement(
            "div"
        );

    selectedTitle.className =
        "character-section-title";

    selectedTitle.textContent =
        "SELECTED ITEM";


    characterContent.appendChild(
        selectedTitle
    );


    const selectedCard =
        document.createElement(
            "div"
        );

    selectedCard.className =
        "skill-card";


    const selectedName =
        document.createElement(
            "div"
        );

    selectedName.className =
        "skill-name";

    selectedName.textContent =
        selectedItem.name;


    const selectedType =
        document.createElement(
            "div"
        );

    selectedType.className =
        "skill-xp";

    selectedType.textContent =
        `${String(
            selectedItem.type
        ).toUpperCase()} • QUANTITY ${selectedInventoryItem.quantity}`;


    selectedCard.appendChild(
        selectedName
    );

    selectedCard.appendChild(
        selectedType
    );


    if (
        selectedItem.effect &&
        selectedItem.effect.type === "heal"
    ) {

        const effect =
            document.createElement(
                "div"
            );

        effect.className =
            "skill-next";

        effect.textContent =
            `HEALS ${selectedItem.effect.amount} HP`;

        selectedCard.appendChild(
            effect
        );

    }


    const actionArea =
        document.createElement(
            "div"
        );

    actionArea.style.marginTop =
        "12px";


    const canUse =
        selectedItem.type ===
        "consumable";


    const useButton =
        createInventoryActionButton(
            "USE",
            canUse,
            () => {

                const used =
                    useItem(
                        player,
                        inventory,
                        selectedInventoryItem.id
                    );

                if (
                    used
                ) {

                    if (
                        !inventory.items.some(
                            item =>
                                item.id ===
                                selectedInventoryItem.id
                        )
                    ) {

                        characterState.selectedInventoryItem =
                            null;

                    }

                    updateCharacterInterface();

                }

            }
        );


    const dropButton =
        createInventoryActionButton(
            "DROP 1",
            true,
            () => {

                const removed =
                    removeItem(
                        inventory,
                        selectedInventoryItem.id,
                        1
                    );

                if (
                    removed
                ) {

                    if (
                        !inventory.items.some(
                            item =>
                                item.id ===
                                selectedInventoryItem.id
                        )
                    ) {

                        characterState.selectedInventoryItem =
                            null;

                    }

                    updateCharacterInterface();

                }

            }
        );


    actionArea.appendChild(
        useButton
    );

    actionArea.appendChild(
        dropButton
    );


    selectedCard.appendChild(
        actionArea
    );


    characterContent.appendChild(
        selectedCard
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

            renderComingSoonTab(
                "EQUIPMENT"
            );

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
       HEADER
       =================================================== */

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "character-interface-header";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "character-interface-title";

    title.textContent =
        "CHARACTER";


    const close =
        document.createElement(
            "button"
        );

    close.className =
        "character-interface-close";

    close.textContent =
        "×";


    close.addEventListener(
        "click",
        () => {

            closeCharacterInterface();

        }
    );


    header.appendChild(
        title
    );

    header.appendChild(
        close
    );


    /* ===================================================
       TABS
       =================================================== */

    const tabs =
        document.createElement(
            "div"
        );

    tabs.className =
        "character-interface-tabs";


    const tabDefinitions = [

        [
            CHARACTER_TABS.COMBAT,
            "COMBAT"
        ],

        [
            CHARACTER_TABS.SKILLS,
            "SKILLS"
        ],

        [
            CHARACTER_TABS.INVENTORY,
            "INVENTORY"
        ],

        [
            CHARACTER_TABS.EQUIPMENT,
            "EQUIPMENT"
        ],

        [
            CHARACTER_TABS.QUESTS,
            "QUESTS"
        ],

        [
            CHARACTER_TABS.MAP,
            "MAP"
        ]

    ];


    for (
        const [
            tab,
            label
        ]
        of tabDefinitions
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "character-interface-tab";

        button.dataset.tab =
            tab;

        button.textContent =
            label;


        button.addEventListener(
            "click",
            () => {

                setCharacterTab(
                    tab
                );

            }
        );


        tabs.appendChild(
            button
        );

    }


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
        header
    );

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