import {
    getWorldActiveEnemies
} from "./enemyWorld.js";

import {
    getCombatState,
    consumeCombatFeedback
} from "./combatSystem.js";

/* =======================================================
   ENEMY RENDERER
   ======================================================= */

const enemyElements =
    new Map();

const feedbackElements =
    new Map();

function getWorldElement() {
    return document.getElementById("world");
}

function createEnemyElement(enemy) {
    const world = getWorldElement();

    if (!world || !enemy || !enemy.id) {
        return null;
    }

    const element =
        document.createElement("div");

    element.className = "enemy";
    element.dataset.enemyId =
        enemy.id;

    element.style.cursor =
        "pointer";

    element.style.flexDirection =
        "column";

    element.style.lineHeight =
        "1";

    element.style.overflow =
        "visible";

    const nameElement =
        document.createElement("div");

    nameElement.className =
        "enemy-name";

    nameElement.style.position =
        "absolute";

    nameElement.style.bottom =
        "48px";

    nameElement.style.left =
        "50%";

    nameElement.style.transform =
        "translateX(-50%)";

    nameElement.style.color =
        "#ffffff";

    nameElement.style.fontSize =
        "11px";

    nameElement.style.fontWeight =
        "bold";

    nameElement.style.whiteSpace =
        "nowrap";

    nameElement.style.textShadow =
        "0 1px 3px #000000";

    element.appendChild(
        nameElement
    );

    const levelElement =
        document.createElement("div");

    levelElement.className =
        "enemy-level";

    levelElement.style.position =
        "absolute";

    levelElement.style.top =
        "-18px";

    levelElement.style.left =
        "50%";

    levelElement.style.transform =
        "translateX(-50%)";

    levelElement.style.color =
        "#ffffff";

    levelElement.style.fontSize =
        "10px";

    levelElement.style.fontWeight =
        "bold";

    levelElement.style.whiteSpace =
        "nowrap";

    levelElement.style.textShadow =
        "0 1px 3px #000000";

    element.appendChild(
        levelElement
    );

    const healthContainer =
        document.createElement("div");

    healthContainer.className =
        "enemy-health-container";

    healthContainer.style.position =
        "absolute";

    healthContainer.style.top =
        "48px";

    healthContainer.style.left =
        "50%";

    healthContainer.style.transform =
        "translateX(-50%)";

    healthContainer.style.width =
        "60px";

    healthContainer.style.height =
        "7px";

    healthContainer.style.background =
        "#220000";

    healthContainer.style.border =
        "1px solid #000000";

    healthContainer.style.borderRadius =
        "3px";

    healthContainer.style.overflow =
        "hidden";

    const healthFill =
        document.createElement("div");

    healthFill.className =
        "enemy-health-fill";

    healthFill.style.width =
        "100%";

    healthFill.style.height =
        "100%";

    healthFill.style.background =
        "#38c95b";

    healthContainer.appendChild(
        healthFill
    );

    element.appendChild(
        healthContainer
    );

    world.appendChild(
        element
    );

    enemyElements.set(
        enemy.id,
        element
    );

    return element;
}

function updateEnemyElement(
    enemy,
    element
) {
    if (
        !enemy ||
        !element ||
        !enemy.position
    ) {
        return;
    }

    element.style.left =
        `${enemy.position.x}px`;

    element.style.top =
        `${enemy.position.y}px`;

    const nameElement =
        element.querySelector(
            ".enemy-name"
        );

    if (nameElement) {
        nameElement.textContent =
            enemy.name || "Enemy";
    }

    const levelElement =
        element.querySelector(
            ".enemy-level"
        );

    if (levelElement) {
        levelElement.textContent =
            `Lv. ${enemy.level}`;
    }

    const healthFill =
        element.querySelector(
            ".enemy-health-fill"
        );

    if (
        healthFill &&
        enemy.health &&
        Number.isFinite(
            enemy.health.current
        ) &&
        Number.isFinite(
            enemy.health.maximum
        ) &&
        enemy.health.maximum > 0
    ) {
        const healthPercent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        enemy.health.current /
                        enemy.health.maximum
                    ) *
                    100
                )
            );

        healthFill.style.width =
            `${healthPercent}%`;
    }

    const combatState =
        getCombatState();

    const selected =
        combatState.targetEnemyId ===
        enemy.id;

    if (selected) {
        element.style.outline =
            "3px solid #ffff00";

        element.style.outlineOffset =
            "4px";
    } else {
        element.style.outline =
            "none";
    }
}

