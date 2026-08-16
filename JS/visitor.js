"use strict";


const VISITOR_API =
    "https://script.google.com/macros/s/AKfycbzQrZecBAKkGHlyvaUa6Zmek2Laol8SM5TNMJ4PiEuPouJXJ4JaOXsCWFOtXFFWzPBjpg/exec";


async function registerVisitor() {

    const visitorId =
        getVisitorId();


    const url =
        `${VISITOR_API}` +
        `?visitorId=${encodeURIComponent(visitorId)}`;


    try {

        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                "Failed to register visitor:",
                data.error
            );

            return;

        }


        console.log(
            "Visitor registered:",
            data.visitors
        );

    }

    catch (error) {

        console.error(
            "Failed to register visitor:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    registerVisitor
);