let rooms = [];
let bookings = [];
let myBookings = [];
let matchingRooms = [];
let hasSearched = false;
let activeSearch = null;
let bookingStorageError = "";

const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const bookingsStorageKey = "roomradar.userBookings";

async function loadData() {   // this function will fetch data from JSON file
                                  // it will be called it startapp funtion
    try {

        let response = await fetch("data_set.json");

        let data = await response.json();

         rooms = data.rooms;
         bookings=data.bookings;

    }

    rooms = data.rooms;
    bookings = [...data.bookings];
    myBookings = [];
    bookingStorageError = "";
    try {
        loadSavedBookings();
    } catch (error) {
        bookings = [...data.bookings];
        myBookings = [];
        bookingStorageError = error.message;
    }

    document.getElementById("stat-rooms").textContent = String(rooms.length);
    document.getElementById("stat-buildings").textContent = String(new Set(rooms.map((room) => room.building)).size);
    document.getElementById("stat-bookings").textContent = String(bookings.length);

    populateSelect("user-building", [...new Set(rooms.map((room) => room.building))].sort(), "Any building");
    populateSelect("user-type", [...new Set(rooms.map((room) => room.type))].sort(), "Any type");
    populateSelect("user-day", weekdayOrder, "Select a day");
    renderBookings();
    renderSchedule();
    if (bookingStorageError) {
        showBookingFeedback(`Saved bookings could not be loaded: ${bookingStorageError}`, true);
    }
}

