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
            const currentDateTime = new Date(); 
            const clickedDate = new Date(info.dateStr);
            console.log('Date clicked:', info.dateStr);
            if (clickedDate < currentDateTime.setHours(0, 0, 0, 0)) {
                alert("You cannot add events in the past!");
                return; // Stop the form from opening
            }
            // Open modal for adding an event
            showEventForm(info.dateStr);
        },
        eventClassNames: function (arg) {
            const currentDate = new Date();
            const eventDate = new Date(arg.event.start);

            // Compare event date with current date
            if (eventDate < currentDate) {
                return ['fc-event-past']; // Apply the past event class
            }
            return []; // No extra class for future or current events
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
                            
                            <label for="event-time">Time:</label>
                            <div style="display: flex; align-items: center;">
                                <input type="number" id="event-hour" name="hour" min="1" max="12" required placeholder="HH">
                                
                                <input type="number" id="event-minute" name="minute" min="0" max="59" required placeholder="MM">
                                <select id="event-period" name="period">
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
                const contact = document.getElementById('event-contact').value;
                const group = document.getElementById('event-group').value;

                if (isNaN(hour) || isNaN(minute) || hour < 1 || hour > 12 || minute < 0 || minute > 59) {
                    alert("Invalid time input!");
                    return;
                }

                // Convert to 24-hour format
                let adjustedHour = hour;
                if (period === 'PM' && hour < 12) adjustedHour += 12;
                if (period === 'AM' && hour === 12) adjustedHour = 0;

                // Combine date and time
                const startDateTime = new Date(`${date}T${String(adjustedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
                const currentDateTime = new Date();

                // Validate against the current date and time
                if (startDateTime < currentDateTime) {
                    alert("You cannot add an event in the past!");
                    return; // Stop submission
                }

                fetch('/api/add-event/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    },
                    body: JSON.stringify({ title, start: startDateTime.toISOString(), contact, group })
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
            });
        }).catch(error => console.error('Error fetching contacts or groups:', error));
    }

});
