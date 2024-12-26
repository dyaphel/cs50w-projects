let groupglobal = false

function toggleGroupDetails(element) {
    
    const footer = element;
    const details = footer.querySelector('.details');
    console.log("Toggling details:", details);

    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block"; // Show the contact details
        footer.classList.add('expanded'); // Expand the footer
    } else {
        details.style.display = "none"; // Hide the contact details
        footer.classList.remove('expanded'); // Collapse the footer
    }
}

function openGroupDetails(groupId) {
    console.log("Group ID:", groupId);
    console.log("Global state before opening group:", groupglobal);
    if (groupglobal) return; 
    window.location.href = `/group/${groupId}/`;
 }


function toggleCheckboxes() {
    groupglobal = !groupglobal; 
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.hidden = !checkbox.hidden;
      checkbox.checked = false; 
    });
    updateDeleteButton(); 
}

function updateDeleteButton() {
    const checkboxes = document.querySelectorAll('.checkbox');
    const deleteButton = document.getElementById('deleteButtonGroup');
    // Enable delete button if at least one checkbox is checked
    deleteButton.disabled = !Array.from(checkboxes).some(checkbox => checkbox.checked);
}


function deleteSelectedGroup() {
    document.getElementById('confirmModal').style.display = 'block';
}

function confirmDelete() {
   
    const selectedGroups = [];
    document.querySelectorAll('.checkbox:checked').forEach(checkbox => {
        selectedGroups.push(checkbox.getAttribute('data-group-id')); 
    });
    if (selectedGroups.length > 0) {

        fetch("delete_groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ group: selectedGroups }) 
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error("Failed to delete groups:", data.error);
                    alert("Failed to delete groups: " + data.error);
                } else {
                    window.location.reload();
                    console.log("Groups deleted successfully");
                }
            })
            .catch(error => console.error("Error:", error));        
    }


    document.getElementById('confirmModal').style.display = 'none';
}

function cancelDelete() {
    document.getElementById('confirmModal').style.display = 'none';
    toggleCheckboxes(); 
}

