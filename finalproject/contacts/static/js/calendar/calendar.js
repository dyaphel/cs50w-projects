document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded");

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'en',
        events: '/api/calendar-events/', // Fetch events from Django API
        eventTimeFormat: { // Customize how time is displayed
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short' // Display AM/PM
        },
        dateClick: function (info) {
            const currentDateTime = new Date();
            const clickedDate = new Date(info.dateStr);
            console.log('Date clicked:', info.dateStr);

            // Prevent adding events in the past
            if (clickedDate < currentDateTime.setHours(0, 0, 0, 0)) {
                alert("You cannot add events in the past!");
                return; // Stop the form from opening
            }

            // Open modal for adding an event
            showEventForm(info.dateStr);
        },
        eventClick: function(info) {
            const eventTitle = info.event.title;  // Get event title
            const eventStart = info.event.start.toISOString();  // Get event start time as an ISO string
            
            console.log('Event clicked:', eventTitle, eventStart);
            
            // Redirect to the event details page using title and formatted start time
            window.location.href = `/event-details/${encodeURIComponent(eventTitle)}/${encodeURIComponent(eventStart)}/`;
        },
        
        eventClassNames: function (arg) {
            const currentDate = new Date();
            const eventDate = new Date(arg.event.start);

            // Add class for past events
            if (eventDate < currentDate) {
                return ['fc-event-past'];
            }
            return [];
        }
    });

    calendar.render();

    function showEventForm(date) {
        console.log('Opening modal for:', date);
        const existingModal = document.getElementById('event-modal');
        if (existingModal) existingModal.remove();

        // Fetch contacts and groups via API calls
        Promise.all([
            fetch('/api/contacts/').then(response => response.json()),
            fetch('/api/groups/').then(response => response.json())
        ]).then(([contacts, groups]) => {
            const contactsOptions = contacts.map(contact =>
                `<option value="${contact.id}">${contact.name}</option>`
            ).join('');

            const groupsOptions = groups.map(group =>
                `<option value="${group.id}">${group.name}</option>`
            ).join('');

            // Create modal HTML
            const modalHTML = `
                <div id="event-modal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>Add Event</h2>
                        <form id="event-form">
                            <label for="event-title">Title:</label>
                            <input type="text" id="event-title" name="title" required>

                            <label for="event-time">Start Time:</label>
                            <div style="display: flex; align-items: center;">
                                <input type="number" id="event-hour" name="hour" min="1" max="12" required placeholder="HH">
                                <input type="number" id="event-minute" name="minute" min="0" max="59" required placeholder="MM">
                                <select id="event-period" name="period">
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>

                            <label for="event-end-hour">End Time:</label>
                            <div style="display: flex; align-items: center;">
                                <input type="number" id="event-end-hour" name="end_hour" min="1" max="12" required placeholder="HH">
                                <input type="number" id="event-end-minute" name="end_minute" min="0" max="59" required placeholder="MM">
                                <select id="event-end-period" name="end_period">
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>

                            <label for="event-contact">Contact:</label>
                            <select id="event-contact" name="contact">
                                <option value="">None</option>
                                ${contactsOptions}
                            </select>

                            <label for="event-group">Group:</label>
                            <select id="event-group" name="group">
                                <option value="">None</option>
                                ${groupsOptions}
                            </select>

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

            // Handle form submission
            document.getElementById('event-form').addEventListener('submit', function (e) {
                e.preventDefault();

                const title = document.getElementById('event-title').value;
                const hour = parseInt(document.getElementById('event-hour').value, 10);
                const minute = parseInt(document.getElementById('event-minute').value, 10);
                const period = document.getElementById('event-period').value;
                const endHour = parseInt(document.getElementById('event-end-hour').value, 10);
                const endMinute = parseInt(document.getElementById('event-end-minute').value, 10);
                const endPeriod = document.getElementById('event-end-period').value;
                const contact = document.getElementById('event-contact').value;
                const group = document.getElementById('event-group').value;

                // Validate time input
                if (isNaN(hour) || isNaN(minute) || isNaN(endHour) || isNaN(endMinute) || hour < 1 || hour > 12 || minute < 0 || minute > 59 || endHour < 1 || endHour > 12 || endMinute < 0 || endMinute > 59) {
                    alert("Invalid time input!");
                    return;
                }

                // Convert to 24-hour format for start time
                let adjustedHour = hour;
                if (period === 'PM' && hour < 12) adjustedHour += 12;
                if (period === 'AM' && hour === 12) adjustedHour = 0;

                // Convert to 24-hour format for end time
                let adjustedEndHour = endHour;
                if (endPeriod === 'PM' && endHour < 12) adjustedEndHour += 12;
                if (endPeriod === 'AM' && endHour === 12) adjustedEndHour = 0;

                // Combine date and time for start and end times
                const startDateTime = new Date(`${date}T${String(adjustedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
                const endDateTime = new Date(`${date}T${String(adjustedEndHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`);
                const currentDateTime = new Date();

                // Validate against the current date and time
                if (startDateTime < currentDateTime) {
                    alert("You cannot add an event in the past!");
                    return;
                }

                // Check for event conflicts at the same time
                fetch('/api/event-conflict/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    },
                    body: JSON.stringify({ date: startDateTime.toISOString() })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.conflict) {
                        alert('An event already exists at this time. Please select a different time.');
                    } else {
                        // Add the event
                        fetch('/api/add-event/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                            },
                            body: JSON.stringify(
                                { title, 
                                    start: startDateTime.toISOString(),
                                    end: endDateTime.toISOString(),
                                    contact,
                                    group })
                        })
                        .then(response => {
                            if (!response.ok) throw new Error(response.statusText);
                            return response.json();
                        })
                        .then(data => {
                            if (data.success) {
                                alert('Event added successfully!');
                                modal.remove();
                                calendar.refetchEvents(); // Refresh the calendar
                            } else {
                                alert(`Error adding event: ${data.error}`);
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    }
                })
                .catch(error => console.error('Error checking event conflict:', error));
            });
        }).catch(error => console.error('Error fetching contacts or groups:', error));
    }
});
