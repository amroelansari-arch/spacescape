import {
    player,
    getCombatStyle,
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


/* =======================================================
   CHARACTER INTERFACE
   ======================================================= */

/*
 * Permanent player Character/System interface.
 *
 * Current functional section:
 *
 * Combat
 *
 * Additional sections are established now so the
 * interface has a permanent structure:
 *
 * Skills
 * Inventory
 * Equipment
 * Quests
 * Map
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
   DOM REFERENCES
   ======================================================= */

let windowElement = null;

let contentElement = null;


/* =======================================================
   OPEN / CLOSE
   ======================================================= */

export function openCharacterInterface() {

    ensureCharacterInterface();

    characterInterface.isOpen =
        true;

    windowElement.classList.add(
        "character-interface-open"
    );

    renderCharacterInterface();

    return true;

}


export function closeCharacterInterface() {

    if (!windowElement) {

        characterInterface.isOpen =
            false;

        return true;

    }


    characterInterface.isOpen =
        false;

    windowElement.classList.remove(
        "character-interface-open"
    );

    return true;

}


export function toggleCharacterInterface() {

    if (
        characterInterface.isOpen
    ) {

        closeCharacterInterface();

    } else {

        openCharacterInterface();

    }


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


    if (
        characterInterface.isOpen
    ) {

        renderCharacterInterface();

    }


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
    currentPlayer = player
) {

    if (!currentPlayer) {

        return null;

    }


    return {

        combatLevel:
            getPlayerCombatLevel(
                currentPlayer
            ),

        attack:
            getPlayerAttackLevel(),

        strength:
            getPlayerStrengthLevel(),

        defense:
            getPlayerDefenseLevel(),

        vitality:
            getPlayerVitalityLevel(),

        health:
            currentPlayer.health,

        energy:
            currentPlayer.energy,

        combatStyle:
            getCombatStyle(),

        attackXP:
            getPlayerAttackXP(),

        strengthXP:
            getPlayerStrengthXP(),

        defenseXP:
            getPlayerDefenseXP(),

        vitalityXP:
            getPlayerVitalityXP(),

        attackXPToNextLevel:
            getPlayerAttackXPToNextLevel(),

        strengthXPToNextLevel:
            getPlayerStrengthXPToNextLevel(),

        defenseXPToNextLevel:
            getPlayerDefenseXPToNextLevel(),

        vitalityXPToNextLevel:
            getPlayerVitalityXPToNextLevel()

    };

}


/* =======================================================
   INTERFACE STATE
   ======================================================= */

export function getCharacterInterfaceState() {

    return {

        isOpen:
            characterInterface.isOpen,

        activeTab:
            characterInterface.activeTab

    };

}


/* =======================================================
   CREATE INTERFACE
   ======================================================= */

function ensureCharacterInterface() {

    if (
        windowElement
    ) {

        return;

    }


    const existing =
        document.getElementById(
            "character-interface"
        );


    if (existing) {

        windowElement =
            existing;

        contentElement =
            existing.querySelector(
                "#character-interface-content"
            );

        return;

    }


    const characterWindow =
        document.createElement(
            "div"
        );


    characterWindow.id =
        "character-interface";

    characterWindow.className =
        "character-interface";


    characterWindow.innerHTML = `

        <div class="character-interface-header">

            <div class="character-interface-title">
                CHARACTER
            </div>

            <button
                id="character-interface-close"
                class="character-interface-close"
                type="button"
            >
                ×
            </button>

        </div>


        <div
            id="character-interface-tabs"
            class="character-interface-tabs"
        >

            ${createTabButton(
                CHARACTER_TABS.COMBAT,
                "Combat"
            )}

            ${createTabButton(
                CHARACTER_TABS.SKILLS,
                "Skills"
            )}

            ${createTabButton(
                CHARACTER_TABS.INVENTORY,
                "Inventory"
            )}

            ${createTabButton(
                CHARACTER_TABS.EQUIPMENT,
                "Equipment"
            )}

            ${createTabButton(
                CHARACTER_TABS.QUESTS,
                "Quests"
            )}

            ${createTabButton(
                CHARACTER_TABS.MAP,
                "Map"
            )}

        </div>


        <div
            id="character-interface-content"
            class="character-interface-content"
        ></div>

    `;


    document.body.appendChild(
        characterWindow
    );


    windowElement =
        characterWindow;


    contentElement =
        characterWindow.querySelector(
            "#character-interface-content"
        );


    const closeButton =
        characterWindow.querySelector(
            "#character-interface-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            closeCharacterInterface();

        }
    );


    characterWindow
        .querySelectorAll(
            ".character-interface-tab"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setCharacterTab(
                            button.dataset.tab
                        );

                    }
                );

            }
        );


    createCharacterButton();


    window.addEventListener(
        "keydown",
        event => {

            if (
                event.key.toLowerCase() !== "c"
            ) {

                return;

            }


            if (
                event.repeat
            ) {

                return;

            }


            const activeElement =
                document.activeElement;


            if (
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.tagName === "BUTTON"
                )
            ) {

                return;

            }


            toggleCharacterInterface();

        }
    );

}


/* =======================================================
   CHARACTER BUTTON
   ======================================================= */

