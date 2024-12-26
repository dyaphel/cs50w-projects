document.addEventListener("DOMContentLoaded", function () {
    const selectButton = document.querySelector('#selectButtonGroup');
    const addMemberButton = document.querySelector('#addMemeberButtonGroup');
    const deleteMemberButton = document.querySelector('#DeleteMemberButtonGroup');
    const contactsWrapper = document.querySelector('#contactsWrapper');
    
    let isSelected = false;
    
    
    const groupContainer = document.querySelector('.profile-container');
    const groupId = groupContainer.getAttribute('data-group-id');

 
    function selectClick() {
        isSelected = !isSelected; 
        
        if (isSelected) {
            contactsWrapper.style.display = 'block';  
            const checkboxes = document.querySelectorAll('.select-checkbox'); 
            checkboxes.forEach(function (checkbox) {
                checkbox.style.display = 'inline-block';  
            });
        } else {
            contactsWrapper.style.display = 'none';  
            selectButton.textContent = "Select Member";  
            const checkboxes = document.querySelectorAll('.select-checkbox'); 
            checkboxes.forEach(function (checkbox) {
                checkbox.style.display = 'none';  
            });
        }

        if (addMemberButton.style.display === 'none' && deleteMemberButton.style.display === 'none') {
            addMemberButton.style.display = 'block';
            deleteMemberButton.style.display = 'block';
            selectButton.style.display = 'none';
        }
        
    }

    
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
                    // Update the member list
                    selectedContacts.forEach(contactId => {
                        const contactElement = document.querySelector(`[data-contact-id="${contactId}"]`);
                        contactElement.remove();  // Remove the contact from the available contacts list
                        addContactToMembers(contactElement);  // Add the contact to the member list
                    });
                    clearCheckboxes(); 
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

    if (addMemberButton) {
        addMemberButton.addEventListener("click", addSelectedMembers);
    }

    if (deleteMemberButton) {
        deleteMemberButton.addEventListener("click", deleteSelectedMembers);
    }

        // Function to handle adding a contact to the members list
    function addContactToMembers(contactElement) {
        const contactsList = document.querySelector('.members'); 
        contactsList.appendChild(contactElement); 
    }
    
        // Function to add a contact to the contacts list
    function addContactToContacts(contactElement) {
        const contactsList = document.querySelector('.contacts-wrapper'); 
        contactsList.appendChild(contactElement);  
    }
});
