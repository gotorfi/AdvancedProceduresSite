"use strict";


const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwaNkldk1zRv2TGAjgC5-5OBhKlP6zIWwX_lI8k_Ypg6zFQZn5Ny-lo4o43obKCSUCd0Q/exec";


const category = document.getElementById("category");

const bugFields = document.getElementById("bug-fields");
const normalFields = document.getElementById("normal-fields");

const form = document.getElementById("feedback-form");
const status = document.getElementById("status");



category.addEventListener("change", function(){


    const value = category.value;


    if(value === "Bug report"){

        bugFields.style.display = "block";
        normalFields.style.display = "none";

    }
    else if(value !== ""){

        bugFields.style.display = "none";
        normalFields.style.display = "block";

    }
    else{

        bugFields.style.display = "none";
        normalFields.style.display = "none";

    }


});





form.addEventListener("submit", async function(event){


    event.preventDefault();



    const data = {


        category:
            document.getElementById("category").value,


        message:
            document.getElementById("message").value,


        bug:
            document.getElementById("bug").value,


        screenshots:
            document.getElementById("screenshots").value,


        version:
            document.getElementById("version").value,


        email:
            document.getElementById("email").value


    };



    status.textContent = "Sending...";



    try{


        const response = await fetch(
            SCRIPT_URL,
            {
                method:"POST",
                headers:{
                    "Content-Type":"text/plain"
                },
                body:JSON.stringify(data)
            }
        );


        const text = await response.text();


        const result = JSON.parse(text);



        if(result.success){

            status.textContent =
                "Thank you for your feedback!";

            form.reset();

        }
        else{

            console.error(result);

            status.textContent =
                "Failed to send feedback.";

        }



    }
    catch(error){


        console.error(error);


        status.textContent =
            "Failed to send feedback. Please try again later.";


    }


});