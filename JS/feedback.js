"use strict";


const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxszTZMEVmfvdOuurPG314z1hL916h5fv84waHbR0rxhJd173zlVWLZt1BeoBXQeNQNwQ/exec";


const category =
    document.getElementById("category");

const bugFields =
    document.getElementById("bug-fields");

const normalFields =
    document.getElementById("normal-fields");

const form =
    document.getElementById("feedback-form");

const status =
    document.getElementById("status");

const emailInput =
    document.getElementById("email");

const warningModal =
    document.getElementById("email-warning-modal");

const warningYes =
    document.getElementById("email-warning-yes");

const warningNo =
    document.getElementById("email-warning-no");

const versionSelect =
    document.getElementById("version-select");

const selectedVersionsContainer =
    document.getElementById("selected-versions");


let availableVersions = [];

let selectedVersions = [];



/* ========================================================= */
/* INITIALIZE */
/* ========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    await loadVersions();

});



/* ========================================================= */
/* CATEGORY */
/* ========================================================= */

category.addEventListener("change", function () {

    const value = category.value;


    if (value === "Bug report") {

        bugFields.style.display = "block";
        normalFields.style.display = "none";

    }

    else if (value !== "") {

        bugFields.style.display = "none";
        normalFields.style.display = "block";

    }

    else {

        bugFields.style.display = "none";
        normalFields.style.display = "none";

    }

});



/* ========================================================= */
/* LOAD DOWNLOAD VERSIONS */
/* ========================================================= */

async function loadVersions() {

    try {

        const response =
            await fetch("DATA/downloads.json");


        if (!response.ok) {

            throw new Error(
                "Could not load downloads.json"
            );

        }


        const downloads =
            await response.json();


        availableVersions = [];


        downloads.forEach(download => {

            const mcreatorVersion =
                download.version;

            const supports =
                download.supports || [];


            supports.forEach(minecraftVersion => {

                const value =
                    `${mcreatorVersion}|${minecraftVersion}`;


                /*
                 * Prevent duplicate entries in case
                 * downloads.json contains duplicates.
                 */

                if (
                    !availableVersions.some(
                        version =>
                            version.value === value
                    )
                ) {

                    availableVersions.push({

                        value: value,

                        mcreator: mcreatorVersion,

                        minecraft: minecraftVersion

                    });

                }

            });

        });


        availableVersions.sort((a, b) => {

            const mcreatorCompare =
                compareVersions(
                    b.mcreator,
                    a.mcreator
                );


            if (mcreatorCompare !== 0) {

                return mcreatorCompare;

            }


            return compareVersions(
                b.minecraft,
                a.minecraft
            );

        });


        populateVersionSelect();

    }

    catch (error) {

        console.error(error);


        versionSelect.innerHTML = `
            <option value="">
                Failed to load versions
            </option>
        `;

    }

}



/* ========================================================= */
/* POPULATE VERSION SELECT */
/* ========================================================= */

function populateVersionSelect() {

    versionSelect.innerHTML = `
        <option value="">
            Select a version
        </option>
    `;


    availableVersions.forEach(version => {

        const option =
            document.createElement("option");


        option.value =
            version.value;


        option.textContent =
            `${version.mcreator} ${version.minecraft}`;


        versionSelect.appendChild(option);

    });


    updateVersionOptions();

}



/* ========================================================= */
/* UPDATE VERSION OPTIONS */
/* ========================================================= */

function updateVersionOptions() {

    const selectedValues =
        new Set(
            selectedVersions.map(
                version => version.value
            )
        );


    Array.from(
        versionSelect.options
    ).forEach(option => {

        if (!option.value) {
            return;
        }


        const isSelected =
            selectedValues.has(option.value);


        option.disabled =
            isSelected;


        if (isSelected) {

            option.classList.add(
                "version-option-disabled"
            );

        }

        else {

            option.classList.remove(
                "version-option-disabled"
            );

        }

    });

}



/* ========================================================= */
/* VERSION SELECT */
/* ========================================================= */

versionSelect.addEventListener(
    "change",
    function () {

        const value =
            versionSelect.value;


        if (!value) {

            return;

        }


        /*
         * Don't allow duplicate selections.
         */

        const alreadySelected =
            selectedVersions.some(
                version =>
                    version.value === value
            );


        if (alreadySelected) {

            versionSelect.value = "";

            return;

        }


        const parts =
            value.split("|");


        const mcreator =
            parts[0];

        const minecraft =
            parts[1];


        selectedVersions.push({

            value: value,

            mcreator: mcreator,

            minecraft: minecraft

        });


        /*
         * Immediately disable the newly
         * selected option.
         */

        updateVersionOptions();


        renderSelectedVersions();


        /*
         * Return the dropdown to its
         * placeholder.
         */

        versionSelect.value = "";

    }
);



/* ========================================================= */
/* RENDER SELECTED VERSION TAGS */
/* ========================================================= */

