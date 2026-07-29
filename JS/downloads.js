"use strict";

const grid = document.getElementById("downloads-grid");

document.addEventListener("DOMContentLoaded", loadDownloads);

async function loadDownloads() {

    const response = await fetch("DATA/downloads.json");
    const downloads = await response.json();

    downloads.sort((a, b) => {

        const av = a.version.split(".").map(Number);
        const bv = b.version.split(".").map(Number);

        if (av[0] !== bv[0])
            return bv[0] - av[0];

        return bv[1] - av[1];

    });

    grid.innerHTML = "";

    downloads.forEach(createCard);

}

function createCard(download) {

    const card = document.createElement("div");

    card.className = "download-card";

    card.innerHTML = `

        <div class="download-header">

            <div>

                <div class="download-version">
                    MCreator Neoforge ${download.version}
                </div>

                <div class="download-support">
                    Minecraft ${download.supports.join(", ")}
                </div>

            </div>

            <div class="download-icon">
                📦
            </div>

        </div>

        <div class="divider"></div>

        <p class="download-file">

            ${download.package.split("/").pop()}

        </p>

        <a
            class="button"
            href="${download.package}"
            download>

            Download ZIP

        </a>

    `;

    grid.appendChild(card);

}