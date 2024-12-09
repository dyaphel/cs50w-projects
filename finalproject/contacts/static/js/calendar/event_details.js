document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.getElementById("deleteButtonGroup");
    deleteButton.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this event?")) {
            
            const eventTitle = document.getElementById("eventTitle");
            const eventStartTime = document.getElementById("eventStartTime");

            
            if (!eventTitle || !eventStartTime) {
                console.error("Event title or start time elements not found!");
                return;
            }

            const title = eventTitle.textContent.trim();  
            const startTime = eventStartTime.textContent.trim();

            //console.log('Event Title:', title); 
            //console.log('Event Start Time:', startTime);  

            // URL for deletion request
            const url = `/events/delete/${encodeURIComponent(title)}/${encodeURIComponent(startTime)}/`;
            const calendarUrl = document.getElementById("calendar-url").getAttribute("data-url");
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
