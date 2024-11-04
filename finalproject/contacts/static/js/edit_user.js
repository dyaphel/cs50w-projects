document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("editButton").addEventListener("click", function () {
        const fields = document.querySelectorAll("[contenteditable]");
        fields.forEach(field => field.setAttribute("contenteditable", "true"));
    });
    
    document.getElementById("saveButton").addEventListener("click", function () {
        const data = {
            first_name: document.getElementById("firstName").innerText,
            last_name: document.getElementById("lastName").innerText,
            nickname: document.getElementById("nickname").innerText,
            company: document.getElementById("company").innerText,
            job_position: document.getElementById("jobPosition").innerText,
            email: document.getElementById("email").innerText,
            phone_number_1: document.getElementById("phone1").innerText,
            phone_number_2: document.getElementById("phone2").innerText,
        };
    
        fetch('update_profile', { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                body: data}),
        })
        .then(response => response.json())
        .then(response => {
            if (response.ok) {
                alert("Profile updated successfully!");
                const fields = document.querySelectorAll("[contenteditable]");
                fields.forEach(field => field.setAttribute("contenteditable", "false"));
            } else {
                alert("Error updating profile.");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});