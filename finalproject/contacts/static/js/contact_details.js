document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.querySelector('#editButtonContact');
    const saveButton = document.querySelector('#saveButtonContact');
    const userInfo = document.querySelector('.user-info');
    
    if (!editButton || !saveButton || !userInfo) {
        console.error("Required elements not found in the DOM");
        return;
    }

    // Retrieve contact ID from the data attribute
    const contactContainer = document.querySelector('.profile-container');
    const contactId = contactContainer.getAttribute('data-contact-id');

    // Enable edit mode
    function enableEditMode() {
        saveButton.disabled = false;
        userInfo.classList.add("edit-mode");
        replaceSpansWithInputs();
    }

    // Convert spans to inputs
    function replaceSpansWithInputs() {
        document.querySelectorAll('.user-info span[contenteditable="false"]').forEach(span => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent.trim();
            input.classList.add('editable-field');
            input.id = span.id;

            // Specifically handle phone numbers
            if (span.id === "phone1" || span.id === "phone2") {
                input.setAttribute("data-phone", span.getAttribute("data-phone"));
            }

            span.replaceWith(input);
        });
    }

    // Save changes and send data to the backend
    function replaceInputsWithSpans() {
        const data = {};

        document.querySelectorAll('.user-info input.editable-field').forEach(input => {
            const span = document.createElement('span');
            span.textContent = input.value.trim();
            span.id = input.id;
            span.setAttribute("contenteditable", "false");

            if (span.id === "nickname" || span.id === "company" || span.id === "jobPosition") {
                span.style.fontSize = "19px"; // Apply 19px font for nickname, company, and jobPosition
            } else if (span.id === "birthday") {
                span.style.fontSize = "18px"; // Apply 18px font for birthday
            } else {
                span.style.fontSize = "20px"; // Apply 20px font for other fields
            }
    
            input.replaceWith(span);
            data[span.id] = span.textContent.trim();
        });

        if (Object.keys(data).length === 0) {
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
        .then(response => response.ok ? response.json() : Promise.reject(`Server error: ${response.status}`))
        .then(response => {
            if (!response.success) {
                console.error("Failed to save contact:", response.error);
            } else {
                console.log("Contact saved successfully");
            }
        })
        .catch(error => console.error("Error:", error));
    }

    // Attach events to the edit and save buttons
    editButton.addEventListener("click", enableEditMode);
    saveButton.addEventListener("click", replaceInputsWithSpans);
    
    // Handle the phone call button click
    document.getElementById("primaryPhoneButton").addEventListener("click", function() {
        const phoneNumber = document.getElementById("phone1").getAttribute("data-phone");
        const phoneLink = document.createElement("a");
        phoneLink.href = "tel:" + phoneNumber;
        phoneLink.style.display = "none";
        document.body.appendChild(phoneLink);
        phoneLink.click();
        document.body.removeChild(phoneLink); // Clean up
    });

    // Handle the message button click
    document.getElementById("primaryMessageButton").addEventListener("click", function() {
        const phoneNumber = document.getElementById("phone1").getAttribute("data-phone");
        const messageLink = document.createElement("a");
        messageLink.href = "sms:" + phoneNumber; // Open SMS with phone number pre-filled
        messageLink.style.display = "none";
        document.body.appendChild(messageLink);
        messageLink.click();
        document.body.removeChild(messageLink);
    });

    // Handle secondary phone and message button click
    document.getElementById("secondaryPhoneButton").addEventListener("click", function() {
        const phoneNumber = document.getElementById("phone2").getAttribute("data-phone");
        const phoneLink = document.createElement("a");
        phoneLink.href = "tel:" + phoneNumber;
        phoneLink.style.display = "none";
        document.body.appendChild(phoneLink);
        phoneLink.click();
        document.body.removeChild(phoneLink);
    });

    document.getElementById("secondaryMessageButton").addEventListener("click", function() {
        const phoneNumber = document.getElementById("phone2").getAttribute("data-phone");
        const messageLink = document.createElement("a");
        messageLink.href = "sms:" + phoneNumber;
        messageLink.style.display = "none";
        document.body.appendChild(messageLink);
        messageLink.click();
        document.body.removeChild(messageLink);
    });
});
