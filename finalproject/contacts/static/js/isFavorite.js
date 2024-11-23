
function toggleFavorite(button, contactId) {
    global = true; // Prevent toggling contact details

    const img = button.querySelector("img");
    const whiteSrc = img.getAttribute("data-white-src");
    const redSrc = img.getAttribute("data-red-src");

    const isFavorite = img.src.endsWith("whiteFavorite.png");
    
    img.src = isFavorite ? redSrc : whiteSrc;

    fetch(`/toggle_favorite/${contactId}/`, {
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
        return response.json();  // Convert response to JSON
    })
    .then(data => {
        console.log(data);  // Log data to verify the JSON structure
        if (data.success) {
            console.log("Favorite status updated successfully");
        } else {
            alert("Failed to update favorite status.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert('An error occurred while updating the favorite status.');
    });
}

function toggleFavoriteGroup(button, groupId) {
    console.log(`Toggle called for Group ID: ${groupId}`); // Debugging log

    const img = button.querySelector("img");
    const whiteSrc = img.getAttribute("data-white-src");
    const redSrc = img.getAttribute("data-red-src");

    const isFavorite = img.src.endsWith("whiteFavorite.png");

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
        console.log(data);
        if (!data.success) {
            alert("Failed to update favorite status.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert('An error occurred while updating the favorite status.');
    });
}
