document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.querySelector('#editButtonContact');
    const saveButton = document.querySelector('#saveButtonContact');
    const userInfo = document.querySelector('.user-info');
    
    // Ensure the elements are found in the DOM
    if (!editButton || !saveButton || !userInfo) {
        console.error("Required elements not found in the DOM");
        return;
    }

    // Function to enable edit mode
    function enableEditMode() {
        if (saveButton && userInfo) {
            saveButton.disabled = false;
            userInfo.classList.add("edit-mode"); // Add a class for edit mode styling
            replaceSpansWithInputs();  // Convert spans to input fields
        }
    }

    // Function to convert spans to inputs for editing
    function replaceSpansWithInputs() {
        document.querySelectorAll('.user-info span[contenteditable="false"]').forEach(span => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent.trim();
            input.classList.add('editable-field');
            input.id = span.id;
            span.replaceWith(input);
        });
    }

    // Function to save changes and update the database
    function replaceInputsWithSpans() {
        console.log("Replacing inputs with spans for contact:", contactId);
        const data = {};

        // Replace input fields with spans and collect data for the server
        document.querySelectorAll('.user-info input.editable-field').forEach(input => {
            const span = document.createElement('span');
            span.textContent = input.value.trim();
            span.id = input.id;
            span.setAttribute("contenteditable", "false");
            input.replaceWith(span);

            // Collect the data to be sent to the backend
            if (span.textContent.trim()) {
                data[span.id] = span.textContent.trim();
            }

            console.log(`Field ID: ${span.id}, Field Value: ${span.textContent}`);
        });

        console.log("Data to be sent to the server:", data);

        // Check if there is any data to send
        if (Object.keys(data).length === 0) {
            console.error("No data collected to send");
            alert("No data to save! Please make sure all fields are filled.");
            return;
        }

        saveButton.disabled = true;
        userInfo.classList.remove("edit-mode");

        fetch(`/contact/${contactId}/edit_contact/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log("Response received:", response);
            return response.json();
        })
        .then(response => {
            if (!response.success) {
                console.error("Failed to save contact:", response.error);
            } else {
                console.log("Contact saved successfully");
            }
        })
        .catch(error => console.error("Error:", error));
        
    }

    // Attach the event listeners to the buttons
    editButton.addEventListener("click", enableEditMode);
    saveButton.addEventListener("click", replaceInputsWithSpans);


});














document.getElementById("primaryPhoneButton").addEventListener("click", function() {
    // Create a hidden anchor tag to make the call
    const phoneLink = document.createElement("a");
    phoneLink.href = "tel:{{ contact.phone_number_1 }}";
    phoneLink.style.display = "none";
    document.body.appendChild(phoneLink);
    phoneLink.click();
    document.body.removeChild(phoneLink); // Clean up
});

    // Handle the message button click
document.getElementById("primaryMessageButton").addEventListener("click", function() {
    const messageLink = document.createElement("a");
    messageLink.href = "sms:{{ contact.phone_number_1 }}";  // Open SMS with phone number pre-filled
    messageLink.style.display = "none";
    document.body.appendChild(messageLink);
    messageLink.click();
    document.body.removeChild(messageLink);
});

document.getElementById("secondaryPhoneButton").addEventListener("click", function() {
    // Create a hidden anchor tag to make the call
    const phoneLink = document.createElement("a");
    phoneLink.href = "tel:{{ contact.phone_number_1 }}";
    phoneLink.style.display = "none";
    document.body.appendChild(phoneLink);
    phoneLink.click();
    document.body.removeChild(phoneLink); // Clean up
});

    // Handle the message button click
document.getElementById("secondaryMessageButton").addEventListener("click", function() {
    const messageLink = document.createElement("a");
    messageLink.href = "sms:{{ contact.phone_number_1 }}";  // Open SMS with phone number pre-filled
    messageLink.style.display = "none";
    document.body.appendChild(messageLink);
    messageLink.click();
    document.body.removeChild(messageLink);
});