function createCharacterButton() {

    if (
        document.getElementById(
            "character-button"
        )
    ) {

        return;

    }


    const button =
        document.createElement(
            "button"
        );


    button.id =
        "character-button";

    button.type =
        "button";

    button.textContent =
        "CHARACTER";


    button.addEventListener(
        "click",
        () => {

            toggleCharacterInterface();

        }
    );


    document.body.appendChild(
        button
    );

}


/* =======================================================
   TAB BUTTON
   ======================================================= */

function createTabButton(
    tab,
    label
) {

    return `
        <button
            type="button"
            class="character-interface-tab"
            data-tab="${tab}"
        >
            ${label}
        </button>
    `;

}


/* =======================================================
   RENDER INTERFACE
   ======================================================= */

function renderCharacterInterface() {

    if (
        !contentElement
    ) {

        return;

    }


    updateTabButtons();


    switch (
        characterInterface.activeTab
    ) {

        case CHARACTER_TABS.COMBAT:

            renderCombatTab();

            break;


        case CHARACTER_TABS.SKILLS:

            renderComingSoonTab(
                "Skills"
            );

            break;


        case CHARACTER_TABS.INVENTORY:

            renderComingSoonTab(
                "Inventory"
            );

            break;


        case CHARACTER_TABS.EQUIPMENT:

            renderComingSoonTab(
                "Equipment"
            );

            break;


        case CHARACTER_TABS.QUESTS:

            renderComingSoonTab(
                "Quests"
            );

            break;


        case CHARACTER_TABS.MAP:

            renderComingSoonTab(
                "Map"
            );

            break;


        default:

            renderCombatTab();

            break;

    }

}


/* =======================================================
   UPDATE TAB BUTTONS
   ======================================================= */

function updateTabButtons() {

    if (
        !windowElement
    ) {

        return;

    }


    windowElement
        .querySelectorAll(
            ".character-interface-tab"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.tab ===
                    characterInterface.activeTab
                );

            }
        );

}


/* =======================================================
   COMBAT TAB
   ======================================================= */

function renderCombatTab() {

    const summary =
        getCharacterCombatSummary(
            player
        );


    contentElement.innerHTML = `

        <div class="character-combat">

            <div class="combat-level-panel">

                <div class="combat-level-label">
                    COMBAT LEVEL
                </div>

                <div class="combat-level-value">
                    ${summary.combatLevel}
                </div>

            </div>


            <div class="character-section-title">
                COMBAT SKILLS
            </div>


            <div class="combat-skill-grid">

                ${createSkillCard(
                    "Attack",
                    summary.attack,
                    summary.attackXP,
                    summary.attackXPToNextLevel
                )}

                ${createSkillCard(
                    "Strength",
                    summary.strength,
                    summary.strengthXP,
                    summary.strengthXPToNextLevel
                )}

                ${createSkillCard(
                    "Defense",
                    summary.defense,
                    summary.defenseXP,
                    summary.defenseXPToNextLevel
                )}

                ${createSkillCard(
                    "Vitality",
                    summary.vitality,
                    summary.vitalityXP,
                    summary.vitalityXPToNextLevel
                )}

            </div>


            <div class="character-section-title">
                CURRENT STATUS
            </div>


            <div class="character-status-grid">

                <div class="character-status-row">
                    <span>Health</span>
                    <strong>
                        ${summary.health.current}/${summary.health.maximum}
                    </strong>
                </div>


                <div class="character-status-row">
                    <span>Energy</span>
                    <strong>
                        ${summary.energy.current}/${summary.energy.maximum}
                    </strong>
                </div>


                <div class="character-status-row">
                    <span>Combat Style</span>
                    <strong>
                        ${formatCombatStyle(
                            summary.combatStyle
                        )}
                    </strong>
                </div>

            </div>

        </div>

    `;

}


/* =======================================================
   SKILL CARD
   ======================================================= */

function createSkillCard(
    name,
    level,
    xp,
    xpToNextLevel
) {

    return `

        <div class="combat-skill-card">

            <div class="combat-skill-name">
                ${name}
            </div>

            <div class="combat-skill-level">
                ${level}
            </div>

            <div class="combat-skill-xp">
                ${xp} XP
            </div>

            <div class="combat-skill-next">
                ${level >= 99
                    ? "MAX"
                    : `${xpToNextLevel} XP to next level`
                }
            </div>

        </div>

    `;

}


/* =======================================================
   COMING SOON TAB
   ======================================================= */

function renderComingSoonTab(
    name
) {

    contentElement.innerHTML = `

        <div class="character-coming-soon">

            <div class="character-coming-soon-title">
                ${name}
            </div>

            <div class="character-coming-soon-text">
                This system is under construction.
            </div>

        </div>

    `;

}


/* =======================================================
   COMBAT STYLE DISPLAY
   ======================================================= */

function formatCombatStyle(
    style
) {

    if (!style) {

        return "Accurate";

    }


    return style.charAt(0).toUpperCase() +
        style.slice(1);

}


/* =======================================================
   INITIALIZATION
   ======================================================= */

function initializeCharacterInterface() {

    ensureCharacterInterface();

}


/*
 * Wait until the document exists before creating
 * the interface.
 */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCharacterInterface
    );

} else {

    initializeCharacterInterface();

}