function renderSelectedVersions() {

    selectedVersionsContainer.innerHTML = "";


    selectedVersions.forEach(
        (version, index) => {

            const tag =
                document.createElement("div");


            tag.className =
                "selected-version-tag";


            const text =
                document.createElement("span");


            text.className =
                "version-tag-text";


            text.textContent =
                `${version.mcreator} ${version.minecraft}`;


            /*
             * Remove button
             */

            const remove =
                document.createElement("button");


            remove.type =
                "button";


            remove.className =
                "version-tag-remove";


            remove.setAttribute(
                "aria-label",
                `Remove ${version.mcreator} ${version.minecraft}`
            );


            remove.title =
                "Remove version";


            /*
             * Create the X using CSS.
             */

            const lineOne =
                document.createElement("span");


            const lineTwo =
                document.createElement("span");


            lineOne.className =
                "remove-line remove-line-one";


            lineTwo.className =
                "remove-line remove-line-two";


            remove.appendChild(lineOne);

            remove.appendChild(lineTwo);


            remove.addEventListener(
                "click",
                function () {

                    /*
                     * Remove this version.
                     */

                    selectedVersions.splice(
                        index,
                        1
                    );


                    /*
                     * Re-render the tags.
                     */

                    renderSelectedVersions();


                    /*
                     * Re-enable the removed
                     * option in the dropdown.
                     */

                    updateVersionOptions();

                }
            );


            tag.appendChild(text);

            tag.appendChild(remove);

            selectedVersionsContainer.appendChild(tag);

        }
    );

}



/* ========================================================= */
/* FORM SUBMIT */
/* ========================================================= */

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        if (email === "") {

            openWarningModal();

            return;

        }


        sendFeedback();

    }
);



/* ========================================================= */
/* WARNING MODAL */
/* ========================================================= */

function openWarningModal() {

    if (!warningModal) {

        sendFeedback();

        return;

    }


    warningModal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );

}



function closeWarningModal() {

    if (!warningModal) {

        return;

    }


    warningModal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}



/* ========================================================= */
/* YES / NO */
/* ========================================================= */

if (warningYes) {

    warningYes.addEventListener(
        "click",
        function () {

            closeWarningModal();

            sendFeedback();

        }
    );

}


if (warningNo) {

    warningNo.addEventListener(
        "click",
        function () {

            closeWarningModal();

        }
    );

}



/* ========================================================= */
/* SEND FEEDBACK */
/* ========================================================= */

async function sendFeedback() {

    const data = {

        category:
            document.getElementById(
                "category"
            ).value,


        message:
            document.getElementById(
                "message"
            )?.value || "",


        bug:
            document.getElementById(
                "bug"
            )?.value || "",


        screenshots:
            document.getElementById(
                "screenshots"
            )?.value || "",


        version:
            formatSelectedVersions(),


        email:
            emailInput.value.trim()

    };


    status.textContent =
        "Sending...";


    try {

        const response =
            await fetch(
                SCRIPT_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain"

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        const text =
            await response.text();


        const result =
            JSON.parse(text);


        if (result.success) {

            status.textContent =
                "Thank you for your feedback!";


            form.reset();


            bugFields.style.display =
                "none";


            normalFields.style.display =
                "none";


            selectedVersions = [];


            renderSelectedVersions();


            versionSelect.value = "";


            updateVersionOptions();

        }

        else {

            console.error(result);


            status.textContent =
                "Failed to send feedback.";

        }

    }

    catch (error) {

        console.error(error);


        status.textContent =
            "Failed to send feedback. Please try again later.";

    }

}



/* ========================================================= */
/* FORMAT VERSION DATA FOR GOOGLE SHEETS */
/* ========================================================= */

function formatSelectedVersions() {

    const grouped =
        new Map();


    selectedVersions.forEach(version => {

        if (!grouped.has(version.mcreator)) {

            grouped.set(
                version.mcreator,
                []
            );

        }


        const minecraftVersions =
            grouped.get(
                version.mcreator
            );


        if (
            !minecraftVersions.includes(
                version.minecraft
            )
        ) {

            minecraftVersions.push(
                version.minecraft
            );

        }

    });


    const result = [];


    grouped.forEach(
        (minecraftVersions, mcreator) => {

            minecraftVersions.sort(
                compareVersions
            );


            result.push(
                `${mcreator} ${minecraftVersions.join(" & ")}`
            );

        }
    );


    result.sort((a, b) => {

        const versionA =
            a.split(" ")[0];


        const versionB =
            b.split(" ")[0];


        return compareVersions(
            versionB,
            versionA
        );

    });


    return result.join(", ");

}



/* ========================================================= */
/* VERSION COMPARISON */
/* ========================================================= */

function compareVersions(a, b) {

    const aParts =
        a.split(".").map(Number);


    const bParts =
        b.split(".").map(Number);


    const length =
        Math.max(
            aParts.length,
            bParts.length
        );


    for (
        let i = 0;
        i < length;
        i++
    ) {

        const aValue =
            aParts[i] || 0;


        const bValue =
            bParts[i] || 0;


        if (aValue !== bValue) {

            return aValue - bValue;

        }

    }


    return 0;

}