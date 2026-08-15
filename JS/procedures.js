"use strict";

const container = document.getElementById("procedures-container");

document.addEventListener("DOMContentLoaded", loadProcedures);


// =====================================================
// COLORS
// =====================================================

const BLOCK_COLORS = {

    Block: "#ad9d4b",
    Entity: "#4a57a8",
    Component: "#574e66",
    Player: "#0f868a",
    Event: "#503885",
    Item: "#8a0f42",
    Math: "#2f496b"

};

const DATA_BLOCK_COLORS = {

    Block: "#7a6026",
    Entity: "#202d81",
    Component: "#212731",
    Player: "#08484b",
    Event: "#2d1b53",
    Item: "#58092a",
    Math: "#102744"

};


// =====================================================
// LOAD PROCEDURES
// =====================================================

async function loadProcedures() {

    if (!container)
        return;

    const category =
        document.body.dataset.category;

    const response =
        await fetch("DATA/updates.json");

    const updates =
        await response.json();

    // Oldest -> newest
    updates.sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    const procedures = new Map();


    // =================================================
    // PROCESS UPDATES
    // =================================================

    for (const update of updates) {

        // ---------------------------------------------
        // NEW BLOCKS
        // ---------------------------------------------

        for (const block of update.new_blocks || []) {

            if (block.category !== category)
                continue;

            let name =
                String(block.name || "").trim();

            if (!name)
                continue;

            let suggestion = false;
            let reworked = false;


            if (name.startsWith("(Suggestion)")) {

                suggestion = true;

                name = name
                    .replace("(Suggestion)", "")
                    .trim();

            }


            if (name.startsWith("(REWORK)")) {

                reworked = true;

                name = name
                    .replace("(REWORK)", "")
                    .trim();

            }


            const normalizedBlock = {

                ...block,

                name,

                version: update.version,

                suggestion,

                reworked

            };


            normalizedBlock.dataBlock =
                isDataBlock(normalizedBlock);


            procedures.set(
                name,
                normalizedBlock
            );

        }


        // ---------------------------------------------
        // REWORKS
        // ---------------------------------------------

        for (const block of update.changes || []) {

            if (
                typeof block !== "object" ||
                block === null
            )
                continue;

            if (block.category !== category)
                continue;

            let newName =
                String(block.name || "").trim();


            if (!newName.startsWith("(REWORK)"))
                continue;


            newName =
                newName
                    .replace("(REWORK)", "")
                    .trim();


            const oldName =
                block.old_name
                    ? String(block.old_name).trim()
                    : newName;


            procedures.delete(oldName);


            const normalizedBlock = {

                ...block,

                name: newName,

                version: update.version,

                suggestion: false,

                reworked: true

            };


            normalizedBlock.dataBlock =
                isDataBlock(normalizedBlock);


            procedures.set(
                newName,
                normalizedBlock
            );

        }

    }


    // =================================================
    // RENDER
    // =================================================

    [...procedures.values()]
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        )
        .forEach(createCard);

}


// =====================================================
// CREATE PROCEDURE CARD
// =====================================================

function createCard(block) {

    const dataBlock =
        block.dataBlock === true ||
        isDataBlock(block);


    // =================================================
    // GET CORRECT COLOR
    // =================================================

    const colors =
        dataBlock
            ? DATA_BLOCK_COLORS
            : BLOCK_COLORS;


    const blockColor =
        colors[block.category] || "#666";


    // =================================================
    // CREATE CARD
    // =================================================

    const card =
        document.createElement("div");


    /*
        IMPORTANT:

        .procedure-card itself IS the MCreator block.

        The CSS uses:

            --color: var(--block-color);
            background: var(--color);

        Therefore the color MUST be assigned
        directly to the card.
    */

    card.className =
        `procedure-card category-${block.category.toLowerCase()}`;


    card.style.setProperty(
        "--block-color",
        blockColor
    );


    // =================================================
    // CONTENT
    // =================================================

    card.innerHTML = `

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
                        ${escapeHtml(block.category)}
                    </span>


                    <span class="procedure-tag ${
                        dataBlock
                            ? "tag-data"
                            : "tag-action"
                    }">

                        ${dataBlock ? "DATA" : "ACTION"}

                    </span>


                    ${
                        block.suggestion
                            ? `
                                <span class="procedure-tag tag-suggestion">
                                    Suggestion
                                </span>
                              `
                            : ""
                    }

                </div>

            </div>


            <div class="procedure-description">

                ${escapeHtml(
                    block.description || ""
                )}

            </div>


            <div class="procedure-footer">

                <span>
                    v${escapeHtml(
                        block.version || ""
                    )}
                </span>


                ${
                    block.reworked
                        ? `
                            <span class="procedure-tag rework">
                                REWORK
                            </span>
                          `
                        : ""
                }

            </div>

        </div>

    `;


    container.appendChild(card);

}


// =====================================================
// DATA / ACTION DETECTION
// =====================================================

function isDataBlock(block) {

    if (!block || !block.name)
        return false;


    const text =
        String(block.name)
            .toLowerCase()
            .trim();


    // -------------------------------------------------
    // COMPONENT
    // -------------------------------------------------

    if (block.category === "Component") {

        return !(
            text.includes(" do ") ||
            text.includes(" make ") ||
            text.includes(" to ") ||
            text.includes(" find ")
        );

    }


    // -------------------------------------------------
    // DATA PREFIXES
    // -------------------------------------------------

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


    return prefixes.some(prefix =>
        text.startsWith(prefix)
    );

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

}


// =====================================================
// CATEGORY ICON
// =====================================================

function getCategoryIcon(category) {

    switch (category) {

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