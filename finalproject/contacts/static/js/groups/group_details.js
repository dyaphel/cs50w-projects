document.addEventListener("DOMContentLoaded", function () {
    const editButtonGroup = document.querySelector('#editButtonGroup');
    const saveButtonGroup = document.querySelector('#saveButtonGroup');
    const groupInfo = document.querySelector('.group-info');
    const favorite = document.querySelector('#FavoriteButtonGroup');
    const profilePicture = document.querySelector(".profile-picture-group-list");
    const nameContainer = document.querySelector(".group-name-container");
    const nameInput = document.querySelector("#group-name");

    // Retrieve contact ID from the data attribute
    const groupContainer = document.querySelector('.profile-container');
    const groupId = groupContainer.getAttribute('data-group-id');

    // Enable edit mode
    function enableEditMode() {
        // Show the group name input only in edit mode
        nameContainer.style.display = 'block';  // Show name input
        favorite.disabled = true;
        favorite.style.display = 'none';
        profilePicture.style.display = 'none';  // Hide profile picture
        saveButtonGroup.disabled = false;
        groupInfo.classList.add("edit-mode");
        enableTextAreas();
    }

    // Function to enable textareas by removing the readonly attribute
    function enableTextAreas() {
        document.querySelectorAll('.group-info textarea[readonly]').forEach(textarea => {
            textarea.removeAttribute('readonly'); // Remove readonly to allow editing
        });
    }

    // Attach event listeners to edit and save buttons
    editButtonGroup.addEventListener("click", enableEditMode);
    saveButtonGroup.addEventListener("click", disableEditMode);

    // Disable edit mode and restore readonly
    function disableEditMode() {
        favorite.disabled = false;
        favorite.style.display = 'block';
        profilePicture.style.display = 'block';  // Show profile picture again
        nameContainer.style.display = 'none';  // Hide name input again

        saveButtonGroup.disabled = true;
        groupInfo.classList.remove("edit-mode");
        disableTextAreas();
    }

    // Function to restore readonly on textareas
    function disableTextAreas() {
        document.querySelectorAll('.group-info textarea').forEach(textarea => {
            textarea.setAttribute('readonly', 'true'); // Re-add readonly to prevent further edits
        });
    }
});
