"use strict";

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyKxkDyaE8aF-4KSF9d7HZZ1M-jilI1Dwi0F94SCdKJ58RkW9bl-QYZSN1cY_2Dkndo2A/exec";

const form =
    document.getElementById("ticket-feedback-form");

const stars =
    document.querySelectorAll(".rating-star");

const feedbackInput =
    document.getElementById("feedback");

const feedbackCounter =
    document.getElementById("feedback-counter");

const ratingStatus =
    document.getElementById("rating-status");

const status =
    document.getElementById("ticket-feedback-status");

let selectedRating = 0;


stars.forEach(star => {

    star.addEventListener("click", function () {

        selectedRating =
            Number(this.dataset.rating);

        updateStars();

    });

});


function updateStars() {

    stars.forEach(star => {

        const rating =
            Number(star.dataset.rating);

        if (rating <= selectedRating) {

            star.classList.add("active");

        }

        else {

            star.classList.remove("active");

        }

    });


    if (selectedRating === 1) {

        ratingStatus.textContent =
            "1 star";

    }

    else if (selectedRating > 1) {

        ratingStatus.textContent =
            selectedRating + " stars";

    }

    else {

        ratingStatus.textContent =
            "Select a rating";

    }

}


feedbackInput.addEventListener(
    "input",
    function () {

        if (this.value.length > 200) {

            this.value =
                this.value.substring(0, 200);

        }

        feedbackCounter.textContent =
            this.value.length;

    }
);


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const feedback =
            feedbackInput.value.trim();


        if (selectedRating < 1 || selectedRating > 5) {

            status.textContent =
                "Please select a star rating.";

            return;

        }


        if (feedback.length === 0) {

            status.textContent =
                "Please enter your feedback.";

            return;

        }


        if (feedback.length > 200) {

            status.textContent =
                "Your feedback cannot exceed 200 characters.";

            return;

        }


        status.textContent =
            "Sending...";


        try {

            const response =
                await fetch(
                    SCRIPT_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "text/plain"
                        },

                        body: JSON.stringify({
                            action: "ticketFeedback",
                            stars: selectedRating,
                            feedback: feedback
                        })

                    }
                );


            const result =
                await response.json();


            if (result.success) {

                status.textContent =
                    "Thank you for your feedback!";


                form.reset();


                selectedRating = 0;

                updateStars();


                feedbackCounter.textContent =
                    "0";

            }

            else {

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
);