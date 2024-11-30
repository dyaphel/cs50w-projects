document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const selectButton = document.querySelector('#selectButtonGroup');
    const addMemberButton = document.querySelector('#addMemeberButtonGroup');
    const deleteMemberButton = document.querySelector('#DeleteMemberButtonGroup');
    const contactsWrapper = document.querySelector('#contactsWrapper');
    
    
    let isSelected = false;
    

    // Retrieve group ID from the data attribute
    const groupContainer = document.querySelector('.profile-container');
    const groupId = groupContainer.getAttribute('data-group-id');
    const memberId = groupContainer.getAttribute('data-contact-id');

   
// Function to show/hide buttons and contacts on select click
function selectClick() {
    isSelected = !isSelected;  // Toggle the state
    
    // Show or hide the contacts based on the button click
    if (isSelected) {
        contactsWrapper.style.display = 'block';  // Show contacts
        const checkboxes = document.querySelectorAll('.select-checkbox'); // Select all checkboxes
        checkboxes.forEach(function (checkbox) {
            checkbox.style.display = 'inline-block';  // Show all checkboxes
        });
        selectButton.textContent = "Deselect Member";  // Change button text
    } else {
        contactsWrapper.style.display = 'none';  // Hide contacts
        selectButton.textContent = "Select Member";  // Reset button text
        const checkboxes = document.querySelectorAll('.select-checkbox'); // Select all checkboxes
        checkboxes.forEach(function (checkbox) {
            checkbox.style.display = 'none';  // Hide all checkboxes
        });
    }

    // Show the add and delete buttons, and hide select button
    if (addMemberButton.style.display === 'none' && deleteMemberButton.style.display === 'none') {
        addMemberButton.style.display = 'block';
        deleteMemberButton.style.display = 'block';
        selectButton.style.display = 'none';
    }
}


// Attach event listener to select button once when DOM is loaded
if (selectButton) {
    selectButton.addEventListener("click", selectClick);
}

function deleteselectedMember(groupId) {
    const selectedContacts = [];
    
    // Get selected contacts (those with checked checkboxes)
    document.querySelectorAll('.select-contact-checkbox:checked').forEach(checkbox => {
        selectedContacts.push(checkbox.getAttribute('data-contact-id'));
    });

    if (selectedContacts.length > 0) {
        fetch(`/group/${groupId}/remove/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ contacts: selectedContacts })  // Send selected contacts in JSON format
        })
        
        .then(response => response.json())  // Expect JSON response
        .then(data => {
            if (data.success) {
                // Remove the members from the UI after successful deletion
                selectedContacts.forEach(contactId => {
                    document.querySelector(`[data-contact-id="${contactId}"]`).remove(); 
                });
                 alert("Contacts deleted successfully");
            } else {
                alert("Failed to delete contacts: " + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert("No contacts selected to delete.");
    }
}

// Event listener for deleting members
if (deleteMemberButton) {
    deleteMemberButton.addEventListener("click", function () {
        const groupId = document.querySelector('.profile-container').getAttribute('data-group-id');
        deleteselectedMember(groupId);
    });

}


function addSelectedMembers() {
    const selectedContacts = [];

    // Get the contacts that are checked (those to be added)
    document.querySelectorAll('.select-contact-checkbox:checked').forEach(checkbox => {
        selectedContacts.push(checkbox.getAttribute('data-contact-id'));
    });

    // If there are selected contacts
    if (selectedContacts.length > 0) {
        fetch(`/group/${groupId}/add/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ contacts: selectedContacts })  // Send selected contacts in JSON format
        })
        .then(response => response.json())  // Expect JSON response
        .then(data => {
            if (data.success) {
                alert(data.message);  // Success message from backend
                // Optionally, update the UI to reflect the changes (add the contacts to the UI)
                selectedContacts.forEach(contactId => {
                    // For example, remove the added member's checkbox or mark it as added
                    document.querySelector(`[data-contact-id="${contactId}"]`).remove();
                });
            } else {
                alert(data.error);  // Error message from backend
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Errore durante l'aggiunta dei membri");
        });
    } else {
        alert("Nessun membro selezionato per l'aggiunta.");
    }
}

// Attach event listener to the 'Add Members' button
if (addMemberButton) {
    addMemberButton.addEventListener("click", addSelectedMembers);
    
}
});