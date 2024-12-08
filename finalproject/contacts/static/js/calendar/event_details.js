document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.getElementById("deleteButtonGroup");

    // Make sure the deleteButton exists on the page
    if (!deleteButton) {
        console.error("Delete button not found!");
        return;
    }

    deleteButton.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this event?")) {
            // Safely insert the event title and formatted starttime into JavaScript
            const eventTitle = document.getElementById("eventTitle");
            const eventStartTime = document.getElementById("eventStartTime");

            // Check if the elements exist
            if (!eventTitle || !eventStartTime) {
                console.error("Event title or start time elements not found!");
                return;
            }

            const title = eventTitle.textContent.trim();  // Get event title from DOM
            const startTime = eventStartTime.textContent.trim();  // Get event start time from DOM

            console.log('Event Title:', title);  // Check if the title is correctly passed
            console.log('Event Start Time:', startTime);  // Check if the start time is correctly passed

            // URL for deletion request
            const url = `/events/delete/${encodeURIComponent(title)}/${encodeURIComponent(startTime)}/`;
            const calendarUrl = document.getElementById("calendar-url").getAttribute("data-url");
           

            // Create the fetch request to delete the event
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({
                    title: title,
                    starttime: startTime,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Event deleted successfully!");
                    window.location.href = calendarUrl;
                } else {
                    alert("Error deleting event: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            });
        }
    });
});
