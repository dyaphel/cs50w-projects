# Contacts and Calendar Management App

## Main Purpose of the App

The **Contacts and Calendar Management App** is designed to streamline how users manage their contacts, groups, and personal calendars. The app brings together essential tools for organizing contact information, scheduling meetings, and staying connected with groups and individuals. Key features include:

- **User Profile Management**: Edit and manage user details.
- **Contacts Management**: Add, organize, and manage contacts, mark favorites.
- **Groups Management**: Create and manage groups of contacts, allowing easier collaboration.
- **Personal Calendar**: Organize, schedule, and manage meetings and events with contacts and groups.
- **Third-party Integrations**: Make calls via **Microsoft Teams** and schedule meetings through **Zoom** (under development).

This app is ideal for users who need a central platform to keep track of their contacts, meetings, and communication with colleagues, friends, and clients.

---

## Project Structure

### Key Features

#### 1. **User Profile Management**
   - Users can view and edit their profile information, which includes:
     - **Name**
     - **Surname**
     - **Email**
     - **Job Position**
     - **Company**
     - **Phone Numbers** (primary and secondary)
   - All profile information is stored securely in the database and is displayed on the user’s profile page.
   - Users can easily update their details and have the changes reflected in real-time.

#### 2. **Contacts Management**
   - The app allows users to:
     - **Add** new contacts with details such as name, email, phone number, and address.
     - **Edit** contact details at any time.
     - **Delete** contacts that are no longer needed.
     - **View** contact details, including full information about each person.
     - **Favorite** important contacts for easy access. These contacts will appear in the dedicated **Favorites List**.
     - **Organize contacts into groups** for better management, and easily view all members of a group.

#### 3. **Groups Management**
   - Users can create and manage groups of contacts. Each group can have:
     - **Group Name** and **Description**.
     - **Group Members**: Add or remove contacts from the group, ensuring dynamic membership management.
     - **Favorites**: Mark group members as favorites, which will also appear in the **Favorites List**.
   - Users can edit group details, view all group members, and manage memberships (add/remove) at any time.

#### 4. **Calendar and Meetings**
   - The app includes an integrated **Personal Calendar** where users can:
     - **Create Events** for one or multiple contacts/groups.
     - **View Events**: See upcoming meetings and events in a daily/weekly/monthly view.
     - **Edit Events**: Change event details such as date, time, participants, and location.
     - **Delete Events**: Remove events from the calendar.
   - Events are stored in the database and users can interact with them through the calendar interface.
   - Events can be scheduled for contacts or entire groups, making it easier to coordinate meetings with multiple people.

#### 5. **Third-party Integrations**
   - **Microsoft Teams**:
     - The app supports initiating calls through **Microsoft Teams**. Users can click a button to start a call with any contact via Microsoft Teams.
     - This feature requires users to set up **API credentials** for Microsoft Teams, and the integration is in the **testing phase**. Some setup may be required to make it work properly.
   - **Zoom**:
     - The app allows users to generate **Zoom meeting links** for scheduled events, so users can easily create video calls for meetings.
     - The Zoom integration is still under development, and some features may not be fully functional yet. The Zoom meeting links are generated but require additional API setup to fully integrate.

#### 6. **Favorites**
   - Users can mark both **individual contacts** and **group members** as **Favorites**. This makes it easier to find and contact these individuals quickly. The **Favorites List** shows the most important contacts, making them easily accessible from the main interface.
   
   **Favorites can be:**
   - **Contacts**: Individually marked as favorites for quick access.
   - **Group Members**: Group members can also be marked as favorites and will appear in the Favorites List.

---

## How It Works

The app is built with **Django** as the backend framework, following the **Model-View-Controller (MVC)** architecture. Here's how the main components work together:

### 1. **User Authentication**
   - Users need to **log in** to access their profile, contacts, groups, and calendar. Django's built-in authentication system handles user login, registration, and session management.
   - Once logged in, users are redirected to their dashboard, where they can interact with their profile, contacts, and calendar.

