document.addEventListener("DOMContentLoaded", function () {
    const editButtonGroup = document.querySelector('#editButtonGroup');
    const saveButtonGroup = document.querySelector('#saveButtonGroup');
    const groupInfo = document.querySelector('.group-info');
    const favorite = document.querySelector('#FavoriteButtonGroup');
    const profilePicture = document.querySelector(".profile-picture-group-list");
    const nameContainer = document.querySelector(".group-name-container");
    const admin = document.querySelector('.name-row');
    const selectButton = document.querySelector('#selectButtonGroup');
    const addMemberButton = document.querySelector('#addMemeberButtonGroup');
    const deleteMemberButton = document.querySelector('#DeleteMemberButtonGroup');
    const contactsWrapper = document.querySelector('#contactsWrapper');
    const meeting = document.querySelector('.Meeting-row')

    
    const groupContainer = document.querySelector('.profile-container');
    const groupId = groupContainer.getAttribute('data-group-id');
    const memberId = groupContainer.getAttribute('data-contact-id');

   
    // Enable edit mode
    function enableEditMode() {
        selectButton.style.display = 'block';
        if (addMemberButton.style.display === 'block' && deleteMemberButton.style.display === 'block') {
            selectButton.style.display = 'none'; 
        } 
        meeting.style.display = 'none'
        nameContainer.style.display = 'block';  
        favorite.disabled = true;
        favorite.style.display = 'none';
        admin.disabled = true;
        admin.style.display = 'none';
        profilePicture.style.display = 'none';  
        saveButtonGroup.disabled = false;
        groupInfo.classList.add("edit-mode");
        enableTextAreas();
    }

    
    function enableTextAreas() {
        document.querySelectorAll('.group-info textarea[readonly]').forEach(textarea => {
            textarea.removeAttribute('readonly'); // Remove readonly to allow editing
        });
    }

   
    editButtonGroup.addEventListener("click", enableEditMode);
    saveButtonGroup.addEventListener("click", saveData);

    function saveData() {
        const groupName = document.querySelector("#group-name").value;
        const description = document.querySelector("#description").value;
        const pinnedMessage = document.querySelector("#pinned-message").value;

        
        const data = {
            'name': groupName,
            'description': description,
            'pinned_message': pinnedMessage,
        };


        fetch(`/group/${groupId}/edit_group/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                disableEditMode();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


    function disableEditMode() {
        favorite.disabled = false;
        favorite.style.display = 'block';
        profilePicture.style.display = 'block';
        nameContainer.style.display = 'none';  
        admin.disabled = false;
        admin.style.display = 'block';
        saveButtonGroup.disabled = true;
        groupInfo.classList.remove("edit-mode");
        disableTextAreas();
        location.reload();
    }

    function disableTextAreas() {
        document.querySelectorAll('.group-info textarea').forEach(textarea => {
            textarea.setAttribute('readonly', 'true'); 
        });
    }

    document.querySelectorAll(".Meeting-row button").forEach(button => {
        button.addEventListener("click", function () {
            let meetingType = button.id === 'meetingGoogle' ? 'google meet' : 'zoom';
    
            fetch(`/send-fake-link/${groupId}/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({ type: meetingType })
            })
            .then(response => {
                // Check if the response is JSON
                if (response.ok && response.headers.get("Content-Type").includes("application/json")) {
                    return response.json(); // Parse JSON if valid
                } else {
                    return Promise.reject('Invalid JSON response');
                }
            })
            .then(data => {
                if (data.success) {
                    console.log(data.message); // Success message
                } else {
                    console.error(data.error); // Error message
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
    
});
