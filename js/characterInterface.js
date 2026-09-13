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
    SKILL_NAMES,
    getSkillLevel,
    getCurrentSkillXP,
    getSkillXPToNextLevel
} from "./skills.js";


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
    activeTab: CHARACTER_TABS.COMBAT
};


/* =======================================================
   STATE FUNCTIONS
   ======================================================= */

export function openCharacterInterface() {

    characterState.isOpen = true;

    updateCharacterInterface();

}


export function closeCharacterInterface() {

    characterState.isOpen = false;

    updateCharacterInterface();

}


export function toggleCharacterInterface() {

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
   DOM ELEMENTS
   ======================================================= */

let characterButton = null;

let characterInterface = null;

let characterContent = null;


/* =======================================================
   CREATE CHARACTER INTERFACE
   ======================================================= */

function createCharacterInterface() {

    if (characterInterface) {
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
        "character-header";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "character-title";

    title.textContent =
        "CHARACTER";


    const close =
        document.createElement(
            "button"
        );

    close.className =
        "character-close";

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
        "character-tabs";


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
            "character-tab";

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
        "character-content";


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
   FORMAT XP
   ======================================================= */

function formatXP(value) {

    return Number.isFinite(value)
        ? value.toLocaleString()
        : "0";

}


/* =======================================================
   CREATE SKILL ROW
   ======================================================= */

function createSkillRow(
    skillName,
    displayName,
    skillLevel,
    currentXP,
    xpToNextLevel
) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "character-skill-row";


    const left =
        document.createElement(
            "div"
        );

    left.className =
        "character-skill-left";


    const name =
        document.createElement(
            "div"
        );

    name.className =
        "character-skill-name";

    name.textContent =
        displayName;


    const level =
        document.createElement(
            "div"
        );

    level.className =
        "character-skill-level";

    level.textContent =
        `Level ${skillLevel}`;


    left.appendChild(
        name
    );

    left.appendChild(
        level
    );


    const right =
        document.createElement(
            "div"
        );

    right.className =
        "character-skill-right";


    const xp =
        document.createElement(
            "div"
        );

    xp.className =
        "character-skill-xp";

    if (
        skillLevel >= 99
    ) {

        xp.textContent =
            "MAX";

    } else {

        const totalXP =
            currentXP +
            xpToNextLevel;

        xp.textContent =
            `${formatXP(currentXP)} / ${formatXP(totalXP)} XP`;

    }


    const remaining =
        document.createElement(
            "div"
        );

    remaining.className =
        "character-skill-remaining";

    if (
        skillLevel >= 99
    ) {

        remaining.textContent =
            "Maximum level";

    } else {

        remaining.textContent =
            `${formatXP(xpToNextLevel)} XP to next level`;

    }


    right.appendChild(
        xp
    );

    right.appendChild(
        remaining
    );


    row.appendChild(
        left
    );

    row.appendChild(
        right
    );


    row.dataset.skill =
        skillName;


    return row;

}


/* =======================================================
   DISPLAY NAME
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
   SKILL SECTION
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
        "character-skill-section";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "character-section-title";

    title.textContent =
        titleText;


    section.appendChild(
        title
    );


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


        const row =
            createSkillRow(
                skillName,
                getSkillDisplayName(
                    skillName
                ),
                skillLevel,
                currentXP,
                xpToNextLevel
            );


        section.appendChild(
            row
        );

    }


    return section;

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

    combatLabel.textContent =
        "COMBAT LEVEL";

    combatLabel.className =
        "combat-level-label";


    const combatLevel =
        document.createElement(
            "div"
        );

    combatLevel.textContent =
        summary.combatLevel;

    combatLevel.className =
        "combat-level-value";


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


    const combatSkills = [
        [
            "Attack",
            summary.attack,
            getPlayerAttackXP(
                player
            ),
            getPlayerAttackXPToNextLevel(
                player
            )
        ],
        [
            "Strength",
            summary.strength,
            getPlayerStrengthXP(
                player
            ),
            getPlayerStrengthXPToNextLevel(
                player
            )
        ],
        [
            "Defense",
            summary.defense,
            getPlayerDefenseXP(
                player
            ),
            getPlayerDefenseXPToNextLevel(
                player
            )
        ],
        [
            "Vitality",
            summary.vitality,
            getPlayerVitalityXP(
                player
            ),
            getPlayerVitalityXPToNextLevel(
                player
            )
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

        const row =
            createSkillRow(
                name.toLowerCase(),
                name,
                level,
                xp,
                xpToNext
            );

        characterContent.appendChild(
            row
        );

    }


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
        "character-status";


    status.innerHTML = `
        <div>
            <span>Health</span>
            <strong>
                ${player.health.current}
                /
                ${player.health.maximum}
            </strong>
        </div>

        <div>
            <span>Energy</span>
            <strong>
                ${player.energy.current}
                /
                ${player.energy.maximum}
            </strong>
        </div>

        <div>
            <span>Combat Style</span>
            <strong>
                ${player.combatStyle}
            </strong>
        </div>
    `;


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


    const combatSection =
        createSkillSection(
            "COMBAT",
            [
                "attack",
                "strength",
                "defense",
                "vitality"
            ]
        );


    const specializationSection =
        createSkillSection(
            "COMBAT SPECIALIZATION",
            [
                "ballistics",
                "energyWeapons"
            ]
        );


    const gatheringSection =
        createSkillSection(
            "GATHERING",
            [
                "mining",
                "salvaging",
                "xenobiology"
            ]
        );


    const technicalSection =
        createSkillSection(
            "TECHNICAL",
            [
                "engineering",
                "crafting",
                "hacking",
                "navigation"
            ]
        );


    characterContent.appendChild(
        combatSection
    );

    characterContent.appendChild(
        specializationSection
    );

    characterContent.appendChild(
        gatheringSection
    );

    characterContent.appendChild(
        technicalSection
    );

}


/* =======================================================
   RENDER PLACEHOLDER TABS
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

    heading.textContent =
        title;

    heading.className =
        "character-coming-soon-title";


    const message =
        document.createElement(
            "div"
        );

    message.textContent =
        "This system is under construction.";

    message.className =
        "character-coming-soon-message";


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
        !characterInterface
    ) {
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
            ".character-tab"
        );


    tabButtons.forEach(
        button => {

            if (
                button.dataset.tab ===
                characterState.activeTab
            ) {

                button.classList.add(
                    "character-tab-active"
                );

            } else {

                button.classList.remove(
                    "character-tab-active"
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

            renderComingSoonTab(
                "INVENTORY"
            );

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
   KEYBOARD SHORTCUT
   ======================================================= */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "c" ||
            event.key === "C"
        ) {

            if (
                event.target.tagName ===
                "INPUT" ||
                event.target.tagName ===
                "TEXTAREA"
            ) {
                return;
            }

            toggleCharacterInterface();

        }

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