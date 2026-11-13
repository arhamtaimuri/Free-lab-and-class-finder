
let rooms=[];
let bookings=[];



async function loadData() {   // this function will fetch data from JSON file
                                  // it will be called it startapp funtion
    try {

        let response = await fetch("data_set.json");

        let data = await response.json();

         rooms = data.rooms;
         bookings=data.bookings;

    }
    catch (error) {

        console.log("Error:", error);

    }
}


function timetominutes(time){   // this function will convert hours to minute and ad will minutes
    let parts=time.split(":");   // 3:45 will be return as 225 minutes
    let hour=Number(parts[0]);
    let minute=Number(parts[1]);

   return (hour*60)+minute;


}

function isRoomBusy(roomId, day, start, end){   // it will return whether room is busy or not 
    const timestarts=timetominutes(start);  // converting time of both starting and ending in minutes
    const timeends=timetominutes(end);

    
    for(let i=0;i<bookings.length;i++){   //bookings.length is how many total block bookings we have

         if (bookings[i].roomId===roomId && bookings[i].day === day){  //bookings[i].roomid is the room id written in JSON file
                 const bookingstart=timetominutes(bookings[i].start);   // roomid  which is compared with bookings[i].roomid is the one user gave
        const bookingend=timetominutes(bookings[i].end);

       if(bookingstart<timeends && bookingend>timestarts){
        return true;
        
    }
         }
       
   
}
return false;
    
}

function getFreeRooms(day, start, end){  //give all free rooms at the given time slots

      const freerooms=[];
    for(let i=0;i<rooms.length;i++){
        const isbusy=isRoomBusy(rooms[i].id,day,start,end);

        if(!isbusy){
            freerooms.push(rooms[i]);
        }
    }

    return freerooms;
}

function applyFilters(rooms, filters){    //when a time is entered it is possible that many rooms appeared of different building at same time, thats why it will search for only specific filter user has given,like i want this room in this building
    const filtered_rooms=[];

    for(let i=0;i<rooms.length;i++){

        if(filters.building==="" || rooms[i].building===filters.building ){
            if(filters.type==="" || rooms[i].type===filters.type){
                if(filters.floor==="" || rooms[i].floor===Number(filters.floor)){
                    if(filters.capacity==="" || rooms[i].capacity>=Number(filters.capacity)){
                               filtered_rooms.push(rooms[i]);
                    }
                }
            }
          
        }
    }
    return filtered_rooms;
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


 function searchRooms(day, start, end, filters){   // it runs after the validation of input
  let  freerooms=getFreeRooms(day,start,end);       // give all free rooms at the given time slots
   let filteredRooms=applyFilters(freerooms, filters); //when a time is entered it is possible that many rooms appeared of different building at same time, thats why it will search for only specific filter user has given
   let groupedrooms=groupRooms(filteredRooms);          //it will give the result in a organized order like building => floor => class/lab

   return groupedrooms;
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

     document.getElementById("search_button").addEventListener("click",function(){
          const input=readinput();

        if(!validateInput(input.day, input.start, input.end)){
            return; 
     }
    
     const result = searchRooms(input.day, input.start, input.end, input.filters);
        display(result);
    });

}

startapp();

function  display(result){  // this will show the grouped rooms / it helps in printting
    let container=document.getElementById("result");
   
    if( Object.keys(result).length===0){
        container.innerHTML="No free rooms found";
        return;
    }

    let html = "";

    for (let building in result) {
  html += "<h2>Building " + building + "</h2>";              
    for (let floor in result[building]) {
     html += "<h3>Floor " + floor + "</h3>";            
       let roomsOnFloor = result[building][floor];
for (let i = 0; i < roomsOnFloor.length; i++) {
    html += "<p>" + roomsOnFloor[i].name + " - " + roomsOnFloor[i].type + " - Capacity: " + roomsOnFloor[i].capacity + "</p>";
}
    }
}

container.innerHTML = html;

}



    