function loadSavedBookings() {
    const savedBookings = localStorage.getItem(bookingsStorageKey);
    if (!savedBookings) {
        return;
    }

function timetominutes(time){   // this function will convert hours to minute and ad will minutes
    let parts=time.split(":");   // 3:45 will be return as 225 minutes
    let hour=Number(parts[0]);
    let minute=Number(parts[1]);

   return (hour*60)+minute;


    parsedBookings.forEach((booking) => {
        const roomExists = rooms.some((room) => room.id === booking.roomId);
        if (
            typeof booking.id !== "string" ||
            !roomExists ||
            !weekdayOrder.includes(booking.day) ||
            !isValidTime(booking.start) ||
            !isValidTime(booking.end) ||
            timeToMinutes(booking.end) <= timeToMinutes(booking.start) ||
            isRoomBusy(booking.roomId, booking.day, booking.start, booking.end)
        ) {
            throw new Error("A saved booking is invalid or conflicts with another booking.");
        }
        bookings.push(booking);
        myBookings.push(booking);
    });
}

function isRoomBusy(roomId, day, start, end){   // it will return whether room is busy or not 
    const timestarts=timetominutes(start);  // converting time of both starting and ending in minutes
    const timeends=timetominutes(end);

    
    for(let i=0;i<bookings.length;i++){   //bookings.length is how many total block bookings we have

         if (bookings[i].roomId===roomId && bookings[i].day === day){  //bookings[i].roomid is the room id written in JSON file
                 const bookingstart=timetominutes(bookings[i].start);   // roomid  which is compared with bookings[i].roomid is the one user gave
        const bookingend=timetominutes(bookings[i].end);

function isValidTime(time) {
    if (typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time)) {
        return false;
    }

    const [hour, minute] = time.split(":").map(Number);
    return hour < 24 && minute < 60;
}

function getFreeRooms(day, start, end){  //give all free rooms at the given time slots

    return bookings.some((booking) => {
        if (booking.roomId !== roomId || booking.day !== day) {
            return false;
        }

        if (!isValidTime(booking.start) || !isValidTime(booking.end)) {
            return true;
        }

        return timeToMinutes(booking.start) < requestedEnd && timeToMinutes(booking.end) > requestedStart;
    });
}

function applyFilters(rooms, filters){    //when a time is entered it is possible that many rooms appeared of different building at same time, thats why it will search for only specific filter user has given,like i want this room in this building
    const filtered_rooms=[];

    for(let i=0;i<rooms.length;i++){

function showBookingFeedback(message, isError) {
    const feedback = document.getElementById("booking-feedback");
    feedback.textContent = message;
    feedback.classList.toggle("text-red-700", isError);
    feedback.classList.toggle("text-slate-600", !isError);
}

function groupRooms(rooms){            //it will give the result in a organized order like building => floor => class/lab
    const result={};
   
    for(let i=0;i<rooms.length;i++){
      const current_building=rooms[i].building;
      const  current_floor=rooms[i].floor;
       
      if(result[current_building]===undefined){
        result[current_building]={};
      }
      if(result[current_building][current_floor]===undefined){
          result[current_building][current_floor]=[];
      }
       result[current_building][current_floor].push(rooms[i]);
    }

    return result;
}

function renderSchedule() {
    const container = document.getElementById("schedule-list");
    container.replaceChildren();

    weekdayOrder.forEach((day) => {
        const dayBookings = bookings
            .filter((booking) => booking.day === day)
            .sort((a, b) => {
                const aHasTime = isValidTime(a.start);
                const bHasTime = isValidTime(b.start);
                if (!aHasTime || !bHasTime) {
                    return Number(!aHasTime) - Number(!bHasTime);
                }
                return timeToMinutes(a.start) - timeToMinutes(b.start);
            });
        const section = document.createElement("section");
        section.className = "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm";
        const toggle = document.createElement("button");
        const panelId = `schedule-day-${day.toLowerCase()}`;
        toggle.type = "button";
        toggle.dataset.toggleDay = "";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", panelId);
        toggle.className = "flex w-full items-center justify-between gap-3 p-5 text-left transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-900/10";
        const heading = document.createElement("span");
        heading.className = "font-bold text-slate-950";
        heading.textContent = day;
        const daySummary = document.createElement("span");
        daySummary.className = "flex items-center gap-3";
        const count = document.createElement("span");
        count.className = "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600";
        count.textContent = `${dayBookings.length} ${dayBookings.length === 1 ? "session" : "sessions"}`;
        const indicator = document.createElement("span");
        indicator.className = "text-slate-400";
        indicator.dataset.dayIndicator = "";
        indicator.setAttribute("aria-hidden", "true");
        indicator.textContent = "+";
        daySummary.append(count, indicator);
        toggle.append(heading, daySummary);
        const panel = document.createElement("div");
        panel.id = panelId;
        panel.className = "border-t border-slate-100 px-5";
        panel.hidden = true;

        if (dayBookings.length === 0) {
            const empty = document.createElement("p");
            empty.className = "py-4 text-sm text-slate-500";
            empty.textContent = "No sessions scheduled.";
            panel.append(empty);
        }

 function searchRooms(day, start, end, filters){   // it runs after the validation of input
  let  freerooms=getFreeRooms(day,start,end);       // give all free rooms at the given time slots
   let filteredRooms=applyFilters(freerooms, filters); //when a time is entered it is possible that many rooms appeared of different building at same time, thats why it will search for only specific filter user has given
   let groupedrooms=groupRooms(filteredRooms);          //it will give the result in a organized order like building => floor => class/lab

function renderResults() {
    const container = document.getElementById("result");
    const emptyState = document.getElementById("results-empty");
    const count = document.getElementById("results-count");
    const summary = document.getElementById("results-summary");
    const query = document.getElementById("room-search").value.trim().toLowerCase();
    const visibleRooms = matchingRooms.filter((room) =>
        `${room.name} ${room.building} ${room.type}`.toLowerCase().includes(query)
    );

    container.querySelectorAll("[data-room-card]").forEach((card) => card.remove());
    count.classList.remove("hidden");
    count.textContent = `${visibleRooms.length} ${visibleRooms.length === 1 ? "space" : "spaces"}`;

    if (visibleRooms.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("empty-title").textContent = hasSearched ? "No rooms match those filters." : "Your next open space is waiting.";
        document.getElementById("empty-message").textContent = query
            ? "Try a different room name or building."
            : "Try another time or adjust your filters.";
        summary.textContent = query ? `No matches for “${document.getElementById("room-search").value.trim()}”.` : "Try adjusting your search to see more spaces.";
        return;
    }

 function validateInput(day, start, end) {             // this is a validate function will run after taking input from readinput()
    const container = document.getElementById("result");

    if (day === "" || start === "" || end === "") {
        container.innerHTML = "Please fill in the day, start time, and end time.";
        return false;
    }

    if (timetominutes(end) <= timetominutes(start)) {
        container.innerHTML = "End time must be later than start time.";
        return false;
    }

    return true;
}

 function readinput(){         //it runs when the user hit the search button 
        
     let user_day=document.getElementById("user-day").value;
    let user_given_start= document.getElementById("start-time").value;
   let  user_given_end=document.getElementById("end-time").value;
     let  user_given_building=document.getElementById("user-building").value;
     let  user_given_type=document.getElementById("user-type").value;
    let  user_given_floor=document.getElementById("user-floor").value;
     let  user_given_capacity=document.getElementById("user-capacity").value;
const filters = {
    building: user_given_building,
    type: user_given_type,
    floor: user_given_floor,
    capacity: user_given_capacity
};

const returntype = {
    filters,
    day: user_day,
    start: user_given_start,
    end: user_given_end
};

return returntype;
       
 }

 async function startapp(){    // this will act as a main function and starting point of everything
     await loadData();    //this will wait and loads the data before going to anything

    myBookings = updatedBookings;
    bookings = bookings.filter((item) => item !== booking);
    document.getElementById("stat-bookings").textContent = String(bookings.length);
    if (activeSearch) {
        matchingRooms = searchRooms(activeSearch.day, activeSearch.start, activeSearch.end, activeSearch.filters);
        renderResults();
    }
    renderBookings();
    renderSchedule();
    showBookingFeedback("Booking cancelled.", false);
}

        if(!validateInput(input.day, input.start, input.end)){
            return; 
     }
    
     const result = searchRooms(input.day, input.start, input.end, input.filters);
        display(result);
    });

    document.querySelectorAll("[data-panel]").forEach((panel) => {
        const isActive = panel.dataset.panel === tabName;
        panel.hidden = !isActive;
        panel.classList.toggle("hidden", !isActive);
    });
}

async function startApp() {
    const form = document.getElementById("room-finder");
    const endTimeInput = document.getElementById("end-time");

function  display(result){  // this will show the grouped rooms / it helps in printting
    let container=document.getElementById("result");
   
    if( Object.keys(result).length===0){
        container.innerHTML="No free rooms found";
        return;
    }

            event.preventDefault();
            const tabs = [...document.querySelectorAll("[data-tab]")];
            const currentIndex = tabs.indexOf(tab);
            const offset = event.key === "ArrowRight" ? 1 : -1;
            const nextTab = tabs[(currentIndex + offset + tabs.length) % tabs.length];
            activateTab(nextTab.dataset.tab, true);
        });
    });
    document.querySelectorAll("[data-go-home]").forEach((button) => {
        button.addEventListener("click", () => activateTab("home", false));
    });
    document.getElementById("result").addEventListener("click", (event) => {
        const button = event.target.closest("[data-book-room]");
        if (button) {
            bookRoom(button.dataset.bookRoom);
        }
    });
    document.getElementById("bookings-list").addEventListener("click", (event) => {
        const button = event.target.closest("[data-cancel-booking]");
        if (button) {
            cancelBooking(button.dataset.cancelBooking);
        }
    });
    document.getElementById("schedule-list").addEventListener("click", (event) => {
        const button = event.target.closest("[data-toggle-day]");
        if (!button) {
            return;
        }

        const expanded = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(expanded));
        document.getElementById(button.getAttribute("aria-controls")).hidden = !expanded;
        button.querySelector("[data-day-indicator]").textContent = expanded ? "-" : "+";
    });
    document.getElementById("room-search").addEventListener("input", () => {
        if (hasSearched) {
            renderResults();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        endTimeInput.setCustomValidity("");

        const start = document.getElementById("start-time").value;
        const end = endTimeInput.value;
        if (start && end && timeToMinutes(end) <= timeToMinutes(start)) {
            endTimeInput.setCustomValidity("Choose an end time after the start time.");
        }
        if (!form.reportValidity()) {
            return;
        }

        const filters = {
            building: document.getElementById("user-building").value,
            type: document.getElementById("user-type").value,
            capacity: document.getElementById("user-capacity").value
        };
        activeSearch = {
            day: document.getElementById("user-day").value,
            start,
            end,
            filters
        };
        matchingRooms = searchRooms(activeSearch.day, start, end, filters);
        hasSearched = true;
        renderResults();
    });

    endTimeInput.addEventListener("input", () => endTimeInput.setCustomValidity(""));

    try {
        await loadData();
    } catch (error) {
        console.error("RoomRadar could not load campus data.", error);
        document.getElementById("results-summary").textContent = "Campus data could not be loaded.";
        document.getElementById("empty-title").textContent = "We couldn’t load campus spaces.";
        document.getElementById("empty-message").textContent = error.message;
        document.getElementById("search_button").disabled = true;
        document.getElementById("search_button").classList.add("cursor-not-allowed", "opacity-50");
    }
}

startApp();
