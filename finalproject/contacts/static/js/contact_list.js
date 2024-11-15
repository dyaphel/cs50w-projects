let global = false

function toggleContactDetails(element) {
    // Toggle the expanded class on the profile footer
    const footer = element;
    const details = footer.querySelector('.contact-details');

    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block"; // Show the contact details
        footer.classList.add('expanded'); // Expand the footer
    } else {
        details.style.display = "none"; // Hide the contact details
        footer.classList.remove('expanded'); // Collapse the footer
    }
}

function openContactDetails(contactId) {
    if (global) return; 
    window.location.href = `/contact/${contactId}/`; // Assumes URL pattern is '/contact/<id>/'
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

function deleteSelectedContacts() {
    // Mostra la finestra di conferma
    document.getElementById('confirmModal').style.display = 'block';
}

function confirmDelete() {
    // Esegue l'eliminazione dei contatti selezionati
    const selectedContacts = [];
    document.querySelectorAll('.checkbox:checked').forEach(checkbox => {
        selectedContacts.push(checkbox.getAttribute('data-contact-id'));
    });
    if (selectedContacts.length > 0) {
        fetch("{% url 'delete_contacts' %}", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ contacts: selectedContacts })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error("Failed to delete contacts:", data.error);
                alert("Failed to delete contacts: " + data.error);
            } else {
                window.location.reload();
                console.log("Contacts deleted successfully");
            }
        })
        .catch(error => console.error("Error:", error));
    }

    // Nasconde la finestra di conferma
    document.getElementById('confirmModal').style.display = 'none';
}

function cancelDelete() {
    // Nasconde la finestra di conferma e resetta i checkbox
    document.getElementById('confirmModal').style.display = 'none';
    toggleCheckboxes(); // Nasconde e deseleziona i checkbox
}


    


