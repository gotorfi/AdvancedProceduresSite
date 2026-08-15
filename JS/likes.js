"use strict";


const LIKES_API =
    "https://script.google.com/macros/s/AKfycbxIjPHSgCSAoxB9uo7V0MG8fy1Q8iS97RXkmFdABa3HsLVL3znZQ-T8GoMa_luhEZgM_g/exec";


function getVisitorId() {

    const cookieName = "advanced_procedures_visitor";

    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {

        const [name, ...value] = cookie.trim().split("=");

        if (name === cookieName) {
            return decodeURIComponent(value.join("="));
        }

    }


    const visitorId =
        crypto.randomUUID();


    document.cookie =
        `${cookieName}=${encodeURIComponent(visitorId)}; max-age=31536000; path=/; SameSite=Lax`;


    return visitorId;

}


async function getLikeStatus(version) {

    const visitorId = getVisitorId();

    const url =
        `${LIKES_API}?version=${encodeURIComponent(version)}&visitorId=${encodeURIComponent(visitorId)}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        return data;

    }

    catch (error) {

        console.error("Failed to load likes:", error);

        return {
            success: false,
            likes: 0,
            liked: false
        };

    }

}


async function toggleLike(version) {

    const visitorId = getVisitorId();

    const button =
        document.querySelector(`[data-like-version="${CSS.escape(version)}"]`);

    if (!button) {
        return;
    }


    const currentlyLiked =
        button.dataset.liked === "true";


    button.disabled = true;


    try {

        const response = await fetch(LIKES_API, {

            method: "POST",

            body: JSON.stringify({

                version: version,
                visitorId: visitorId,
                action: currentlyLiked
                    ? "unlike"
                    : "like"

            })

        });


        const data =
            await response.json();


        if (!data.success) {
            throw new Error(data.error || "Unknown error.");
        }


        updateLikeButton(
            version,
            data.likes,
            data.liked
        );

    }

    catch (error) {

        console.error("Failed to update like:", error);

    }

    finally {

        button.disabled = false;

    }

}


function updateLikeButton(version, likes, liked) {

    const button =
        document.querySelector(`[data-like-version="${CSS.escape(version)}"]`);

    if (!button) {
        return;
    }


    button.dataset.liked =
        liked ? "true" : "false";


    button.classList.toggle(
        "liked",
        liked
    );


    button.innerHTML = `

        <span class="like-icon">
            ${liked ? "♥" : "♡"}
        </span>

        <span class="like-count">
            ${likes}
        </span>

    `;

}


function createLikeButton(version) {

    const button =
        document.createElement("button");


    button.type = "button";

    button.className =
        "like-button";


    button.dataset.likeVersion =
        version;

    button.dataset.liked =
        "false";


    button.innerHTML = `

        <span class="like-icon">
            ♡
        </span>

        <span class="like-count">
            0
        </span>

    `;


    button.addEventListener(
        "click",
        () => toggleLike(version)
    );


    loadLikeStatus(
        version
    );


    return button;

}


async function loadLikeStatus(version) {

    const data =
        await getLikeStatus(version);


    if (!data.success) {
        return;
    }


    updateLikeButton(
        version,
        data.likes,
        data.liked
    );

}