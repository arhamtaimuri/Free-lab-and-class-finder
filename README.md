# RoomRadar: Campus Room Finder

RoomRadar is a web app for finding free classrooms, labs, seminar rooms, and meeting spaces across campus. Instead of checking timetables one room at a time, a user picks a day and a time slot and instantly sees which spaces are free. They can narrow the results by building, space type, and capacity, then book a room in one click. Their bookings appear on a weekly schedule that shows every reserved space on campus.

The app runs entirely in the browser. It is built with HTML, CSS, and JavaScript, with no backend server and no database.

**Technologies:** HTML, CSS (Tailwind), JavaScript (DOM, events, fetch, localStorage)
**Team:** Hammad and Ahmed

---

## The Problem

Students and staff often waste time walking between buildings to find an empty room, or they book a room that is already taken. Campus timetables are spread across many files and are hard to scan for free time slots. RoomRadar brings the free-space information into one place and makes sure a room cannot be booked twice for overlapping times.

---

## Features

**Room finder**
- Choose a day, a start time, and an end time
- See only the rooms that are free for the whole time range
- Filter by building, space type (Lab, Lecture Hall, Meeting Room, Seminar, or Conference), and minimum capacity
- Each result shows the room's type, capacity, floor, and building

**Live search**
- Type a room name, building, or space type to narrow the results instantly
- Works on the results from your most recent search

**Booking**
- Book any available room with one click
- The app checks availability again before saving, so a room cannot be double-booked
- After booking, the room disappears from the results, and the page switches to your bookings

**My bookings**
- See all your bookings, sorted by day and time
- Cancel any booking, and the room becomes available again
- Your bookings are kept after you close and reopen the page

**Schedule**
- See every booked room on campus, grouped by day
- Your own bookings are marked "Your booking"

**Overview**
- Summary cards show the number of rooms, buildings, and scheduled sessions

**Navigation and accessibility**
- Three tabs: Home, Bookings, and Schedule
- Arrow keys move between tabs
- Clear messages for empty results, invalid times, and failed saves

---

## How It Works

```
Choose day and time  →  Search  →  Free rooms shown  →  Book a room
      →  Saved in your browser  →  Shown in My Bookings and Schedule
```

1. The app loads the campus data: ten rooms across three buildings, plus the existing bookings.
2. When you search, each room is checked against every booking for that day. A room is hidden if any booking overlaps the time you chose.
3. Booking adds your reservation to the list of bookings and saves it in your browser.
4. Cancelling removes it from that list, and the room is free again.

---

## Technologies and Concepts

- **HTML** for the page structure, including forms with built-in validation
- **CSS and Tailwind** for layout and styling
- **JavaScript** for all behavior, with no libraries
- **DOM manipulation** to build and update result cards, bookings, and the schedule
- **Event handling** for clicks, typing, form submission, and keyboard navigation
- **fetch and JSON** to load the campus data
- **localStorage** to keep your bookings between visits
- **Time logic** that turns times into minutes to check for overlapping bookings

---

## Learning Outcomes

RoomRadar demonstrates how to:

- build a multi-section web page with tabs and a single shared state
- load and validate data from a file
- check time overlaps and filter lists with array methods
- keep the page and saved data in step with each other
- handle errors so the page explains what went wrong instead of breaking

---

## Limitations

- **Bookings belong to the browser, not the person.** There is no login, so the same person on another computer will not see their bookings, and anyone using that browser sees the same ones.
- **No real-time sync.** If the page is open in two tabs, changes made in one do not appear in the other until the page is reloaded.
- **No opening hours.** Any time from midnight to 23:59 can be booked, even when a building would be closed.
- **Data is fixed.** Rooms and existing bookings come from a single data file. Spaces cannot be added, edited, or removed through the app.
- **No admin or approval.** Anyone can book any free room, with no approval step or priority for certain users.
- **No shared data.** Bookings are not sent to a server, so other users cannot see what you booked, and the schedule only shows the bookings saved on the current browser plus the base campus data.
- **Needs a web server to load data.** The page cannot read the data file when it is opened straight from the disk.
- **Styling needs a build step.** The styles are written with Tailwind CSS, which must be compiled before the page looks correct.
- **Limited accessibility testing.** The page includes accessibility features, but it has not been tested with screen readers or on every device.

---

## Future Improvements

- Add user accounts so bookings follow the person, not the browser
- Store bookings on a server or in a database, shared across all users
- Add opening hours for each building and reject times outside them
- Add an admin page to manage rooms and approve requests
- Send reminders before a booked time
- Allow recurring bookings, such as the same room every Monday
- Show a map of the campus with the free rooms marked
