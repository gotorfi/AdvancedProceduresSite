"use strict";

const container = document.getElementById("procedures-container");

document.addEventListener("DOMContentLoaded", loadProcedures);

async function loadProcedures() {

    if (!container) return;

    const category = document.body.dataset.category;

    const response = await fetch("DATA/updates.json");
    const updates = await response.json();

    updates.sort((a, b) => new Date(a.date) - new Date(b.date));

    const procedures = new Map();

    for (const update of updates) {

        // =====================================================
        // NEW BLOCKS
        // =====================================================

        const blocks = update.new_blocks || [];

        for (const block of blocks) {

            if (block.category !== category)
                continue;

            let name = block.name.trim();

            const suggestion = name.startsWith("(Suggestion)");
            const rework = name.startsWith("(REWORK)");

            if (suggestion)
                name = name.replace("(Suggestion)", "").trim();

            if (rework)
                name = name.replace("(REWORK)", "").trim();

            procedures.set(name, {
                ...block,
                name,
                suggestion
            });

        }

        // =====================================================
        // REWORKS
        // =====================================================

        const changes = update.changes || [];

        for (const block of changes) {

            if (typeof block !== "object")
                continue;

            if (block.category !== category)
                continue;

            let newName = block.name.trim();

            if (!newName.startsWith("(REWORK)"))
                continue;

            newName = newName.replace("(REWORK)", "").trim();

            const oldName = block.old_name
                ? block.old_name.trim()
                : newName;

            procedures.delete(oldName);

            procedures.set(newName, {
                ...block,
                name: newName,
                suggestion: false
            });

        }

    }

    [...procedures.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(createCard);

}

function createCard(block) {

    const card = document.createElement("div");

    card.className =
        `procedure-card category-${block.category.toLowerCase()}`;

    const dataBlock = isDataBlock(block);

    card.innerHTML = `
        <div class="procedure-top-notch"></div>

        <div class="procedure-main">

            <div class="procedure-header">

                <div class="procedure-title-row">

                    <div class="procedure-icon">
                        ${getCategoryIcon(block.category)}
                    </div>

                    <div class="procedure-title">
                        ${escapeHtml(block.name)}
                    </div>

                </div>

                <div class="procedure-tags">

                    <span class="procedure-tag tag-category">
                        ${block.category}
                    </span>

                    <span class="procedure-tag ${dataBlock ? "tag-data" : "tag-action"}">
                        ${dataBlock ? "DATA" : "ACTION"}
                    </span>

                    ${block.suggestion
                        ? `<span class="procedure-tag tag-suggestion">Suggestion</span>`
                        : ""}

                </div>

            </div>

            <div class="procedure-description">
                ${escapeHtml(block.description || "")}
            </div>

        </div>

        <div class="procedure-bottom-notch"></div>
    `;

    container.appendChild(card);

}

function isDataBlock(block) {

    // Components are almost always data blocks.
    // Only these keywords indicate an action block.

    if (block.category === "Component") {

        const text = block.name.toLowerCase();

        return !(
            text.includes(" do ") ||
            text.includes(" make ") ||
            text.includes(" to ") ||
            text.includes(" find ")
        );

    }

    const text = block.name.toLowerCase();

    const prefixes = [
        "is ",
        "can ",
        "get ",
        "does ",
        "has ",
        "block ",
        "player ",
        "entity ",
        "all ",
        "convert ",
        "if "
    ];

    for (const prefix of prefixes) {
        if (text.startsWith(prefix))
            return true;
    }

    return false;

}

function escapeHtml(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

}

function getCategoryIcon(category){

    switch(category){

        case "Block":
            return "📦";

        case "Entity":
            return "🐦‍⬛";

        case "Component":
            return "🧩";

        case "Player":
            return "💻";

        case "Event":
            return "⚡";

        case "Math":
            return "∑";

        case "Item":
            return "🪓";

        default:
            return "◼";

    }

}