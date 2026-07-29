"use strict";

async function loadCatalog() {

    const response = await fetch("DATA/updates.json");
    const updates = await response.json();

    updates.sort((a, b) => new Date(b.date) - new Date(a.date));

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

    for (const update of updates) {

        //----------------------------------
        // New blocks
        //----------------------------------

        for (const block of update.new_blocks || []) {

            let name = block.name;
            let suggestion = false;

            if (name.startsWith("(Suggestion) ")) {

                suggestion = true;
                name = name.substring(13);

            }

            const data = {
                ...block,
                name,
                version: update.version,
                description: block.description,
                reworked: false
            };

            if (suggestion) {

                categories.Suggestion.set(name, data);

            } else {

                if (!categories[block.category])
                    continue;

                categories[block.category].set(name, data);

            }

        }

        //----------------------------------
        // Reworks
        //----------------------------------

        for (const block of update.changes || []) {

            if (!block.name.startsWith("(REWORK) "))
                continue;

            const name = block.name.substring(9);

            const data = {
                ...block,
                name,
                version: update.version,
                description: block.description,
                reworked: true
            };

            if (!categories[block.category])
                continue;

            categories[block.category].set(name, data);

        }

        //----------------------------------
        // Variables
        //----------------------------------

        for (const variable of update.new_variables || []) {

            categories.Variables.push({

                ...variable,
                version: update.version

            });

        }

        //----------------------------------
        // Triggers
        //----------------------------------

        for (const trigger of update.new_triggers || []) {

            categories.Triggers.push({

                ...trigger,
                version: update.version

            });

        }

    }

    return categories;

}