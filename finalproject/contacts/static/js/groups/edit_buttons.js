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


    // Function to show/hide buttons and contacts on select click
    function selectClick() {
        isSelected = !isSelected; 
        
        // Show or hide the contacts based on the button click
        if (isSelected) {
            contactsWrapper.style.display = 'block';  // Show contacts
            const checkboxes = document.querySelectorAll('.select-checkbox'); // Select all checkboxes
            checkboxes.forEach(function (checkbox) {
                checkbox.style.display = 'inline-block';  // Show all checkboxes
            });
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



    // Function to clear checkboxes
    function clearCheckboxes() {
        document.querySelectorAll('.select-contact-checkbox').forEach(checkbox => {
            checkbox.checked = false;  // Uncheck the checkbox
        });
    }


    // Function to add selected members
    function addSelectedMembers() {
        const selectedContacts = [];

        // Retrieve selected contacts
        document.querySelectorAll('.select-contact-checkbox:checked').forEach(checkbox => {
            selectedContacts.push(checkbox.getAttribute('data-contact-id'));
        });

        if (selectedContacts.length > 0) {
            fetch(`/group/${groupId}/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({ contacts: selectedContacts })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Contacts added successfully');
                    // Update the member list (add the new member)
                    selectedContacts.forEach(contactId => {
                        const contactElement = document.querySelector(`[data-contact-id="${contactId}"]`);
                        contactElement.remove();  // Remove the contact from the available contacts list
                        addContactToMembers(contactElement);  // Add the contact to the member list
                    });
                    clearCheckboxes();  // Clear all checkboxes
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding contacts');
            });
        } else {
            alert('No member selected to add.');
        }
    }



    // Function to delete selected members
    function deleteSelectedMembers() {
        const selectedContacts = [];
        
        // Retrieve selected contacts for deletion
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
                body: JSON.stringify({ contacts: selectedContacts })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Contacts deleted successfully');
                    // Remove selected members from the members list
                    selectedContacts.forEach(contactId => {
                        const contactElement = document.querySelector(`[data-contact-id="${contactId}"]`);
                        contactElement.remove();  // Remove contact from the member list
                        addContactToContacts(contactElement);  // Add back to the available contacts list
                    });
                    clearCheckboxes(); 
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting contacts');
            });
        } else {
            alert('No contacts selected to delete.');
        }
    }

    // Attach event listeners for add and delete member buttons
    if (addMemberButton) {
        addMemberButton.addEventListener("click", addSelectedMembers);
    }

    if (deleteMemberButton) {
        deleteMemberButton.addEventListener("click", deleteSelectedMembers);
    }

        // Function to handle adding a contact to the members list
    function addContactToMembers(contactElement) {
        const contactsList = document.querySelector('.members');  // Available contacts
        contactsList.appendChild(contactElement);  
    }
    
        // Function to add a contact to the contacts list
    function addContactToContacts(contactElement) {
        const contactsList = document.querySelector('.contacts-wrapper');  // Available contacts
        contactsList.appendChild(contactElement);  // Add the contact back to the list
    }

});
