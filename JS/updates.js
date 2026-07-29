"use strict";

// Elements

const versionElement = document.getElementById("update-version");
const subtitleElement = document.getElementById("update-subtitle");
const dateElement = document.getElementById("update-date");
const imageElement = document.getElementById("update-image");
const contentElement = document.getElementById("update-content");

// Initialize

document.addEventListener("DOMContentLoaded", loadUpdate);

// Functions

async function loadUpdate() {

    const params = new URLSearchParams(window.location.search);
    const version = params.get("version");

    if (!version) {
        document.body.innerHTML = "<h1>Missing version.</h1>";
        return;
    }

    const response = await fetch("DATA/updates.json");
    const updates = await response.json();

    const update = updates.find(item => item.version === version);

    if (!update) {
        document.body.innerHTML = "<h1>Update not found.</h1>";
        return;
    }

    document.title = `Version ${update.version}`;

    versionElement.textContent = `Version ${update.version}`;
    subtitleElement.textContent = update.subtitle;

    dateElement.textContent = new Date(update.date).toLocaleDateString("en-GB",{
        day:"2-digit",
        month:"long",
        year:"numeric"
    });

    imageElement.src = `IMGUPDATES/v_${update.version.replaceAll(".","_")}.png`;
    imageElement.alt = update.version;

    buildPage(update);

}

function buildPage(update) {

    contentElement.innerHTML = "";

    createObjectSection("New Blocks",update.new_blocks);
    createObjectSection("New Variables",update.new_variables);
    createObjectSection("New Triggers",update.new_triggers);
    createStringSection("Supported Versions",update.new_versions);
    if (update.changes.length > 0) {

        if (typeof update.changes[0] === "string") {
            createStringSection("Changes", update.changes);
        } else {
            createObjectSection("Changes", update.changes);
        }

    }
    createStringSection("Bug Fixes",update.fixes);

}

function createObjectSection(title,data){

    if(!data || data.length===0){
        return;
    }

    const section=document.createElement("section");

    section.innerHTML=`<h2>${title}</h2><br>`;

    data.forEach(item=>{

        const card=document.createElement("div");

        card.className="card";

        card.innerHTML=`
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        `;

        section.appendChild(card);

        section.appendChild(document.createElement("br"));

    });

    contentElement.appendChild(section);

}

function createStringSection(title,data){

    if(!data || data.length===0){
        return;
    }

    const section=document.createElement("section");

    section.innerHTML=`<h2>${title}</h2>`;

    const list=document.createElement("ul");

    list.className="list";

    data.forEach(item=>{

        const li=document.createElement("li");

        li.textContent="• "+item;

        list.appendChild(li);

    });

    section.appendChild(document.createElement("br"));
    section.appendChild(list);
    section.appendChild(document.createElement("br"));
    section.appendChild(document.createElement("br"));

    contentElement.appendChild(section);

}