function removeEnemyElement(
    enemyId
) {
    const element =
        enemyElements.get(
            enemyId
        );

    if (!element) {
        return;
    }

    element.remove();

    enemyElements.delete(
        enemyId
    );
}

function createPlayerHealthBar() {
    const world =
        getWorldElement();

    const player =
        document.getElementById(
            "player"
        );

    if (
        !world ||
        !player
    ) {
        return null;
    }

    let container =
        document.querySelector(
            ".spacescape-player-health-container"
        );

    if (container) {
        return container;
    }

    container =
        document.createElement("div");

    container.className =
        "spacescape-player-health-container";

    container.style.position =
        "absolute";

    container.style.width =
        "60px";

    container.style.height =
        "7px";

    container.style.background =
        "#220000";

    container.style.border =
        "1px solid #000000";

    container.style.borderRadius =
        "3px";

    container.style.overflow =
        "hidden";

    container.style.transform =
        "translateX(-50%)";

    container.style.zIndex =
        "50";

    const fill =
        document.createElement("div");

    fill.className =
        "spacescape-player-health-fill";

    fill.style.width =
        "100%";

    fill.style.height =
        "100%";

    fill.style.background =
        "#38c95b";

    container.appendChild(
        fill
    );

    world.appendChild(
        container
    );

    return container;
}

function updatePlayerHealthBar() {
    const player =
        document.getElementById(
            "player"
        );

    if (!player) {
        return;
    }

    const combatState =
        getCombatState();

    const now =
        performance.now();

    const showBar =
        combatState.active ||
        (
            combatState.combatEndTime > 0 &&
            now -
            combatState.combatEndTime <
            3000
        );

    let container =
        document.querySelector(
            ".spacescape-player-health-container"
        );

    if (!showBar) {
        if (container) {
            container.remove();
        }

        return;
    }

    if (!container) {
        container =
            createPlayerHealthBar();
    }

    if (!container) {
        return;
    }

    container.style.left =
        `${player.offsetLeft}px`;

    container.style.top =
        `${player.offsetTop - 32}px`;

    const fill =
        container.querySelector(
            ".spacescape-player-health-fill"
        );

    const healthElement =
        document.getElementById(
            "health"
        );

    if (
        fill &&
        healthElement
    ) {
        const healthText =
            healthElement.textContent;

        const parts =
            healthText.split("/");

        const current =
            Number(parts[0]);

        const maximum =
            Number(parts[1]);

        if (
            Number.isFinite(current) &&
            Number.isFinite(maximum) &&
            maximum > 0
        ) {
            const percent =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (current / maximum) *
                        100
                    )
                );

            fill.style.width =
                `${percent}%`;
        }
    }
}