### 2. **Profile Management**
   - The profile page displays all user information.
   - Users can **edit** their profile details using a form and save the changes to the database. When the changes are saved, the new information is immediately displayed in the UI.

### 3. **Contacts and Groups Management**
   - Users can add, edit, and delete contacts via forms on the contacts page.
   - Contacts can be added to **groups** for better organization. Users can edit group memberships, add/remove contacts, and view group member details.
   - The **Favorites List** allows users to quickly access their favorite contacts or group members.

### 4. **Calendar and Meetings**
   - The calendar page allows users to create, view, edit, and delete events.
   - When creating an event, users specify the **date**, **time**, and **participants** (contacts or groups).
   - Events are stored in the database, and users can see upcoming events in their calendar.
   - The calendar uses Django templates and JavaScript to provide an interactive interface for scheduling and managing meetings.

### 5. **Third-party Services**
   - **Microsoft Teams**: Users can initiate calls directly with contacts. The integration requires **API keys** and is currently in the testing phase. Once the integration is fully functional, users will be able to make calls directly from the app.
   - **Zoom**: Users can generate Zoom meeting links to schedule events. This integration is still under development and is not fully functional. Future updates will allow users to generate Zoom links for meetings with just one click.

---

## Limitations

While the app offers many features, there are some limitations and known issues:

1. **Zoom Integration**:  
   - The Zoom integration for generating meeting links is currently incomplete. Users can generate links, but the full functionality (such as automatic meeting creation and user invitations) has not yet been implemented.

2. **Microsoft Teams Integration**:  
   - The Microsoft Teams call feature requires additional configuration and API setup to work fully. Currently, this feature is in the testing phase and may require adjustments to API keys.

3. **Google Integration**:  
   - The Google button functionality, which would allow syncing contacts and events with Google services, is not currently working. This feature is under investigation and may be reintroduced once debugging is complete.

---

## Future Work

The following features and improvements are planned for future versions of the app:

- **Complete Zoom Integration**:  
   - Finalize the Zoom API integration, ensuring users can generate meeting links and manage meetings directly from the app.
  
- **Google Integration**:  
   - Investigate and fix the issue with Google contact and calendar synchronization, allowing users to sync their data between the app and Google services.

- **User Interface Improvements**:  
   - Enhance the design of forms, buttons, and input fields for a smoother, more user-friendly experience.
   - Improve the calendar UI to make scheduling and managing events even more intuitive.

- **Notification System**:  
   - Implement a notification system to remind users about upcoming events and meetings. Notifications can be delivered via email or in-app alerts.

- **Testing and Debugging**:  
   - Conduct more extensive testing to ensure all features, especially third-party integrations (Zoom and Microsoft Teams), work reliably.

---

## Calendar Setup

The calendar is a core feature of this app, allowing users to schedule, manage, and view events. Here’s how it works:

1. **Event Creation**:
   - Users can create events by specifying:
     - **Date and Time** of the event.
     - **Participants** (can be individual contacts or groups).
   
2. **Event Management**:
   - Once created, events can be:
     - **Edited**: Change the date, time, participants, and other details.
     - **Deleted**: Remove events from the calendar if they are no longer needed.

3. **Notifications**:
   - Although notifications are not fully implemented, the plan is to notify users about upcoming events in future versions of the app, using email or push notifications.

The calendar uses Django’s built-in models to store event data and JavaScript for front-end interactivity, ensuring a responsive and user-friendly interface.

---

## Conclusion

This app provides a complete solution for managing contacts, groups, and calendars, all in one platform. While some integrations (such as Zoom and Microsoft Teams) are still under development, the app’s core features—contact management, groups, and calendar—are fully functional. The app is designed to help users stay organized and connected with their professional and personal networks, making it easier to schedule meetings and keep track of important events.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
