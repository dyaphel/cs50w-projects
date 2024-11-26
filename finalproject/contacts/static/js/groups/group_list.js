let global = false

function toggleGroupDetails(element) {
    // Toggle the expanded class on the profile footer
    const footer = element;
    const details = footer.querySelector('.details');

    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block"; // Show the contact details
        footer.classList.add('expanded'); // Expand the footer
    } else {
        details.style.display = "none"; // Hide the contact details
        footer.classList.remove('expanded'); // Collapse the footer
    }
}

function openGroupDetails(groupId) {
    console.log("Global state before opening group:", global);
    if (global) return; 
    window.location.href = `/group/${groupId}/`; // Assumes URL pattern is '/contact/<id>/'
 }


function toggleCheckboxes() {
    global = !global; 
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.hidden = !checkbox.hidden;
      checkbox.checked = false; // Reset checkboxes when toggling
    });
    updateDeleteButton(); // Update button status on toggle
}

function updateDeleteButton() {
    const checkboxes = document.querySelectorAll('.checkbox');
    const deleteButton = document.getElementById('deleteButton');
    // Enable delete button if at least one checkbox is checked
    deleteButton.disabled = !Array.from(checkboxes).some(checkbox => checkbox.checked);
}


function deleteSelectedGroup() {
    document.getElementById('confirmModal').style.display = 'block';
}

function confirmDelete() {
    // Execute deletion of selected groups
    const selectedGroups = [];
    document.querySelectorAll('.checkbox:checked').forEach(checkbox => {
        selectedGroups.push(checkbox.getAttribute('data-group-id')); // Collect group IDs
    });
    if (selectedGroups.length > 0) {

        fetch("delete_groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ group: selectedGroups }) // Send group IDs to backend
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error("Failed to delete groups:", data.error);
                    alert("Failed to delete groups: " + data.error);
                } else {
                    window.location.reload(); // Reload page after deletion
                    console.log("Groups deleted successfully");
                }
            })
            .catch(error => console.error("Error:", error));        
    }

    // Hide the confirmation modal
    document.getElementById('confirmModal').style.display = 'none';
}

function cancelDelete() {
    // Hide the confirmation modal and reset checkboxes
    document.getElementById('confirmModal').style.display = 'none';
    toggleCheckboxes(); // Hide and deselect checkboxes
}

