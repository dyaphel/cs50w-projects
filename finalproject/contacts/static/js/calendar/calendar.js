document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Monthly view
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'en', // Set your desired locale, e.g., 'en' for English
        views: {
            timeGridWeek: {
                dayHeaderFormat: { weekday: 'short', day: '2-digit', month: 'short' } // Custom format
            }
        },
        events: '/api/calendar-events/' // Fetch events from your Django API
    });

    calendar.render();
});
