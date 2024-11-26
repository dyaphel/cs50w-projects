document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.querySelector('#editButtonGroup');
    const saveButton = document.querySelector('#saveButtonGroup');
    const userInfo = document.querySelector('.user-info');
    const favorite = document.querySelector('#FavoriteButtonGroup');
    
    if (!editButton || !saveButton || !userInfo) {
        console.error("Required elements not found in the DOM");
        return;
    }

    // Retrieve contact ID from the data attribute
    const contactContainer = document.querySelector('.profile-container');
    const contactId = contactContainer.getAttribute('data-group-id');

    // Enable edit mode
    function enableEditMode() {
        favorite.disabled = true;
        favorite.style.display = 'none';
        saveButton.disabled = false;
        userInfo.classList.add("edit-mode");
        replaceSpansWithInputs();
    }

    // Convert spans to inputs
    function replaceSpansWithInputs() {
        document.querySelectorAll('.group-info span[contenteditable="false"]').forEach(span => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent.trim();
            input.classList.add('editable-field');
            input.id = span.id;

            if (textarea.id === "pinned-message") {
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
        favorite.style.display = 'inline';

        fetch(`/group/${groupId}/edit_group/`, {
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
    
   
});
