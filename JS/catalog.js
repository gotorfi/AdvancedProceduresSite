"use strict";

async function loadCatalog() {

    const response =
        await fetch("DATA/updates.json");

    const updates =
        await response.json();


    updates.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );


    const categories = {

        Block: new Map(),
        Entity: new Map(),
        Component: new Map(),
        Player: new Map(),
        Event: new Map(),
        Math: new Map(),
        Item: new Map(),

        Suggestion: new Map(),

        Variables: [],
        Triggers: []

    };


    // =================================================
    // UPDATES
    // =================================================

    for (const update of updates) {

        // ---------------------------------------------
        // NEW BLOCKS
        // ---------------------------------------------

        for (const block of update.new_blocks || []) {

            let name =
                String(block.name || "").trim();

            if (!name)
                continue;


            let suggestion = false;


            if (name.startsWith("(Suggestion)")) {

                suggestion = true;

                name = name
                    .replace("(Suggestion)", "")
                    .trim();

            }


            const normalizedBlock = {

                ...block,

                name

            };


            const data = {

                ...normalizedBlock,

                version: update.version,

                description:
                    block.description || "",

                reworked: false,

                suggestion,

                dataBlock:
                    isDataBlock(normalizedBlock)

            };


            if (suggestion) {

                categories.Suggestion.set(
                    name,
                    data
                );

            }
            else {

                if (!categories[block.category])
                    continue;


                categories[block.category].set(
                    name,
                    data
                );

            }

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


            let name =
                String(block.name || "").trim();


            if (!name.startsWith("(REWORK)"))
                continue;


            name =
                name
                    .replace("(REWORK)", "")
                    .trim();


            const normalizedBlock = {

                ...block,

                name

            };


            const data = {

                ...normalizedBlock,

                version: update.version,

                description:
                    block.description || "",

                reworked: true,

                suggestion: false,

                dataBlock:
                    isDataBlock(normalizedBlock)

            };


            if (!categories[block.category])
                continue;


            categories[block.category].set(
                name,
                data
            );

        }


        // ---------------------------------------------
        // VARIABLES
        // ---------------------------------------------

        for (
            const variable
            of update.new_variables || []
        ) {

            categories.Variables.push({

                ...variable,

                version: update.version

            });

        }


        // ---------------------------------------------
        // TRIGGERS
        // ---------------------------------------------

        for (
            const trigger
            of update.new_triggers || []
        ) {

            categories.Triggers.push({

                ...trigger,

                version: update.version

            });

        }

    }


    return categories;

}


// =====================================================
// DATA / ACTION
// =====================================================

function isDataBlock(block) {

    if (!block || !block.name)
        return false;


    const text =
        String(block.name)
            .toLowerCase()
            .trim();


    // Component-specific rules

    if (block.category === "Component") {

        return !(
            text.includes(" do ") ||
            text.includes(" make ") ||
            text.includes(" to ") ||
            text.includes(" find ")
        );

    }


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