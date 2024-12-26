# Contacts Management App

## Main Purpose of the App

The **Contacts Management App** is designed to enable users to manage their contacts, groups, and personal calendars through their computer instead of relying on a phone. The app brings together essential tools for organizing contact information, calls, messages, and scheduling meetings (meetings functionality is not implemented due to the usage criteria of Google and Zoom APIs). Key features include:

- **User Profile Management**: Edit and manage user details.
- **Contacts Management**: Add, organize, and manage contacts; mark favorites.
- **Groups Management**: Create and manage groups of contacts for easier collaboration and organization.
- **Personal Calendar**: Organize, schedule, and manage meetings and events with contacts and/or groups through **npm FullCalendar**.
- **Make Calls** via **Microsoft Phone Link** and schedule meetings through **Google Meet** or **Zoom**.

---

## Key Features

### 1. **User Profile Management**
   - Users can view and edit their profile information, which includes:
     - **Name**
     - **Surname**
     - **Email**
     - **Job Position**
     - **Company**
     - **Phone Numbers** (primary and secondary)
   - All profile information is securely stored in the database and displayed on the user’s profile page.
   - Users can easily update their details, with changes reflected in real time.

### 2. **Contacts Management**
   - The app allows users to:
     - **Add** new contacts with details such as name, email, phone number, and address.
     - **Edit** contact details at any time.
     - **Delete** contacts that are no longer needed.
     - **View** contact details, including full information about each person.
     - **Favorite** important contacts for easy access. These contacts will appear in the dedicated **Favorites List**.
     - **Organize contacts into groups** for better management and easily view all group members.

### 3. **Groups Management**
   - Users can create and manage groups of contacts. Each group can have:
     - **Group Name** and **Description**
     - **Group Members**: Add or remove contacts from the group, ensuring dynamic membership management.
     - **Favorites**: Mark group members as favorites, which will also appear in the **Favorites List**.
   - Users can edit group details, view all group members, and manage memberships (add/remove) at any time.

### 4. **Calendar and Meetings**
   - The app includes an integrated **Personal Calendar** where users can:
     - **Create Events** for one or multiple contacts/groups.
     - **View Events**: See upcoming meetings and events in daily/weekly/monthly views.
     - **Edit Events**: Modify event details such as date, time, participants, and location.
     - **Delete Events**: Remove events from the calendar.
   - Events are stored in the database, and users can interact with them through the calendar interface.
   - Events can be scheduled for contacts or entire groups, making it easier to coordinate meetings with multiple people.

### 5. **Third-party Integrations**
   - **Microsoft Teams**:
     - The app supports initiating calls through **Microsoft Teams**. Users can click a button to start a call with any contact via Microsoft Teams.
     - This feature requires users to set up **API credentials** for Microsoft Teams. The integration is currently in the **testing phase**, and some setup may be required to ensure full functionality.
   - **Zoom**:
     - The app allows users to generate **Zoom meeting links** for scheduled events, enabling users to create video calls for meetings easily.
     - The Zoom integration is still under development, and some features may not be fully functional. Zoom meeting links are generated but require additional API setup for full integration.

### 6. **Favorites**
   - Users can mark both **individual contacts** and **group members** as **Favorites**. This feature makes it easier to find and contact these individuals quickly. The **Favorites List** shows the most important contacts, making them easily accessible from the main interface.

   **Favorites can include:**
   - **Contacts**: Individually marked as favorites for quick access.
   - **Group Members**: Group members can also be marked as favorites and will appear in the Favorites List.

---

## How It Works

The app is built with **Django** as the backend framework, following the **Model-View-Controller (MVC)** architecture. Here’s how the main components work together:

### 1. **User Authentication**
   - Users need to **log in** to access their profile, contacts, groups, and calendar. Django’s built-in authentication system handles user login, registration, and session management.
   - Once logged in, users are redirected to their dashboard, where they can interact with their profile, contacts, and calendar.

### 2. **Profile Management**
   - The profile page displays all user information.
   - Users can **edit** their profile details using a form and save changes to the database.
   - Once changes are saved, the new information is immediately displayed in the UI.
   - The profile page also includes upcoming events for the next seven days.

### 3. **Contacts and Groups Management**
   - Users can add, edit, and delete contacts via forms on the contacts page.
   - Contacts can be added to **groups** for better organization. Users can edit group memberships, add/remove contacts, and view group member details.
   - Through the contact details, users can utilize the built-in **Microsoft Phone Link** in Windows 10/11 to call or message that contact.
   - **Note**: Refer to Microsoft documentation on how to connect your phone to your computer.
   - The **Favorites List**, represented by an index/bookmark icon, allows users to quickly access their favorite contacts or group members.

