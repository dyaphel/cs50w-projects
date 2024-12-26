document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.querySelector('#editButton');
    const saveButton = document.querySelector('#saveButton');
    const userInfo = document.querySelector('.user-info');

    // Toggle editable mode
    function enableEditMode() {
        saveButton.disabled = false;
        userInfo.classList.add("edit-mode");
        replaceSpansWithInputs();  // Replace spans with input fields
    }

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

    function replaceInputsWithSpans() {
        const data = {};

        
        document.querySelectorAll('.user-info input.editable-field').forEach(input => {
            const span = document.createElement('span');
            span.textContent = input.value.trim();
            span.id = input.id;
            span.setAttribute("contenteditable", "false");
            input.replaceWith(span);

            // Collect data for the fetch request
            if (span.textContent.trim()) {
                data[span.id] = span.textContent.trim();
            }

            //console.log(`Field ID: ${span.id}, Field Value: ${span.textContent}`);
        });

        // Log the entire data object before sending
        //console.log("Data to be sent to the server:", data);

        if (Object.keys(data).length === 0) {
            console.error("No data collected to send");
            alert("No data to save! Please make sure all fields are filled.");
            return;
        }

        saveButton.disabled = true;
        userInfo.classList.remove("edit-mode");

        fetch("update_profile", {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {
            if (!response.success) {
                console.error("Failed to save profile:", response.error);
                alert("Failed to save profile: " + response.error);
            } else {
                console.log("Profile saved successfully");
            }
        })
        .catch(error => console.error("Error:", error));
    }

    if (editButton) {
        editButton.addEventListener("click", enableEditMode);
    }
    if (saveButton) {
        saveButton.addEventListener("click", replaceInputsWithSpans);
    }

});