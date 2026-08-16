"use strict";


const LIKES_API =
    "https://script.google.com/macros/s/AKfycbzQrZecBAKkGHlyvaUa6Zmek2Laol8SM5TNMJ4PiEuPouJXJ4JaOXsCWFOtXFFWzPBjpg/exec";


function showLikeToast() {

    let toast =
        document.getElementById("like-toast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "like-toast";

        toast.className = "like-toast";

        toast.textContent =
            "Thank you for liking this update post!";

        document.body.appendChild(toast);

    }


    requestAnimationFrame(() => {

        toast.classList.add("show");

    });


    clearTimeout(
        toast.hideTimeout
    );


    toast.hideTimeout =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


function createFloatingHearts() {

    const container =
        document.createElement("div");

    container.className =
        "floating-hearts";

    document.body.appendChild(container);


    const amount =
        Math.floor(
            Math.random() * 11
        ) + 12;


    for (let i = 0; i < amount; i++) {

        const heart =
            document.createElement("img");


        heart.src =
            "IMG/heart.png";

        heart.alt = "";

        heart.className =
            "floating-heart";


        const startX =
            Math.random() * 100;

        const drift =
            (Math.random() - 0.5) * 260;

        const duration =
            1.8 + Math.random() * 2.2;

        const delay =
            Math.random() * 0.7;

        const opacity =
            0.3 + Math.random() * 0.7;

        const size =
            18 + Math.random() * 22;


        heart.style.left =
            `${startX}%`;

        heart.style.width =
            `${size}px`;

        heart.style.height =
            `${size}px`;

        heart.style.opacity =
            opacity;

        heart.style.setProperty(
            "--heart-drift",
            `${drift}px`
        );

        heart.style.animationDuration =
            `${duration}s`;

        heart.style.animationDelay =
            `${delay}s`;


        container.appendChild(
            heart
        );

    }


    setTimeout(() => {

        container.remove();

    }, 4500);

}


function getVisitorId() {

    const cookieName =
        "advanced_procedures_visitor";

    const cookies =
        document.cookie.split(";");


    for (const cookie of cookies) {

        const [
            name,
            ...value
        ] =
            cookie.trim().split("=");


        if (name === cookieName) {

            return decodeURIComponent(
                value.join("=")
            );

        }

    }


    const visitorId =
        crypto.randomUUID();


    document.cookie =
        `${cookieName}=${encodeURIComponent(visitorId)}; max-age=31536000; path=/; SameSite=Lax`;


    return visitorId;

}


async function getLikeStatus(version) {

    const visitorId =
        getVisitorId();


    const url =
        `${LIKES_API}` +
        `?action=get` +
        `&version=${encodeURIComponent(version)}` +
        `&visitorId=${encodeURIComponent(visitorId)}`;


    try {

        const response =
            await fetch(url);


        const data =
            await response.json();


        return data;

    }

    catch (error) {

        console.error(
            "Failed to load likes:",
            error
        );


        return {

            success: false,

            likes: 0,

            liked: false

        };

    }

}


async function toggleLike(version) {

    const visitorId =
        getVisitorId();


    const button =
        document.querySelector(
            `[data-like-version="${CSS.escape(version)}"]`
        );


    if (!button) {
        return;
    }


    const currentlyLiked =
        button.dataset.liked === "true";


    const action =
        currentlyLiked
            ? "unlike"
            : "like";


    button.disabled = true;


    const url =
        `${LIKES_API}` +
        `?action=${encodeURIComponent(action)}` +
        `&version=${encodeURIComponent(version)}` +
        `&visitorId=${encodeURIComponent(visitorId)}`;


    try {

        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Unknown error."
            );

        }


        updateLikeButton(
            version,
            data.likes,
            data.liked
        );


        if (
            action === "like" &&
            data.liked
        ) {

            animateLikeButton(
                version
            );

            createFloatingHearts();

            showLikeToast();

        }

    }

    catch (error) {

        console.error(
            "Failed to update like:",
            error
        );

    }

    finally {

        button.disabled = false;

    }

}


function updateLikeButton(
    version,
    likes,
    liked
) {

    const button =
        document.querySelector(
            `[data-like-version="${CSS.escape(version)}"]`
        );


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

            <img
                src="${liked
                    ? "IMG/heart.png"
                    : "IMG/empty_heart.png"}"
                alt=""
            >

        </span>

        <span class="like-count">
            ${likes}
        </span>

    `;

}


function animateLikeButton(version) {

    const button =
        document.querySelector(
            `[data-like-version="${CSS.escape(version)}"]`
        );


    if (!button) {
        return;
    }


    const icon =
        button.querySelector(
            ".like-icon"
        );


    if (!icon) {
        return;
    }


    icon.classList.remove(
        "like-pop"
    );


    void icon.offsetWidth;


    icon.classList.add(
        "like-pop"
    );

}


function createLikeButton(version) {

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.className =
        "like-button";


    button.dataset.likeVersion =
        version;


    button.dataset.liked =
        "false";


    button.innerHTML = `

        <span class="like-icon">

            <img
                src="IMG/empty_heart.png"
                alt=""
            >

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