function createDamageNumber(
    event
) {
    const world =
        getWorldElement();

    if (
        !world ||
        !event
    ) {
        return;
    }

    const element =
        document.createElement("div");

    element.className =
        "spacescape-damage-number";

    element.textContent =
        event.isMiss
            ? "0"
            : event.damage;

    element.style.position =
        "absolute";

    element.style.left =
        `${event.x}px`;

    element.style.top =
        `${event.y - 42}px`;

    element.style.width =
        "32px";

    element.style.height =
        "32px";

    element.style.display =
        "flex";

    element.style.alignItems =
        "center";

    element.style.justifyContent =
        "center";

    element.style.boxSizing =
        "border-box";

    element.style.fontFamily =
        "Arial, sans-serif";

    element.style.fontSize =
        "17px";

    element.style.fontWeight =
        "900";

    element.style.lineHeight =
        "1";

    element.style.color =
        "#ffffff";

    element.style.textAlign =
        "center";

    element.style.pointerEvents =
        "none";

    element.style.zIndex =
        "100";

    element.style.textShadow =
        "0 2px 2px #000000";

    element.style.background =
        event.isMiss
            ? "#2f69c9"
            : "#c83232";

    element.style.border =
        "2px solid #111111";

    element.style.clipPath =
        "polygon(" +
        "50% 0%, " +
        "61% 10%, " +
        "76% 5%, " +
        "79% 20%, " +
        "95% 24%, " +
        "88% 38%, " +
        "100% 50%, " +
        "88% 62%, " +
        "95% 76%, " +
        "79% 80%, " +
        "76% 95%, " +
        "61% 90%, " +
        "50% 100%, " +
        "39% 90%, " +
        "24% 95%, " +
        "21% 80%, " +
        "5% 76%, " +
        "12% 62%, " +
        "0% 50%, " +
        "12% 38%, " +
        "5% 24%, " +
        "21% 20%, " +
        "24% 5%, " +
        "39% 10%" +
        ")";

    element.style.animation =
        "spacescapeDamageFloat 950ms ease-out forwards";

    world.appendChild(
        element
    );

    feedbackElements.set(
        event.id,
        element
    );

    setTimeout(
        () => {
            const currentElement =
                feedbackElements.get(
                    event.id
                );

            if (
                currentElement ===
                element
            ) {
                element.remove();

                feedbackElements.delete(
                    event.id
                );
            }
        },
        950
    );
}

function renderCombatFeedback() {
    const pendingFeedback =
        consumeCombatFeedback();

    if (
        !pendingFeedback ||
        pendingFeedback.length === 0
    ) {
        return;
    }

    for (
        const event
        of pendingFeedback
    ) {
        createDamageNumber(
            event
        );
    }
}

function ensureDamageAnimation() {
    if (
        document.getElementById(
            "spacescape-damage-animation"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "spacescape-damage-animation";

    style.textContent = `
        @keyframes spacescapeDamageFloat {
            0% {
                opacity: 1;
                transform:
                    translate(-50%, 0)
                    scale(1);
            }

            20% {
                opacity: 1;
                transform:
                    translate(-50%, -5px)
                    scale(1.08);
            }

            100% {
                opacity: 0;
                transform:
                    translate(-50%, -50px)
                    scale(0.9);
            }
        }
    `;

    document.head.appendChild(
        style
    );
}

export function renderEnemies() {
    ensureDamageAnimation();

    const activeEnemies =
        getWorldActiveEnemies();

    const activeIds =
        new Set();

    for (
        const enemy
        of activeEnemies
    ) {
        if (
            !enemy ||
            !enemy.id ||
            !enemy.position
        ) {
            continue;
        }

        activeIds.add(
            enemy.id
        );

        let element =
            enemyElements.get(
                enemy.id
            );

        if (!element) {
            element =
                createEnemyElement(
                    enemy
                );
        }

        updateEnemyElement(
            enemy,
            element
        );
    }

    for (
        const enemyId
        of enemyElements.keys()
    ) {
        if (
            !activeIds.has(
                enemyId
            )
        ) {
            removeEnemyElement(
                enemyId
            );
        }
    }

    updatePlayerHealthBar();

    renderCombatFeedback();
}

export function clearEnemyRendering() {
    for (
        const enemyId
        of enemyElements.keys()
    ) {
        removeEnemyElement(
            enemyId
        );
    }

    for (
        const element
        of feedbackElements.values()
    ) {
        element.remove();
    }

    feedbackElements.clear();

    const playerHealthBar =
        document.querySelector(
            ".spacescape-player-health-container"
        );

    if (playerHealthBar) {
        playerHealthBar.remove();
    }
}