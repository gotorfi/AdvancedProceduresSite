"use strict";

/*
    MCreator Block Renderer
    -----------------------
    Turns:

    Spawn projectile [ x ] speed [ x ]

    into a Blockly/MCreator style block.
*/

const BLOCK_COLORS = {

    Block: "#ad9d4b",
    Entity: "#4a57a8",
    Component: "#913d3d",
    Player: "#0f868a",
    Event: "#503885",
    Item: "#8a0f42",
    Math: "#2f496b"

};

function renderProcedureBlock(data) {

    const root = document.createElement("div");
    root.className = "procedure-card";

    //-------------------------
    // Header
    //-------------------------

    const badge = document.createElement("div");
    badge.className = "procedure-badge";
    badge.textContent = data.category;

    //-------------------------
    // Block
    //-------------------------

    const block = document.createElement("div");

    block.className = "procedure-block";

    block.style.background = BLOCK_COLORS[data.category] || "#666";

    block.appendChild(createBlockContent(data.name));

    //-------------------------
    // Description
    //-------------------------

    const description = document.createElement("p");

    description.className = "procedure-description";

    description.textContent = data.description;

    //-------------------------
    // Footer
    //-------------------------

    const footer = document.createElement("div");

    footer.className = "procedure-footer";

    footer.innerHTML =
        `<span>v${data.version}</span>` +
        (data.reworked
            ? `<span class="procedure-tag rework">REWORK</span>`
            : "");

    root.appendChild(badge);
    root.appendChild(block);
    root.appendChild(description);
    root.appendChild(footer);

    return root;

}

function createBlockContent(text) {

    const wrapper = document.createElement("div");

    wrapper.className = "procedure-content";

    //----------------------------------------
    // split [ x ]
    //----------------------------------------

    const parts = text.split(/\[\s*x\s*\]/g);

    for (let i = 0; i < parts.length; i++) {

        if (parts[i].trim().length > 0) {

            const span = document.createElement("span");

            span.textContent = parts[i];

            wrapper.appendChild(span);

        }

        if (i !== parts.length - 1) {

            wrapper.appendChild(createInput());

        }

    }

    return wrapper;

}

function createInput() {

    const input = document.createElement("span");

    input.className = "procedure-input";

    return input;

}