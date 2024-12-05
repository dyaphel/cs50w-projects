document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM load");
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'en',
        events: '/api/calendar-events/', // Fetch events from Django API
        dateClick: function (info) {
            console.log('Date clicked:', info.dateStr);
            // Open modal for adding an event
            showEventForm(info.dateStr);
        },
    });

    calendar.render();

    // Function to show the event form
    function showEventForm(date) {
        console.log('Opening modal for:', date);
        // Check if a modal exists and remove it
        const existingModal = document.getElementById('event-modal');
        if (existingModal) existingModal.remove();

        // Create and insert modal HTML
        const modalHTML = `
            <div id="event-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Add Event</h2>
                    <form id="event-form">
                        <label for="event-title">Title:</label>
                        <input type="text" id="event-title" name="title" required>
                        <label for="event-time">Time:</label>
                        <input type="time" id="event-time" name="time" required>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('event-modal');
        modal.style.display = 'block';

        // Close modal functionality
        modal.querySelector('.close').addEventListener('click', () => modal.remove());

        // Submit the form
        document.getElementById('event-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const title = document.getElementById('event-title').value;
            const time = document.getElementById('event-time').value;

            // Combine date and time
            const startDateTime = `${date}T${time}:00`;
            fetch('/api/add-event/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({ title, start: startDateTime })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Event added successfully!');
                    modal.remove();
                    calendar.refetchEvents(); // Refresh the calendar to include the new event
                } else {
                    alert(`Error adding event: ${data.error}`);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    } 
});
