// Move the toggleForm function to the global scope
function toggleForm() {
    const form = document.getElementById("add-contact-form");
    if (form) {
        console.log("Toggling form visibility.");
        form.style.display = form.style.display === "none" || form.style.display === "" ? "block" : "none";
    } else {
        console.error("Form not found.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded and DOM content ready.");
    const csrftoken = '{{ csrf_token }}'; // Set the token in the template

    // Ensure that the element .btn-sidebar is correctly selected
    document.querySelector(".btn-sidebar").addEventListener("click", () => {
        console.log("Sidebar button clicked.");
        toggleForm();
    });

    // JavaScript to handle adding a new contact
    document.getElementById("submit-contact-btn").addEventListener("click", function() {
        const data = {
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            phone_number1: document.getElementById("phone_number1").value,
            phone_number2: document.getElementById("phone_number2").value || null,
            email: document.getElementById("email").value || null,
            association: document.getElementById("association").value,
            is_favorite: document.getElementById("is_favorite").checked
        };

        fetch("/add_contact/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Contact added successfully!");
                toggleForm();
            } else {
                alert("Error adding contact.");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