### 4. **Calendar and Meetings**
   - The calendar page allows users to create, view, edit, and delete events.
   - When creating an event, users specify the **date**, **time**, and **participants** (contacts and/or groups).
   - Events are stored in the database, and users can view upcoming events in their calendar or on the profile management page.
   - The calendar uses Django templates and JavaScript to provide an interactive interface for scheduling and managing meetings.

---

## Limitations

While the app offers many features, there are some limitations and known issues:

1. **Zoom and Google Integration**:  
   - These integrations for generating meeting links are currently incomplete.
   - This decision was made due to the requirements, responsibilities, and potential costs associated with using these APIs. 

2. **Microsoft Phone Link Integration**:  
   - The Microsoft Phone Link is required to make calls and send messages. It is built into Windows 10 and 11, but alternative methods may be necessary for other operating systems.

---

## Calendar Setup

The calendar is a core feature of this app, designed to allow users to schedule, manage, and view events. Here’s how it works:

### 1. **Event Creation**
   - Users can create events by specifying:
     - **Date and Time** of the event.
     - **Participants** (individual contacts and/or groups).

### 2. **Event Management**
   - Once created, events can be:
     - **Edited**: Modify the date, time, participants, and other details.
     - **Deleted**: Remove events from the calendar if they are no longer needed.

---
# Project Structure

## Overview
This project follows a standard Django application structure with additional directories for static files and templates, the organization is:

### Static Folder
The `static` folder contains the following subdirectories:

1. **contact_style**: Contains the CSS directories for styling different parts of the application. Inside this folder:
   - **calendar**: Styles related to the calendar functionality.
   - **components**: Styles for common components like the profile picture, card styles, etc.
   - **contacts**: Styles for the contacts-related pages.
   - **group_style**: Styles for the group-related pages.
   - `favorites.css`: Styles specific to the favorites feature.
   - `style.css`: General styles applied across the application.

2. **img**: Contains various icons and images used in the application.

3. **js**: Contains JavaScript files for managing the functionality of different parts of the application. Inside this folder and files:
   - **calendar**: JavaScript for calendar-related features.
   - **contacts**: JavaScript for managing contacts.
   - **group**: JavaScript for managing groups.
   - `favorites.js`: Handles the favorites feature.
   - `isFavorite.js`: Adds functionality for marking items as favorites.

### Templates Folder
The `templates` folder mirrors the structure of the `js` folder and includes:

1. **calendar/**: folder for HTML templates for the calendar pages.
2. **contacts/**: folder containing the HTML templates for contacts-related pages.
3. **group/**: folder whit HTML templates for group-related pages.
4. **favorites/**: HTML files for favorites.
5. **standard/**: Contains templates for general functionalities:
   - `login.html`: The login page.
   - `logout.html`: The logout page.
   - `layout.html`: The base layout template used across the app.
   - `register.html`: The registration page.

---
## Distinctiveness and Complexity
This project is distinct from the previous coursework projects, 
particularly the **social network app** and the **e-commerce platform**, both in purpose and implementation.
Unlike the **e-commerce app**, which allowed users to interact with each other’s items by viewing, purchasing, or commenting, 
this Contacts Management App is strictly individualistic. 
Users cannot share or showcase their contacts, events, or groups with other users. 
Every interaction is confined to their personal database. 
Additionally, the e-commerce project utilized HTML forms and server-side rendering for editing or managing items. 
In contrast, this project leverages JavaScript for dynamic front-end management, such as editing profiles and events.
Compared to the **social network app**, while at first glance this project may seem similar, the interaction paradigm is fundamentally different. 
The social network app was designed to allow communication and engagement between users, encouraging them to connect, comment, or react to each other’s posts.
Here, however, there is no user-to-user interaction. 
Instead, users engage with their contacts, groups, and personal calendar.
Importantly, this engagement is one-directional; contacts cannot interact with the user unless they are also users themselves.
 This focus on individual organization, rather than social connectivity, establishes a unique purpose for the app.

Additionally, while this app bears some resemblance to the **Microsoft Phone Link** app due to its functionality, 
the similarity was entirely unintentional. 
During development, I only became aware of the Microsoft app while researching APIs for making phone calls.
---
## Personal Notes

This app provides a solution for managing contacts, groups, and calendars, all in one platform. 
It is designed to help users stay organized and connected with their professional and personal networks through their computer instead of relying
on a phone. This app was not designed to mimic or replicate the existing Microsoft Phone Link app. 
In fact, I was not even aware of its existence during development.
Future improvements could include fully integrating with the existing Microsoft Phone Link app to directly import contacts from the user's phone.
Another enhancement could be adding a notepad function, allowing users to take notes and attach them to a specific contact and/or group. 
Additionally, implementing a group chat feature, instead of relying solely on meetings, would be beneficial. 
Completing the necessary API integrations for scheduling and communication functionalities should also be prioritized.
Further consideration is required to determine whether to keep the app private or make it public, with necessary adjustments.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
