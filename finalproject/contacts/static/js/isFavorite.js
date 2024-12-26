
function toggleFavoriteContact(button, contactId) {
    global = true;// Prevent toggling contact details

    const img = button.querySelector("img");
    const whiteSrc = img.getAttribute("data-white-src");
    const redSrc = img.getAttribute("data-red-src");

    const isFavorite = img.src.endsWith("whiteFavorite.png");
    
    img.src = isFavorite ? redSrc : whiteSrc;

    fetch(`/toggle_favorite_contacts/${contactId}/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({ is_favorite: isFavorite })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 
        if (data.success) {
            console.log("Favorite status updated successfully");
        } else {
            alert("Failed to update favorite status.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert('An error occurred while updating the favorite status.');
    })
    .finally(() => {
        global = false;
    });
}



function toggleFavoriteGroup(button, groupId) {
    groupglobal = true;

    const img = button.querySelector("img");
    const whiteSrc = img.getAttribute("data-white-src");
    const redSrc = img.getAttribute("data-red-src");

    const currentSrc = img.src.split('/').pop(); 
    const isFavorite = currentSrc === "whiteFavorite.png";

    img.src = isFavorite ? redSrc : whiteSrc;

    fetch(`/toggle_favorite_groups/${groupId}/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({ is_favorite: isFavorite })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data.success) {
            alert("Failed to update favorite status.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert('An error occurred while updating the favorite status.');
    })
    .finally(() => {
        groupglobal = false;
    });

} 

